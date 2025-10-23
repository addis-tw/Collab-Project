'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

const corsOption = {
  origin: true,
  methods: 'GET',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const stats = require('./routes/stats');
app.use('/stats', stats);

module.exports = app;
