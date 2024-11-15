const express = require("express");
const Ajv = require("ajv");
const createError = require("http-errors");
const { Plant } = require("../../models/plant");
const { addPlantSchema, updatePlantSchema } = require("../../schemas");
const router = express.Router();
const ajv = new Ajv();
const validateAddPlant = ajv.compile(addPlantSchema);
const validateUpdatePlant = ajv.compile(updatePlantSchema);

router.get("/", async (req, res, next) => {
  try {
    const plants = await Plant.find({});
    res.send(plants);
  } catch (err) {
    console.error(`Error while getting plants: ${err}`);
    next(err);
  }
});

router.get("/:plantId", async (req, res, next) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.plantId });

    res.send(plant);
  } catch (err) {
    console.error(`Error while getting plant: ${err}`);
    next(err);
  }
});

router.post("/:gardenId", async (req, res, next) => {
  try {
    const valid = validateAddPlant(req.body);
    if (!valid) {
      return next(createError(400, ajv.errorsText(validateAddPlant.errors)));
    }
    const payload = {
      ...req.body,
      gardenId: req.params.gardenId,
    };
    const plant = new Plant(payload);
    await plant.save();
    res.send({
      message: "Plant created successfully",
      id: plant._id,
    });
  } catch (err) {
    console.error(`Error while creating plant: ${err}`);
    next(err);
  }
});

router.patch("/:plantId", async (req, res, next) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.plantId });
    const valid = validateUpdatePlant(req.body);
    if (!valid) {
      return next(createError(400, ajv.errorsText(validateUpdatePlant.errors)));
    }
    plant.set(req.body);
    await plant.save();
    res.send({
      message: "Plant updated successfully",
      id: plant._id,
    });
  } catch (err) {
    console.error(`Error while updating plant: ${err}`);
    next(err);
  }
});

router.delete("/:plantId", async (req, res, next) => {
  try {
    await Plant.deleteOne({ _id: req.params.plantId });
    res.send({
      message: "Plant deleted successfully",
      id: req.params.plantId,
    });
  } catch (err) {
    console.error(`Error while deleting plant: ${err}`);
    next(err);
  }
});

module.exports = router;
