require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const User = require('./models/User')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded())
app.use(logger('dev'))

app.get('/', function (req, res, next) {
    res.json('Please try again with "/users"')
})

app.get('/users', async function (req, res, next) {
    try {
        const pageNo = Number.parseInt(req.query.page) || 1
        const pageSize = Number.parseInt(req.query.size) || 2
        const sortField = req.query.orderBy || '_id'
        const result = await User
            .find()
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortField]: 1 })
        res.status(200).json({
            code: 'ok',
            message: 'User(s) found',
            users: result,
        })
    } catch (error) {
        next(error)
    }
})

app.get('/users/:id', async function (req, res, next) {
    try {
        const result = await User.findById(req.params.id);
        if (!result) {
            res.status(404).json({
                code: 'notFound',
                message: 'User is not found',
            })
        }
        res.status(200).json({
            code: 'ok',
            message: 'User is found',
            users: [result]
        })
    } catch (error) {
        next(error)
    }
})

app.post('/users', async function (req, res, next) {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            createdDate: Date.now(),
            lastModified: Date.now(),
        })
        const result = await user.save();
        res.status(201).json({
            code: 'created',
            message: 'User is created successfully',
            id: result._id,
        })
    } catch (error) {
        next(error)
    }
})

app.put('/users/:id', async function (req, res, next) {
    try {
        let user = await User.findById(req.params.id)
        let statusCode = 200

        if (!user) {
            user = new User({ _id: req.params.id, createdDate: Date.now(), })
            statusCode = 201
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.lastModified = Date.now()

        const result = await user.save();
        if (statusCode === 201) {
            res.status(statusCode).json({
                code: 'created',
                message: 'User is created successfully',
                id: result._id,
            })
        }

        res.status(statusCode).json({
            code: 'ok',
            message: 'User is updated successfully',
            users: [result],
        })
    } catch (error) {
        next(error)
    }
})

app.delete('/users/:id', async function (req, res, next) {
    try {
        let result = await User.findById(req.params.id)
        if (!result) {
            res.status(404).json({
                code: 'notFound',
                message: 'User is not found',
            })
        }

        result = await User.deleteOne({ _id: req.params.id })
        if (result.deletedCount > 0) {
            res.status(204).json({
                code: 'noContent',
                message: 'User is deleted successfully',
            })
        } else {
            res.status(500).json({
                code: 'internalServerError',
                message: 'Something bad happened'
            })
        }
    } catch (error) {
        next(error)
    }
})

app.listen(port, async function () {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(`Express server is listening on port ${port}.`)
})