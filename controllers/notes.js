const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/****************************
 *          GET             *
 ***************************/
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

/****************************
 *          POSTS           *
 ***************************/
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    // Take token from the header
    const token = getTokenFrom(request)

    // Verify token
    const decodeToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid'})
    }
    const user = await User.findById(decodeToken.id)

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
    })

    // Save in notes
    const savedNote = await note.save()

    // Save in users
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote.toJSON())
})

/****************************
 *          DELETE          *
 ***************************/
notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

/****************************
 *           PUT            *
 ***************************/
notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter