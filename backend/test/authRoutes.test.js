const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming you export your Express app from server.js
const User = require('../models/User');
const { sendEmail, sendVerificationEmail } = require('../services/emailService'); // Add this line

// Mock the emailService functions
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
}));

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'TestPassword123!'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    
    // Check if the email services were called
    expect(sendEmail).toHaveBeenCalledWith(
      testUser.email,
      'Welcome to Recipe Management',
      'Thank you for registering!'
    );
    expect(sendVerificationEmail).toHaveBeenCalledWith(testUser.email);
  });

  it('should login an existing user', async () => {
    // First, register a user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Then, attempt to login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing username or email', async () => {
    // First, register a user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Attempt to register with the same username
    const resUsername = await request(app)
      .post('/api/auth/register')
      .send({
        ...testUser,
        email: 'newuser@example.com',
      });

    expect(resUsername.statusCode).toEqual(400);
    expect(resUsername.body).toHaveProperty('message', 'Username or email already exists');

    // Attempt to register with the same email
    const resEmail = await request(app)
      .post('/api/auth/register')
      .send({
        ...testUser,
        username: 'newuser',
      });

    expect(resEmail.statusCode).toEqual(400);
    expect(resEmail.body).toHaveProperty('message', 'Username or email already exists');
  });
});