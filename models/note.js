const mongoose = require("mongoose");


//code borrowed from previous exercise
// schema reference
const Schema = mongoose.Schema;

// creating a new NoteSchema object

const NoteSchema = new Schema({
  title: String,
  body: String
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);


module.exports = Note;
