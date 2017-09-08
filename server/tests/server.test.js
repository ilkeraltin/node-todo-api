const request = require('supertest');
const expect = require('chai').expect;
const { ObjectID } = require('mongodb');
const { app }  = require('./../server');
const { Todo } = require('./../models/todo');

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

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})

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

    
})
