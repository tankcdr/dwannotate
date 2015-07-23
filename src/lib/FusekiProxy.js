'use strict'
var http = require("http"),
    Q = require("q"),
    config = require("../config/fuseki.json")

function FusekiProxy () { 
} 

//queries Fuseki 
//target = the target dbpedia resource to provide enhanced data
//         format of 'http://dbpedia.org/resource/{Resource}'
//returns a promise (Q style)
FusekiProxy.prototype.query = function query(target) {
	//TODO add target validation
	var query = config.query.replace(config.regex,target);
	return queryFuseki(query);
}

	function queryFuseki(query) {
		var deferred = Q.defer();

		var myOptions = {};
		myOptions.host = config.options.host;
		myOptions.port = config.options.port;
		myOptions.path = config.options.path+"?query="+encodeURIComponent(query)+"&output=json";
		myOptions.method = config.options.method;
		myOptions.headers = config.options.headers;

		var request = http.request(myOptions,function(response) {
			var data = '';

			response.on('data',function(chunk) {
				data += chunk;
			});

			response.on('end',function() {
				deferred.resolve(JSON.parse(data));
			});

			response.on('error',function(err) {
				deferred.reject(err);
			});
		});

		request.on('error',function(err){
			deferred.reject(err);
		});

		request.write(query);
		request.end();

		return deferred.promise;
	}

module.exports=FusekiProxy;

