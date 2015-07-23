'use strict';

var http=require('http'),
    async=require('async'),
    AlchemyAPI = require('../alchemyapi_node/alchemyapi'),
    FusekiProxy = require('../lib/FusekiProxy'),
    watson = require('watson-developer-cloud'),
    qaconfig = require('../config/qaconfig.json');

module.exports = function(app) {
	var alchemyapi = new AlchemyAPI();
	var qaService = watson.question_and_answer(qaconfig);
	var proxy = new FusekiProxy();

	app.post('/question/annotate', function(req,res,next ){
		if(req.body && req.body.question) {
		    qaService.ask({text:req.body.question},function(err,response){
			if(err) {
				res.status(500).json(JSON.stringify({ status: 500,
					message:"problem communicating with Watson.",
					error:err
				}));
				return;
			}

			//QA Service on Bluemix returns an array
			var evidencelist = response[0].question.evidencelist;

			async.mapLimit(evidencelist, 1, alchemyHandler, function(err,results) {
console.log('mapLimit returning');
				res.status(200).json(results).end(http.STATUS_CODES[200]);
			});

			function alchemyHandler(evidence,callback) {
console.log('enter');
			    var answer = {
			        "confidence": evidence.value,
				"text":evidence.text,
				"entities":[]
			    };
			    alchemyapi.entities('text', answer.text, {'showSourceText':1}, function(ent){
				async.eachSeries(ent.entities, function(entity,cb) {
					annotateAnswer(answer,entity,cb);
				},
				function(err) {
					if(err) {
console.log('error');
						callback(err,null);
					} else {
console.log('success');
			    			callback(null,answer);
					}
				});
			    });

			    function annotateAnswer(answer, original_entity, cb) {
				//filtering out those entities that do not have dbpedia linked data
		                if(original_entity.disambiguated && original_entity.disambiguated.dbpedia) {
				    var entity = {
					"type": original_entity.type,
					"name": original_entity.text,
					"shortAbstract": '',
			                "annotations": []
				    };
				    //call Fuseki
				    proxy.query(original_entity.disambiguated.dbpedia)
				    .then(function(data) {
					if(data.results.bindings[0].comment.value) {
						entity.shortAbstract = data.results.bindings[0].comment.value;
		                    		answer.entities.push(entity);
		                    		var index =0;
		                    		while((index = answer.text.indexOf(entity.name,index)) >= 0) {
			                		entity.annotations.push({
				               		 	start:index,
				               		 	end:index+entity.name.length
			                		});
			                		index += entity.name.length;	
		                    		}
					}
					console.log('calling cb');
					cb();
				    });
		                } else {
					//call callback 
					cb();
				}
	                     };
			};
		    });
		}
	});

}
