const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const id = '59b1962a67efaa13ef1cc4b4';
const userId = '59af080b44760b1f8da9665b';

if (!ObjectID.isValid(id)) {
    console.log('ID is invalid!');
}

/* Todo.find({
    _id: id
}).then((todos) => {
    console.log('todos )=>>>', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('todo =>>>>', todo);
}); */

/* Todo.findById(id).then((res) => {
    if (!res) {
        return console.log('id not found!');
    }
    console.log('Todo by Id:',res);
}).catch((e) => {
    console.log(e);
}) */

User.findById(userId).then((user) => {
    if(!user) {
        return console.log('user not found!');
    }
    console.log('User',user);
}).catch((err) => {
    console.log(err);
})