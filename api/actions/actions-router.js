// Write your "actions" router here!
const express = require('express');
const { validateProjectId, validateAction, } = require('./actions-middleware')

const Action = require('./actions-model');

const router = express.Router();

//Return an array of actions (or an empty array) as the body of the response
router.get('/', (req, res, next) => {
    Action.get()
        .then(action => {
            res.json(action)
        })
        .catch(next)
})

//Returns an action with the given id as the body of the response
//If there is no action with the given id it responds with a status code 404
router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.user)
})

//Returns the newly created action as the body of the response
//If the request body is missing any of the required fields it responds with a status code 400
//When adding an action make sure the project_id provided belongs to an existing project
router.post('/', validateProjectId, validateAction, (req, res, next) => {
    Action.insert({ 
        project_id: req.project_id, 
        description: req.description, 
        notes: req.notes, 
        completed: req.body.completed 
    })
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)
})

//Returns the updated action as the body of the response
//If there is not aciton with the given id it responds with a status code 404
//If the requres body is missing any of the required fields it responds with a status code 400
router.put('/:id', validateProjectId, validateAction, (req, res, next) => {
    
    Action.update(req.params.id, { 
        project_id: req.project_id, 
        description: req.description, 
        notes: req.notes, 
        completed: req.complete
    })
        .then(updatedProject => {
            res.json(updatedProject)
        })
        .catch(next)
})

//Return no response body
//If there is no action with the given id it responds with a status code 404
router.delete('/:id', validateProjectId, async (req, res, next) => {
    try{
        await Action.remove(req.params.id)
        res.json(req.project)
    } catch (err) {
        next (err)
    }
})

//Middleware to handle errors
//eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: "Error inside projects router",
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router