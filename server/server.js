const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

let app = express();
app.use(bodyParser.json());


app.post('/todos', (req,res) => {
    let newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    },(err) => {
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    })
})

app.get('/todos/:id',(req,res) => {
    let id = req.params.id;
    Todo.findById(id).then((todo) => {
        if (!ObjectID.isValid(id)) {
            return res.status(404).send('id is not valid!');
        }

        if (!todo) {
            return res.status(404).send('todo not found!');
        }

        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    })
})


app.listen(3000, () => {
    console.log('server is up at port:3000');
});
module.exports = { app };