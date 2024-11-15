const addGardenSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 100 },
    location: { type: "string", minLength: 1 },
    description: { type: "string", maxLength: 500 },
    dateCreated: {
      type: "string",
      pattern: "^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)?$",
    },
  },
  required: ["name", "location"],
  additionalProperties: false,
};

const updateGardenSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 100 },
    location: { type: "string", minLength: 1 },
    description: { type: "string", maxLength: 500 },
  },
  required: ["name", "location"],
  additionalProperties: false,
};

const addPlantSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 100 },
    type: { type: "string", enum: ["Flower", "Vegetable", "Herb", "Tree"] },
    status: { type: "string", enum: ["Planted", "Growing", "Harvested"] },
    datePlanted: {
      type: "string",
      pattern: "^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)?$",
    },
  },
  required: ["name", "type", "status"],
  additionalProperties: false,
};

const updatePlantSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 100 },
    type: { type: "string", enum: ["Flower", "Vegetable", "Herb", "Tree"] },
    status: { type: "string", enum: ["Planted", "Growing", "Harvested"] },
  },
  required: ["name", "type", "status"],
  additionalProperties: false,
};

module.exports = {
  addGardenSchema,
  updateGardenSchema,
  addPlantSchema,
  updatePlantSchema,
};
