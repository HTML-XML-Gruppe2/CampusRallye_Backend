var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";


mongo.connect(url, function (err, db) {
    if (err) throw err;
    database = db.db("CampusRallye");

    database.createCollection("scores", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "score"],
                properties: {
                    name:{
                        bsonType: "string"
                    },
                    name: {
                        bsonType: "int"
                    }
                }
            }
        }
    }, function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
}); 