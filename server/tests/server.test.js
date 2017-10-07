const request = require('supertest');
const expect = require('chai').expect;
const { ObjectID } = require('mongodb');
const { app }  = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('TEST /todos', () => {
    it('should add a new todo', (done) => {
        let text = 'this is a test todo item';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                })
                .catch(err => done(err));
            })
    });

    it('should not create a new todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(3);
                    done();
                })
                .catch(err => done(err));
            });

    })
});

describe('GET /todos',() => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).to.equal(3);
            })
            .end(done);
    })
});

describe('GET /todos:id', () => {
    it('should return todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let randomId = new ObjectID().toHexString();
        //let randomId = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${randomId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
       // let randomId = new ObjectID().toHexString();
        // let randomId = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:id', () => {
    it('should remove item by id', (done) => {
        let hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).to.equal(hexId);
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(hexId).then((todos) => {
                expect(todos).to.be.null;
                done();
            })
            .catch(err => done(err));
        });
    });

    it('should return 404 if todo not found', (done) => {
        let randomId = new ObjectID().toHexString();
        //let randomId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${randomId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});


describe('PATCH /todos:id', () => {
    it('should update todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'updated by text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(text);
                expect(res.body.todo.completed).to.equal(true);
                expect(res.body.todo.completedAt).to.be.a('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'this should be a new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(text);
                expect(res.body.todo.completed).to.equal(false);
                expect(res.body.todo.completedAt).to.be.null;
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).to.equal(users[0]._id.toHexString());
                expect(res.body.email).to.equal(users[0].email)
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).to.deep.equal({});
            })
            .end(done);
    })
});

describe('POST /users', () => {
    it('should create user', (done) => {
        let email = 'example@ilker.com';
        let password = 'abc123';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).to.exist;
                expect(res.body._id).to.exist;
                expect(res.body.email).to.exist;
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(user).to.exist;
                    expect(user.password).to.not.equal(password);
                    done();
                }).catch((err) => done(err));
            });
    })

    it('should return validation error if request invalid', (done) => {
        let email = 'example.ilker.com';
        let password = '3';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    })

    it('should note create user if email in use', (done) => {
        let email = users[0].email;
        let password = '123456';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    })
})

describe('POST USERS /login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).to.exist;
            })
            .end((err,res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).to.include({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                })
                .catch((err) => done(err));
            })
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'wrongPassword'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).to.be.undefined;
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).to.equal(0);
                done();
            })
            .catch((err) => done(err));
        })
    })


})
