const request = require("supertest");
const app = require("../../../src/app");
const { Garden } = require("../../../src/models/garden");

jest.mock("../../../src/models/garden"); // Mock the Garden model

describe("Garden API", () => {
  describe("GET /api/gardens", () => {
    it("should get all gardens", async () => {
      Garden.find.mockResolvedValue([{ name: "Herb Garden" }]); // Mock the find method
      const response = await request(app).get("/api/gardens");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe("Herb Garden");
    });
    it("should handle errors", async () => {
      Garden.find.mockRejectedValue(new Error("Database error")); // Mock an error
      const response = await request(app).get("/api/gardens");
      expect(response.status).toBe(500);
    });
  });
  describe("GET /api/gardens/:gardenId", () => {
    it("should get a garden by ID", async () => {
      Garden.findOne.mockResolvedValue({ name: "Herb Garden" }); // Mock the findOne method;
      const response = await request(app).get("/api/gardens/1");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Herb Garden");
    });
    it("should handle errors", async () => {
      Garden.findOne.mockRejectedValue(new Error("Database error")); // Mock an error
      const response = await request(app).get("/api/gardens/1");
      expect(response.status).toBe(500);
    });
  });
  describe("POST /api/gardens", () => {
    it("should create a garden successfully", async () => {
      Garden.prototype.save.mockResolvedValue({ gardenId: 1 }); // Mock the save method
      const response = await request(app).post("/api/gardens").send({
        name: "Herb Garden",
        location: "Botanical Garden",
        description: "A garden with a variety of herbs.",
        dateCreated: "2023-04-15T00:00:00.000Z",
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Garden created successfully");
    });
    it("should return validation errors for invalid data", async () => {
      const response = await request(app).post("/api/gardens").send({
        name: "HG", // Invalid: too short
        location: "", // Invalid: empty
        description: "A garden with a variety of herbs.",
        dateCreated: "invalid-date", // Invalid: not a date
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "must NOT have fewer than 3 characters"
      );
    });
  });

  describe("PATCH /api/gardens/:gardenId", () => {
    it("should update a garden successfully", async () => {
      Garden.findOne.mockResolvedValue({
        set: jest.fn(),
        save: jest.fn().mockResolvedValue({ gardenId: 1 }),
      }); // Mock the findOne and save methods
      const response = await request(app).patch("/api/gardens/1").send({
        name: "Updated Herb Garden",
        location: "New Botanical Garden",
        description: "An updated description for the herb garden.",
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Garden updated successfully");
    });

    it("should return validation errors for invalid data", async () => {
      const response = await request(app).patch("/api/gardens/1").send({
        name: "UG", // Invalid: too short
        location: "", // Invalid: empty
        description: "An updated description for the herb garden.",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "must NOT have fewer than 3 characters"
      );
    });
  });

  describe("DELETE /api/gardens/:gardenId", () => {
    it("should delete a garden successfully", async () => {
      Garden.deleteOne.mockResolvedValue({ deletedCount: 1 }); // Mock the deleteOne method;
      const response = await request(app).delete("/api/gardens/1");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Garden deleted successfully");
    });
    it("should handle errors", async () => {
      Garden.deleteOne.mockRejectedValue(new Error("Database error")); // Mock an error
      const response = await request(app).delete("/api/gardens/1");
      expect(response.status).toBe(500);
    });
  });
});
