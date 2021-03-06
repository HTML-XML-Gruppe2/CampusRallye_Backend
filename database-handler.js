var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var database;

module.exports = {

    //connect to database, must be called first
    init: function () {
        mongo.connect(url, function (err, db) {
            if (err) throw err;
            database = db.db("CampusRallye");

            console.log("Connected to Database")
        });
    },

    getObjectInfo: function (objectId, callback) {

        //create new Query, fails if the given objectid is not a valid mongoDB id
        try {
            var query = { _id: new ObjectId(objectId) };
        } catch (err) {
            callback(err, null);
            return;
        }
        database.collection("objects").find(query).toArray(function (err, result) {

            //check the query result
            if (err) throw err;
            if (result.length > 1) throw new Error("Multiple objects with same id");

            if (result.length == 0) {
                callback(new Error("object not found"), null);
            }
            else {
                callback(null, result[0]);
            }
        });
    },

    getAllObjectBasics: function (callback) {

        //basic info only contains object name, description and position
        var fields = { _id: 1, name: 1, description: 1, position: 1 };

        database.collection("objects").find({}, { projection: fields }).toArray(function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                callback(new Error("No objects found"), null);
            }
            else {
                callback(null, result);
            }
        });
    },

    addObject: function (object, callback) {
        try {
            validateInputObject(object);

            var completeObject = addQuestionIndices(object);

            database.collection("objects").insertOne(completeObject, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, { "objectId": res.insertedId });
                }
            })
        }
        catch (err) {
            callback(err, null)
        }
    },

    deleteObject: function (objectId, callback) {
        try {
            var query = { _id: new ObjectId(objectId) };
        } catch (err) {
            callback(err, null);
            return;
        }
        database.collection("objects").deleteOne(query, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                if (res.result.n == 0) {
                    callback(new Error("object not found"), null);
                } else {
                    callback(null, res);
                }
            }
        });
    },

    getAllScores: function(callback){
        var fields = { name: 1, score: 1 };

        database.collection("scores").find({}, { projection: fields }).toArray(function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                callback(new Error("No scores found"), null);
            }
            else {
                callback(null, result);
            }
        });
    },

    addScore: function (score, callback) {
        try {
            validateInputScore(score);


            database.collection("scores").insertOne(score, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, { "scoreId": res.insertedId });
                }
            })
        }
        catch (err) {
            callback(err, null)
        }
    },

    deleteScore: function (scoreId, callback) {
        try {
            var query = { _id: new ObjectId(scoreId) };
        } catch (err) {
            callback(err, null);
            return;
        }
        database.collection("scores").deleteOne(query, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                if (res.result.n == 0) {
                    callback(new Error("score not found"), null);
                } else {
                    callback(null, res);
                }
            }
        });
    }

};

//when new objects are created, the questions and answers are given indices
function addQuestionIndices(object)
{
    for(var i = 0; i < object.questions.length; i++)
    {
        object.questions[i].id = i;

        for(var j = 0; j < object.questions[i].answers.length; j++)
        {
            object.questions[i].answers[j].id = j;
        }
    }

    return object;
}

function validateInputScore(score){

    if(!score.hasOwnProperty("name")) throw new Error("score-item has no name");
    if(!score.hasOwnProperty("score")) throw new Error("score has no score");
}

//check if the object has the needed properties for a valid object
function validateInputObject(object) {

    if (!object.hasOwnProperty("name")) throw new Error("object has no name");
    if (!object.hasOwnProperty("description")) throw new Error("object has no description");
    if (!object.hasOwnProperty("position")) throw new Error("object has no position");
    if (!object.position.hasOwnProperty("x")) throw new Error("object position has no x-coordinate");
    if (!object.position.hasOwnProperty("y")) throw new Error("object position has no y-coordinate");

    if (!object.hasOwnProperty("questions")) throw new Error("object position has no questions");
    if (!Array.isArray(object.questions)) throw new Error("field 'questions' is not an array");
    if (object.questions.length == 0) throw new Error("array 'questions' contains no items");
    for (var i = 0; i < object.questions.length; i++) {

        var question = object.questions[i];
        if (!question.hasOwnProperty("text")) throw new Error("question " + i + " has no text");
        if (!question.hasOwnProperty("answers")) throw new Error("question " + i + " has no answers");
        if (!Array.isArray(question.answers)) throw new Error("answers of question " + i + " is not an array");
        if (question.answers.length < 2) throw new Error("question " + i + " has less than 2 answers");

        for (var j = 0; j < question.answers.length; j++) {
            var answer = question.answers[j];

            if (!answer.hasOwnProperty("text")) throw new Error("answer " + j + " of question " + i + " has no text");
            if (!answer.hasOwnProperty("correct")) throw new Error("answer " + j + " of question " + i + " has no 'correct' field");
        }

    }

}