const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('unable to connect db', err);
    }
    console.log('connected to mongodb server');

/*     db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('59a58af1e21bfd4b962127eb')
    },{
        $set: {
            completed: true
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }); */

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59a57d03e21bfd4b96212251')
    }, {
        $set: {
            name: 'ilker',
            location: 'söke'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});