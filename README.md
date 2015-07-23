This project ties togther several Bluemix technologies to provide a Watson annotation service. This project is to run as an IBM Container (Docker) as a microservice.

Users submit inquiries to the Watson passage-based Question and Answer Travel corpus and answers that
have been enriched by the application. Enrichement starts with named entity recognition. We are using the Entity Extraction API from AlchemyAPI to identify named entities in the Watson Q&A answers. 

Named entities are then enriched using an Apache-based Fuseki service.

The results are returned to the calling application. The results are a set of answers, with annotations that provide an enriched information.


GETTING STARTED

_ALCHEMYAPI_
Obtain an AlchemyAPI key here: http://www.alchemyapi.com/api/register.html
clone the the alchemyapi_node SDK in the src directory
cd into ./src/alchemyapi\_node directory and create an api\_key.txt containing your key



GENERAL INSTRUCTIONS
cf login
suco cf ic login
docker build -t dwannotate .
docker tag dwannotate registry.ng.bluemix.net/{your registry}/dwannotate
docker push registry.ng.bluemix.net/{your registry}/dwannotate
