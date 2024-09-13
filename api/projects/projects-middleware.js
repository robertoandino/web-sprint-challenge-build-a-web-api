// add middlewares here related to projects
const Project = require('./projects-model')

//logger to track requests on the server
function logger(req, res, next) {
    const timestamp = new Date().toLocaleString()
    const method = req.method
    const url = req.originalUrl
  
    console.log(`[${timestamp}] ${method} to ${url}`)
    next()
}

//validates user id
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

//validates project, name and description are required
function validateProject(req, res, next) {

    const { name, description, completed} = req.body

    if(!name || !name.trim() || !description || !description.trim() || completed === undefined){
        res.status(400).json({
            message: 'missing required name, description, or completed field',
        })
    } else{
        req.name = name.trim()
        req.description = description.trim()
        next()
    }

}

module.exports = {
    logger,
    validateUserId,
    validateProject,
}