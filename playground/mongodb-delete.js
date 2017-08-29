const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('unable to connect db', err);
    }
    console.log('connected to mongodb server');

   /*  db.collection('Todos').deleteMany({text: 'buy books'}).then((result) => {
        console.log(result);
    }); */

    /* db.collection('Todos').deleteOne({text: 'go to London'}).then((result) => {
        console.log(result);
    });  */

    /* db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    })
 */
   /*  db.collection('Users').deleteMany({name:'ilker'}).then((result) => {
        console.log(result);
    }); */

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('59a57cfae21bfd4b9621224d')
    })
    .then((result) => {
        console.log(result);
    })
    //db.close();
});