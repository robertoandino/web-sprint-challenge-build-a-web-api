// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

const express = require('express');
const { logger } = require('./projects/projects-middleware')
const projectsRouter = require('./projects/projects-router')
const actionsRouter = require('./actions/actions-router')
const server = express();

server.use(express.json())

server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

server.use(logger)

server.get('/', (req, res) => {
    res.send('Servers running');
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server;
