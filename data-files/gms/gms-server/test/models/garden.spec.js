const mongoose = require("mongoose");
const { Garden, Counter } = require("../../src/models/garden");

// Connect to a test database
//mongodb+srv://gms_user:s3cret>@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity
beforeAll(async () => {
  const connectionString =
    'mongodb+srv://gms_user:s3cret@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity';
  try {
    await mongoose.connect(connectionString, {
      dbName: "gms",
    });
    console.log("Connection to the database instance was successful");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
});

// Clear the database before each test
beforeEach(async () => {
  await Garden.deleteMany({});
  await Counter.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
});

describe("Garden Model Test", () => {
  it("should create a garden successfully", async () => {
    const gardenData = {
      name: "Rose Garden",
      location: "Central Park",
      description: "A beautiful garden with various types of roses.",
    };
    const garden = new Garden(gardenData);
    const savedGarden = await garden.save();
    expect(savedGarden._id).toBeDefined();
    expect(savedGarden.name).toBe(gardenData.name);
    expect(savedGarden.location).toBe(gardenData.location);
    expect(savedGarden.description).toBe(gardenData.description);
  });

  it("should validate garden name correctly", async () => {
    const gardenData = {
      name: "123 Invalid Name",
      location: "Central Park",
      description: "A beautiful garden with various types of roses.",
    };
    const garden = new Garden(gardenData);
    let err;
    try {
      await garden.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["name"]).toBeDefined();
    expect(err.errors["name"].message).toBe(
      "Garden name can only contain letters and spaces"
    );
  });

  it("should auto-increment gardenId correctly", async () => {
    const gardenData1 = {
      name: "Rose Garden",
      location: "Central Park",
      description: "A beautiful garden with various types of roses.",
    };
    const gardenData2 = {
      name: "Vegetable Garden",
      location: "Community Center",
      description: "A community garden with a variety of vegetables.",
    };
    const garden1 = new Garden(gardenData1);
    const savedGarden1 = await garden1.save();
    const garden2 = new Garden(gardenData2);
    const savedGarden2 = await garden2.save();
    expect(savedGarden1.gardenId).toBe(1);
    expect(savedGarden2.gardenId).toBe(2);
  });

  it("should fail to create a garden with a name shorter than 3 characters", async () => {
    const gardenData = {
      name: "Ro",
      location: "Central Park",
      description: "A beautiful garden with various types of roses.",
    };
    const garden = new Garden(gardenData);
    let err;
    try {
      await garden.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["name"]).toBeDefined();
    expect(err.errors["name"].message).toBe(
      "Garden name must be at least 3 characters"
    );
  });

  it("should fail to create a garden with a name longer than 100 characters", async () => {
    const gardenData = {
      name: "R".repeat(101),
      location: "Central Park",
      description: "A beautiful garden with various types of roses.",
    };
    const garden = new Garden(gardenData);
    let err;

    try {
      await garden.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["name"]).toBeDefined();
    expect(err.errors["name"].message).toBe(
      "Garden name cannot exceed 100 characters"
    );
  });

  it("should fail to create a garden with a description longer than 500 characters", async () => {
    const gardenData = {
      name: "Rose Garden",
      location: "Central Park",
      description: "D".repeat(501),
    };
    const garden = new Garden(gardenData);
    let err;
    try {
      await garden.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["description"]).toBeDefined();
    expect(err.errors["description"].message).toBe(
      "Description cannot exceed 500 characters"
    );
  });
});
