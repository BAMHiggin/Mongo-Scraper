var mongoose = require("mongoose");


//code borrowed from previous exercise
// schema reference
var Schema = mongoose.Schema;

// creating a new NoteSchema object

var NoteSchema = new Schema({
  title: String,
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);


module.exports = Note;
