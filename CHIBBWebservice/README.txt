Description
----------------
A node application that uses Express to act as the CHIBB house sensor API


Configuration
----------------
The Webservice can be configured by editing the config files in the 'config' folder.
The `default.json` acts as a configuration file for the local environment.
Once the application will be deployed to a production environment the `production.json` will be used as the configuration file.


Setup
----------------
The Webservice makes use of different node packages.
These packages can be installed by running the `npm install` command in the root/src/ folder.


Running
----------------
To run the webservice run the 'npm start' command in the root/src/ folder.


Deploying
----------------
An ANT script has been setup for deploying the webservice, see the 'build_tools' folder.
The script will execute its commands in the 'target' folder, which will be created when ran.

Build script steps:
1. Clean the 'target' folder
2. Create the needed directories within the 'target' folder
3. Fill the config files with values depending on the environment
4. Install all of the dependencies for the webservice
5. Run the unit tests
6. Generate the api doc
