Introduction
------------

This project contains two projects: dwbridge and dwannotate.

dwbridge is a simple bridge application that allows one to bind bluemix services and share those service bindings with an IBM Container (Docker) application.

dwannotate is a container-based application that receives end user inquiries and returns annotated answers from Watson. When the inquiry is received, the application first sends the inquiry to Watson to obtain a set of ranked answers. Each answer is sent to the AlchemyAPI Entity Extraction API to identify named entities. The identified identies are then used in a SPARQL query to a Fuseki service running in the Bluemix OpenStack implementation. The Fuseki service is hosting DBPedia short_abstract content.



Getting Started
---------------

First clone this repository:

>

> git clone https://github.com/tankcdr/dwannotate.git

>

### ALCHEMYAPI

Obtain an AlchemyAPI key here: http://www.alchemyapi.com/api/register.html
Clone the the alchemyapi_node SDK in the src directory

> cd ./src

> git clone https://github.com/AlchemyAPI/alchemyapi_node.git

> cd alchemyapi_node

> npm install

> node alchemyapi.js YOUR_API_KEY

> node app.js
> 


### Deploy dwbridge

> cd dwbridge

> cf push --no-start --no-route

> //create a qa service

> cf create-service question_and_answer question_and_answer_free_plan dwQA

> //bind the bridge

> cf bind-service dwbridge dwQA

> cf restart dwbridge //after app has been staged


### Deploy and run dwannotate

> //establish session

> cf login

> //establish container session

> sudo cf ic login

> //build image

> docker build -t dwannotate .

> //tag it

> docker tag -f dwannotate registry.ng.bluemix.net/{your registry}/dwannotate

> //push it

> docker push registry.ng.bluemix.net/{your registry}/dwannotate

