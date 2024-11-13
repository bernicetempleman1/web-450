const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let plantSchema = new Schema({
  name: {
    type: String,
    required: [true, "Plant name is required"],
    minlength: [3, "Plant name must be at least 3 characters"],
    maxlength: [100, "Plant name cannot exceed 100 characters"],
  },
  type: {
    type: String,
    enum: ["Flower", "Vegetable", "Herb", "Tree"],
    required: [true, "Plant type is required"],
  },
  status: {
    type: String,
    enum: ["Planted", "Growing", "Harvested"],
    required: [true, "Plant status is required"],
  },
  datePlanted: {
    type: Date,
  },
  dateHarvested: {
    type: Date,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
  },
  gardenId: {
    type: Number,
    required: [true, "Garden ID is required"],
  },
});

plantSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.dateModified = new Date();
  }
  next();
});

module.exports = {
  Plant: mongoose.model("Plant", plantSchema),
};
