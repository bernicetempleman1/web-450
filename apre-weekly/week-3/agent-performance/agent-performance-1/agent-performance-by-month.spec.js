/**
 * Author: Professor Krasso
 *          Bernice Templeman
 * Date: 09 November 2024
 * File: index.spec.js
 * Description: Test the agent performance by month API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');
const monthly = require('../../../../src/routes/reports/agent-performance/agent-performance-by-month.js');


jest.mock('../../../../src/utils/mongo');

// Test the agent performance API
describe('Apre Agent Performance by Month API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the call-duration-by-date-range endpoint
  it('should fetch call duration data for agents within a specified month', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              agents: ['Agent A', 'Agent B'],
              callDurations: [120, 90]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/agent-performance/call-duration-by-month?month=1&year=2023'); // Send a GET request to the call-duration-by-date-range endpoint

    expect(response.status).toBe(200); // Expect a 200 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        agents: ['Agent A', 'Agent B'],
        callDurations: [120, 90]
      }
    ]);
  });

  // Test the call-duration-by-month endpoint with missing parameters
  it('should return 400 if month or year is missing', async () => {
    const response = await request(app).get('/api/reports/agent-performance/call-duration-by-month?month=1'); // Send a GET request to the call-duration-by-date-month endpoint with missing year
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Month and year are required',
      status: 400,
      type: 'error'
    });
  });

  // Test the call-duration-by-month endpoint with an invalid date range
  it('should return 404 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/reports/agent-performance/invalid-endpoint'); // Send a GET request to an invalid endpoint
    expect(response.status).toBe(404); // Expect a 404 status code
    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});