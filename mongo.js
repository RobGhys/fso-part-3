const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide your password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://robghys:${password}@cluster0.3jic8.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

// Schema
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

// 'Note' is the singular name of the model
// The model is a constructor functions
const Note = mongoose.model('Note', noteSchema)

// Create new note object
/*const note1 = new Note({
    content: 'HTML is easy',
    date: new Date(),
    important: true
})

const note2 = new Note({
    content: 'Heyheyyy',
    date: new Date(),
    important: true
})

const note3 = new Note({
    content: 'Blabla',
    date: new Date(),
    important: false
})*/

/*
// Save the object to DB
// When the object is saved, close the connection
note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})*/

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})