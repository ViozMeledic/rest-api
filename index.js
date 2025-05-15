require('dotenv').config()
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const bodyParser = require('body-parser')
const logger = require('morgan')

let collection
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))

app.get('/', function (req, res, next) {
    res.send('Please try again with "/users"')
})

app.get('/users', async function (req, res, next) {
    try {
        const result = await collection.find({}, { limit: 10, sort: { _id: -1 } }).toArray()
        res.send(result)
    } catch (error) {
        next(error)
    }
})

app.post('/users', async function (req, res, next) {
    try {
        const result = await collection.insertOne(req.body, {})
        res.send(result)
    } catch (error) {
        next(error)
    }
})

app.get('/users/:id', async function (req, res, next) {
    try {
        const result = await collection.findOne({ _id: new ObjectId(req.params.id) })
        res.send(result)
    } catch (error) {
        next(error)
    }
})

app.put('/users/:id', async function (req, res, next) {
    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body })
        res.send((result.modifiedCount === 1) ? { msg: 'success' } : { msg: 'error' })
    } catch (error) {
        next(error)
    }
})

app.delete('/users/:id', async function (req, res, next) {
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) })
        res.send((result.deletedCount === 1) ? { msg: 'success' } : { msg: 'error' })
    } catch (error) {
        next(error)
    }
})

app.listen(3000, async function () {
    const client = new MongoClient(process.env.CONNECTION_STRING)
    await client.connect()
    collection = client.db("production").collection("users")
    console.log('Express server is listening on port 3000.')
})