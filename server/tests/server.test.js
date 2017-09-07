const request = require('supertest');
const expect = require('chai').expect;

const { app }  = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    text: 'this is first test todo'
},{
    text: 'this is second test todo'
}, {
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
})

