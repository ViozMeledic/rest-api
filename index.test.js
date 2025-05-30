const superagent = require('superagent')
const expect = require('expect.js')

describe('express rest api server', function () {
    var id

    it('post an object', function (done) {
        superagent.post('http://localhost:3000/users')
            .send({
                name: 'test1',
                email: 'test1@email.com'
            })
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.statusCode).to.eql(201)
                expect(typeof res.body).to.eql('object')
                expect(res.body.id.length).to.eql(24)
                id = res.body.id
                done()
            })
    })

    it('retrieves an object', function (done) {
        superagent.get('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.statusCode).to.eql(200)
                expect(typeof res.body).to.eql('object')
                expect(res.body.users).to.length(1)
                expect(res.body.users[0]._id).to.eql(id)
                done()
            })
    })

    it('retrieves a collection', function (done) {
        superagent.get('http:///localhost:3000/users')
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.body.code).to.eql('ok')
                expect(JSON.stringify(res.body).length).to.be.above(0)
                expect(res.body.users.length).to.be.above(0)
                done()
            })
    })

    it('retrieves a fixed-sized collection', function (done) {
        superagent.get('http:///localhost:3000/users?page=1&size=2')
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.body.code).to.eql('ok')
                expect(res.body.users).to.length(2)
                expect(JSON.stringify(res.body).length).to.be.above(0)
                done()
            })
    })

    it('updates an existing object', function (done) {
        superagent.put('http://localhost:3000/users/' + id)
            .send({ name: 'test2', email: 'test2@email.com' })
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.statusCode).to.eql(200)
                expect(typeof res.body).to.eql('object')
                expect(res.body.users).to.length(1)
                expect(res.body.users[0].name).to.eql('test2')
                expect(res.body.users[0].email).to.eql('test2@email.com')
                expect(res.body.users[0].lastModified).to.above(res.body.users[0].createdDate)
                done()
            })
    })

    it('updates an non-existing object', function (done) {
        const newId = '6838653155e0939e5bf2005e'
        superagent.put('http://localhost:3000/users/' + newId)
            .send({ _id: newId, name: 'test2', email: 'test2@email.com' })
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.statusCode).to.eql(201)
                expect(typeof res.body).to.eql('object')
                expect(res.body.id.length).to.eql(24)
                expect(res.body.id).to.eql(newId)
                done()
            })
    })

    it('removes an existing object', function (done) {
        superagent.del('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.statusCode).to.eql(204)
                expect(typeof res.body).to.eql('object')
                done()
            })
    })

    it('removes an non-existing object', function (done) {
        superagent.del('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.not.eql(null)
                expect(res.statusCode).to.eql(404)
                expect(typeof res.body).to.eql('object')
                done()
            })
    })
})