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

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    })
})

/****************************
 *          POSTS           *
 ***************************/
app.post('/api/notes', (request, response) => {
    const body = request.body

    // Send 400 bad request
    if(body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

/****************************
 *          DELETE          *
 ***************************/
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})

/****************************
 *          HELPERS         *
 ***************************/
const generateId = () => {
    // Find out largest id
    // the '...' transforms the array 'notes' into an individual number
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    console.log('test')
    return maxId + 1;
}

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
