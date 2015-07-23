FROM registry-ice.ng.bluemix.net/ibmnode:latest
MAINTAINER Chris Madison "cmadison@us.ibm.com"
EXPOSE 80

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git && mkdir -p /opt/devworks/dwannotate
COPY ./src /opt/devworks/dwannotate
RUN cd /opt/devworks/dwannotate && npm install

WORKDIR /opt/devworks/dwannotate
CMD ["./bin/www"]
