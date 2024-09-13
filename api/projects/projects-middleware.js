// add middlewares here related to projects
const Project = require('./projects-model')

function logger(req, res, next) {
    // DO YOUR MAGIC
    const timestamp = new Date().toLocaleString()
    const method = req.method
    const url = req.originalUrl
  
    console.log(`[${timestamp}] ${method} to ${url}`)
    next()
}


async function validateUserId(req, res, next) {
    try{
        const user = await Project.get(req.params.id)
        if(!user) {
            next({ status: 404, message: 'User with given id not found' })
        } else {
            req.user = user
            next()
        }
    }   catch (err) {
        res.status(500).json({
            message: 'problem finding user',
        })
    }
}

module.exports = {
    logger,
    validateUserId,
}