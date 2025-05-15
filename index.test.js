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
                id = res.body.insertedId
                done()
            })
    })

    it('retrieves an object', function (done) {
        superagent.get('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body._id).to.eql(id)
                done()
            })
    })

    it('retrieves a collection', function (done) {
        superagent.get('http:///localhost:3000/users')
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(res.body.length).to.be.above(0)
                expect(res.body.map(item => item._id)).to.contain(id)
                done()
            })
    })

    it('updates an object', function (done) {
        superagent.put('http://localhost:3000/users/' + id)
            .send({ name: 'test2', email: 'test2@email.com' })
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body.msg).to.eql('success')
                done()
            })
    })

    it('updates an object', function (done) {
        superagent.get('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body._id.length).to.eql(24)
                expect(res.body._id).to.eql(id)
                expect(res.body.name).to.eql('test2')
                expect(res.body.email).to.eql('test2@email.com')
                done()
            })
    })

    it('removes an object', function (done) {
        superagent.del('http://localhost:3000/users/' + id)
            .end(function (e, res) {
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body.msg).to.eql('success')
                done()
            })
    })
})