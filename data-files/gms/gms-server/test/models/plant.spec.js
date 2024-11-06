const mongoose = require('mongoose');
const { Plant } = require('../../src/models/plant');
// Connect to a test database
beforeAll(async () => {
  const connectionString =
'mongodb+srv://gms_user:s3cret@cluster0.lujih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
try {
await mongoose.connect(connectionString, {
dbName: 'gms'
});
console.log('Connection to the database instance was successful');
} catch (err) {
console.error(`MongoDB connection error: ${err}`);
}
});
// Clear the database before each test
beforeEach(async () => {
await Plant.deleteMany({});
});
// Close the database connection after all tests
afterAll(async () => {
await mongoose.connection.close();
console.log('Database connection closed');
});
describe('Plant Model Test', () => {
it('should create a plant successfully', async () => {
const plantData = {
name: 'Rose',
type: 'Flower',
gardenId: 1,
status: 'Planted'
};
const plant = new Plant(plantData);
const savedPlant = await plant.save();
expect(savedPlant._id).toBeDefined();
expect(savedPlant.name).toBe(plantData.name);
expect(savedPlant.type).toBe(plantData.type);
expect(savedPlant.gardenId).toBe(plantData.gardenId);
expect(savedPlant.status).toBe(plantData.status);
});
it('should fail to create a plant without required fields', async () => {
const plantData = {
name: 'Rose',
type: 'Flower'
};
const plant = new Plant(plantData);

let err;
try {
await plant.save();
} catch (error) {
err = error;
}
expect(err).toBeDefined();
expect(err.errors['gardenId']).toBeDefined();
expect(err.errors['status']).toBeDefined();
});
it('should update a plant\'s status successfully', async () => {
const plantData = {
name: 'Rose',
type: 'Flower',
gardenId: 1,
status: 'Planted'
};
const plant = new Plant(plantData);
const savedPlant = await plant.save();
savedPlant.status = 'Growing';
const updatedPlant = await savedPlant.save();
expect(updatedPlant.status).toBe('Growing');
});
it('should fail to create a plant with a name shorter than 3 characters', async () => {
const plantData = {
name: 'Ro',
type: 'Flower',
gardenId: 1,
status: 'Planted'
};
const plant = new Plant(plantData);
let err;
try {
await plant.save();
} catch (error) {
err = error;
}
expect(err).toBeDefined();
expect(err.errors['name']).toBeDefined();
expect(err.errors['name'].message).toBe('Plant name must be at least 3 characters');
});
it('should fail to create a plant with a name longer than 100 characters', async () => {
const plantData = {
name: 'R'.repeat(101),
type: 'Flower',
gardenId: 1,
status: 'Planted'
};
const plant = new Plant(plantData);
let err;
try {
await plant.save();
} catch (error) {
err = error;
}
expect(err).toBeDefined();
expect(err.errors['name']).toBeDefined();
expect(err.errors['name'].message).toBe('Plant name cannot exceed 100 characters');
});
it('should fail to create a plant with an invalid type', async () => {
const plantData = {
name: 'Rose',
type: 'InvalidType',
gardenId: 1,
status: 'Planted'
};
const plant = new Plant(plantData);
let err;
try {
await plant.save();
} catch (error) {
err = error;
}
expect(err).toBeDefined();
expect(err.errors['type']).toBeDefined();
expect(err.errors['type'].message).toBe('`InvalidType` is not a valid enum value for path `type`.');
});
it('should fail to create a plant with an invalid status', async () => {
const plantData = {
name: 'Rose',
type: 'Flower',
gardenId: 1,
status: 'InvalidStatus'
};
const plant = new Plant(plantData);
let err;
try {
await plant.save();
} catch (error) {
err = error;
}
expect(err).toBeDefined();
expect(err.errors['status']).toBeDefined();
expect(err.errors['status'].message).toBe('`InvalidStatus` is not a valid enum value for path `status`.');
});
});