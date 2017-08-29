const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('unable to connect db', err);
    }
    console.log('connected to mongodb server');
/* 
    db.collection('Todos').insertOne({
        text: 'this is todo item',
        completed: false
    }, (err,res) => {
        if (err) {
            console.log('unable to insert item: ',err);
        }
        console.log(JSON.stringify(res.ops,undefined,2));
    }); */

  /*   db.collection('Users').insertOne({
        name: 'ilker',
        age: 32,
        location: 'istanbul'
    }, (err,res) => {
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(res.ops,undefined,2));
        console.log(res.ops[0]);
    }); */


    db.close();
});