require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

/****************************
 *            GET           *
 ***************************/
// Event handler to handle GET request
app.get('/', (request, response) => {
    response.send('<h1>Hello World!"</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

/****************************
 *          POSTS           *
 ***************************/
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save()
        // Receive savedNote object from Mongoose, format it
        .then(savedNote => savedNote.toJSON())
        .then(saveAndFormattedNote => {
            response.json(saveAndFormattedNote)
        })
        .catch(err => next(err))
})

/****************************
 *            PUT           *
 ***************************/
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    // The 'new: true' causes the event handler to be called with the new modified document instead of the original
    Note.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(err => next(err))
})

/****************************
 *          DELETE          *
 ***************************/
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.prams.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(err => next(err))
})

/****************************
 *          HELPERS         *
 ***************************/
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/****************************
 *          LISTEN          *
 ***************************/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)