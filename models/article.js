const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object

let ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
