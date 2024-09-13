// add middlewares here related to actions
// add middlewares here related to projects
const Action = require('./actions-model')

//validates action id
async function validateProjectId(req, res, next) {
    try{
        const user = await Action.get(req.params.id)
        if(!user) {
            next({ status: 404, message: 'Project with given id not found' })
        } else {
            req.user = user
            next()
        }
    }   catch (err) {
        res.status(500).json({
            message: 'problem finding project',
        })
    }
}

//validates project, name and description are required
function validateAction(req, res, next) {

    const { project_id, description, notes, completed} = req.body

    if(!project_id || !description || !description.trim() || !notes || !notes.trim() 
        || completed === undefined){
            res.status(400).json({
            message: 'missing required project_id, description, notes, or completed field',
        })
    } else{
        req.project_id = project_id
        req.description = description.trim()
        req.notes = notes.trim()
        req.completed = completed
        next()
    }

}

module.exports = {
    validateProjectId,
    validateAction,
}