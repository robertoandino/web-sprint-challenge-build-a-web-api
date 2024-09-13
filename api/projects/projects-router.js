// Write your "projects" router here!
const express = require('express');
const { validateUserId, validateProject, } = require('./projects-middleware')

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

//Returns a newly created project as the body of the response
//If the request body is missing any of the required fields it responds with a status code 400
router.post('/', validateProject, (req, res, next) => {
    Project.insert({ name: req.name, description: req.description, completed: req.body.completed })
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)
})

//Returns an updated project as the body of the response
//If there is no project with the given id it responds with a status code 404
//If the requrest body is missing any of the required fields it responds with a status code 400
router.put('/:id', validateUserId, validateProject, (req, res, next) => {
    
    Project.update(req.params.id, { 
        name: req.name, 
        description: req.description, 
        completed: req.body.completed
    })
        .then(updatedProject => {
            res.json(updatedProject)
        })
        .catch(next)
})


//Returns no response body
//If there is no project with the given id, it responds with a status code 400
router.delete('/:id', validateUserId, async (req, res, next) => {
    try{
        await Project.remove(req.params.id)
        res.json(req.project)
    } catch (err) {
        next (err)
    }
})

//Returns an array of actions (coult be empty) belonging to a project with the given id
//If there is no project with the given id, it responds with a status code 404
router.get('/:id/actions', validateUserId, async (req, res, next) => {
    try{
        const result = await Project.getProjectActions(req.params.id)
        res.json(result)
    } catch (err) {
        next (err)
    }
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