var express = require('express')
var fs = require('fs')
var https = require('https')
var dbHandler = require("./database-handler");
var app = express();

var frontendPath = "C:\\Users\\jansenjon\\Desktop\\5. Semester\\6. HTML,XML und Usability\\CampusRallye\\CampusRallye_Frontend";

app.use(express.json());
dbHandler.init();


//################ REST API ###############################

app.get('/api/object/:id', function (req, res) {

  dbHandler.getObjectInfo(req.params.id, function (err, result) {

    if (err) {
      res.status(404);
      res.send({ "error": err.message });
    } else {
      res.send(result);
    }
  });
});

app.get('/api/objects/basic', function (req, res) {

  dbHandler.getAllObjectBasics(function (err, result) {
    if (err) {
      res.status(404);
      res.send({ "error": err.message })
    }
    else {
      res.send(result);
    }
  });
});

app.post('/api/objects', function (req, res) {

  var object = req.body;

  dbHandler.addObject(object, function (err, result) {
    if (err) {
      res.status(400);
      res.send({ "error": err.message });
    } else {

      res.status(200);
      res.send(result);
    }
  });
});

app.delete('/api/object/:id', function (req, res) {

  dbHandler.deleteObject(req.params.id, function (err, result) {
    if (err) {
      res.status(404);
      res.send({ "error": err.message });
    } else {
      res.send();
    }
  });
});

app.get('/api/scores', function (req, res){

  dbHandler.getAllScores(function (err, result) {
    if (err) {
      res.status(404);
      res.send({ "error": err.message })
    }
    else {
      res.send(result);
    }
  });

});

app.post('/api/scores', function (req, res) {

  var score = req.body;

  dbHandler.addScore(score, function (err, result) {
    if (err) {
      res.status(400);
      res.send({ "error": err.message });
    } else {
      res.status(200);
      res.send(result);
    }
  });
});

app.delete('/api/score/:id', function (req, res) {

  dbHandler.deleteScore(req.params.id, function (err, result) {
    if (err) {
      res.status(404);
      res.send({ "error": err.message });
    } else {
      res.send();
    }
  });
});


//########################################################

app.use(express.static(frontendPath));

https.createServer({
  key: fs.readFileSync('https/server.key'),
  cert: fs.readFileSync('https/server.cert')
}, app)
  .listen(8080, "0.0.0.0", function () {
    console.log('Example app listening on port 8080!')
  })
