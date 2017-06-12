# CHIBB house API
_ICT-Lab Project_
Github repository: [https://github.com/swenmeeuwes/ICTLAB_CHIBB_RESTAPI](https://github.com/swenmeeuwes/ICTLAB_CHIBB_RESTAPI)

This project contains the following:
* DataProvider
* Webservice

## DataProvider
A small node application that sends random perlin noise data at set intervals to the webservice.
This application is used to fill the database with sample data.
### Setup
The Dataprovider makes use of different node packages.
These packages can be installed by running the `npm install` command in the root folder.

## Webservice
A node application that uses Express to act as the CHIBB house sensor API
### Setup
The Webservice makes use of different node packages.
These packages can be installed by running the `npm install` command in the root/src/ folder.
### Configuration
The Webservice can be configured by editing the config files in the 'config' folder.
The `default.json` acts as a configuration file for the local environment.
Once the application will be deployed to a production environment the `production.json` will be used as the configuration file.