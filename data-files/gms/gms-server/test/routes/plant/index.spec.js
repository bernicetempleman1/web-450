const request = require("supertest");
const app = require("../../../src/app");
const { Plant } = require("../../../src/models/plant");
jest.mock("../../../src/models/plant"); // Mock the Plant model
describe("Plant API", () => {
  describe("GET /api/plants", () => {
    it("should get all plants", async () => {
      Plant.find.mockResolvedValue([{ name: "Rose" }]); // Mock the find method
      const response = await request(app).get("/api/plants");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe("Rose");
    });

    it("should handle errors", async () => {
      Plant.find.mockRejectedValue(new Error("Database error")); // Mock an error
      const response = await request(app).get("/api/plants");
      expect(response.status).toBe(500);
    });
  });

  describe("GET /api/plants/:plantId", () => {
    it("should get a plant by ID", async () => {
      Plant.findOne.mockResolvedValue({ name: "Rose" }); // Mock the findOne method
      const response = await request(app).get(
        "/api/plants/507f1f77bcf86cd799439011"
      ); // Use a valid ObjectId
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Rose");
    });

    it("should handle errors", async () => {
      Plant.findOne.mockRejectedValue(new Error("Database error")); // Mock an error
      const response = await request(app).get(
        "/api/plants/507f1f77bcf86cd799439011"
      ); // Use a valid ObjectId
      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/plants/:gardenId", () => {
    it("should create a plant successfully", async () => {
      Plant.prototype.save.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
      }); // Mock the save method
      const response = await request(app).post("/api/plants/1").send({
        name: "Rose",
        type: "Flower",
        datePlanted: "2023-04-15T00:00:00.000Z",
        status: "Planted", // Ensure all required properties are included
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Plant created successfully");
    });

    it("should return validation errors for invalid type", async () => {
      const response = await request(app).post("/api/plants/1").send({
        name: "Rose",
        type: "InvalidType", // Invalid: not in enum
        datePlanted: "2023-04-15T00:00:00.000Z",
        status: "Planted",
      });
      expect(response.status).toBe(400);
      const errorMessages = response.body.message;
      expect(errorMessages).toContain(
        "must be equal to one of the allowed values"
      );
    });
  });

  describe("PATCH /api/plants/:plantId", () => {
    it("should update a plant successfully", async () => {
      const mockPlant = {
        _id: "507f1f77bcf86cd799439011",
        name: "Rose",
        type: "Flower",
        status: "Growing",
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
      };
      Plant.findOne.mockResolvedValue(mockPlant);
      const response = await request(app)
        .patch("/api/plants/507f1f77bcf86cd799439011")
        .send({
          name: "Rose",
          type: "Flower",
          status: "Growing", // Ensure all required properties are included
        });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Plant updated successfully");
    });

    it("should return validation errors for invalid data", async () => {
      const mockPlant = {
        _id: "507f1f77bcf86cd799439011",
        name: "Rose",
        type: "Flower",
        status: "Growing",
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
      };

      Plant.findOne.mockResolvedValue(mockPlant);
      const response = await request(app)
        .patch("/api/plants/507f1f77bcf86cd799439011")
        .send({
          name: "R", // Invalid: too short
          type: "InvalidType", // Invalid: not in enum
          status: "InvalidStatus", // Invalid: not in enum
        });
      expect(response.status).toBe(400);
      const errorMessages = response.body.message;
      expect(errorMessages).toContain("must NOT have fewer than 3 characters");
    });
  });

  describe("DELETE /api/plants/:plantId", () => {
    it("should delete a plant successfully", async () => {
      Plant.deleteOne.mockResolvedValue({ deletedCount: 1 });
      const response = await request(app).delete(
        "/api/plants/507f1f77bcf86cd799439011"
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Plant deleted successfully");
      expect(response.body.id).toBe("507f1f77bcf86cd799439011");
    });

    it("should handle errors during deletion", async () => {
      Plant.deleteOne.mockRejectedValue(new Error("Database error"));
      const response = await request(app).delete(
        "/api/plants/507f1f77bcf86cd799439011"
      );
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });
});
