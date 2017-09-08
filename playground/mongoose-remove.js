const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


/* Todo.remove({}).then((result) => {
    console.log(result);
}); */


Todo.findByIdAndRemove('59b2a3eedaf364a9af06430d').then((res) => {
    console.log(res);
})
