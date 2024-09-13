// Write your "projects" router here!
const express = require('express');
const { validateUserId, } = require('./projects-middleware')

const Project = require('./projects-model');

const router = express.Router();

//Returns an array of projects as the body of the response
//If there are not projects it responds with an empty array
router.get('/', (req, res, next) => {
    Project.get()
        .then(project => {
            res.json(project)
        })
        .catch(next)
})

//Returns a project with the given id as the body of the response
//If there is not project with the given id, it responds with a status code 404
router.get('/:id', validateUserId, (req, res) => {
    res.json(req.user)
})


//Middleware to handle errors
router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: "Error inside projects router",
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router