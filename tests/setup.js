require('../models/User');

// Set waiting time for async tests:
jest.setTimeout(10000);

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
