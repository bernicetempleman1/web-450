const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the counter schema
let counterSchema = new Schema({
_id: { type: String, required: true },
seq: { type: Number, default: 0 }
});
// Create a counter model
const Counter = mongoose.model('Counter', counterSchema);
// Define the garden schema
let gardenSchema = new Schema({
gardenId: {
type: Number,
required: true,
unique: true
},
name: {
type: String,
required: [true, 'Garden name is required'],
minlength: [3, 'Garden name must be at least 3 characters'],
maxlength: [100, 'Garden name cannot exceed 100 characters']
},
location: {
type: String,
required: true
},
description: {
type: String,
maxlength: [500, 'Description cannot exceed 500 characters']
},
dateCreated: {
type: Date,
default: Date.now
},
dateModified: {
type: Date
}
});
// Custom validator
gardenSchema.path('name').validate(function(val) {
return /^[A-Za-z\s]+$/.test(val); // Only allows letters and spaces
}, 'Garden name can only contain letters and spaces');

// Pre-save hook to increment the gardenId
// If the document is new, increment the gardenId
// If the document is not new, update the dateModified
gardenSchema.pre('validate', async function(next) {
  let doc = this;
  if (this.isNew) {
  try {
  const counter = await Counter.findByIdAndUpdate(
  { _id: 'gardenId' },
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
  );
  doc.gardenId = counter.seq;
  next();
  } catch (err) {
  console.error('Error in Counter.findByIdAndUpdate:', err);
  next(err);
  }
  } else {
  doc.dateModified = new Date();
  next();
  }
  });
  module.exports = {
  Garden: mongoose.model('Garden', gardenSchema),
  Counter: mongoose.model('Counter', counterSchema)
  };
