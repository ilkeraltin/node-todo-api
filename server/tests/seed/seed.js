const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');


userOneId = new ObjectID();
userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'ilker@altin.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'alper@altin.com',
    password: 'userTwoPass'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'this is first test todo'
}, {
    _id: new ObjectID(),
    text: 'this is second test todo',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    text: 'this is third test todo'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}
const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    })

}

module.exports = { todos, populateTodos, populateUsers, users };