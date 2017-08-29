const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('unable to connect db', err);
    }
    console.log('connected to mongodb server');

   /*  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('-------- Todos --------');
        console.log(JSON.stringify(docs,undefined, 2));
    }, (err) => {
       console.log(err);  
    }); */

    /* db.collection('Todos').find({
        _id: new ObjectID('59a579dfe21bfd4b96212139')
    }).toArray().then((docs) => {
        console.log('-------- Todos --------');
        console.log(JSON.stringify(docs,undefined, 2));
    }, (err) => {
       console.log(err);  
    }); */

   /*  db.collection('Todos').find().count().then((count) => {
        console.log(`there are ${count} todos waiting...`);
    }, (err) => {
       console.log(err);  
    }); */

    db.collection('Users').find({
        name: 'ilker'
    }).toArray().then((docs) => {
        console.log('------ All Ilker records ------');
        console.log(JSON.stringify(docs,undefined,2));
    },(err) => {
        console.log(err);
    });

    //db.close();
});