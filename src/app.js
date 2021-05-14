require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const app = express()
const choresRouter = require('./chores-router')
const membersRouter = require('./members-router')
const householdRouter = require('./household-router')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use(cors());
app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());
app.options('*', cors())
app.use('/household', householdRouter)
app.use('/members', membersRouter)
app.use('/chores', choresRouter)

app.get('/', (req, res) => {
    res.send("Hello, world")
});


app.use(function errorHandler(error, req, res, next) {
    let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

module.exports = app