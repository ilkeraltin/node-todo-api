require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000 ;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
    let newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    },(err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req,res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    })
})

app.get('/todos/:id',authenticate,(req,res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('id is not valid!');
    }

    Todo.findOne({
        _id:id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send('todo not found!');
        }

        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    })
})


app.delete('/todos/:id',authenticate,(req,res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('id is not valid!');
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    })
});

app.patch('/todos/:id', authenticate, (req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(404).send();
    })
})


app.post('/users', (req,res) => {
    let body = _.pick(req.body,['email','password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    })
    .then((token) => {
        res.header('x-auth',token).send(user);
    })
    .catch((err) => {
        res.status(400).send(err);
    })
});


app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email','password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send();
    })
});



app.listen(port, () => {
    console.log(`server is up at port:${port}`);
});
module.exports = { app };