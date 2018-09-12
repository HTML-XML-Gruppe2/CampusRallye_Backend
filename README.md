# CampusRallye_Backend

The Backend of the Project "CampusRallye" is built using Node.js. It uses express.js to provide a HTTPS-Server for the static frontend and a REST-API for asyc communication. The requested information is delivered by `database-handler.js` which connnects to a mongoDB database.

In order to run the backend, first download [mongoDB](https://www.mongodb.com/download-center#community) and get it running as a service with the (default) port 27017 or change the port in `database-handler.js`.

Then install the dependencies of the project using 
```
npm install
```
By executing the scripts in the folder `scripts/` the database collections (tables) can be created:
```
node createHighscoreCollection.js

node createObjectCollection.js
```

Furthermore, the path to the project Frontend must be set in `server.js` by changing the variable `frontendPath`

After these steps you should be able to start the server by executing
```
npm start
```

This also generates the REST-API documentation within `apidoc/result/`


##### Additional note:
The folder `https/` contains a key and a certificate which are needed for https communication. These are self-signed test files which should **never** be used productive