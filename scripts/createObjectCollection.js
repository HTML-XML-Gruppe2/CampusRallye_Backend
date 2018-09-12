var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";


mongo.connect(url, function (err, db) {
    if (err) throw err;
    database = db.db("CampusRallye");

    database.createCollection("objects", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "description","position"],
                properties: {
                    name: {
                        bsonType: "string",
                    },
                    description: {
                        bsonType: "string",
                    },
                    position: {
                        bsonType: "object",
                        required: ["x", "y"],
                        properties: {
                            x: {
                                
                            },
                            y: {
                                
                            }
                        }
                    },
                    questions: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["text", "answers"],
                            properties: {
                                text: {
                                    bsonType: "string"
                                },
                                answers: {
                                    bsonType: "array",
                                    items: {
                                        bsonType: "object",
                                        required: ["text", "correct"],
                                        properties: {
                                            text: {
                                                bsonType: "string"
                                            },
                                            correct: {
                                                bsonType: "bool"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
}); 