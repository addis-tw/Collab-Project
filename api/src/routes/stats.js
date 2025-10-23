// 'use strict';

const express = require('express');
const {
  onGetAllRCPT_LOGS,
  onGetAllRCPT_LOGS_STP,
  onGetAllRCPT_LOGS_DETAIL,
  onGetAllBasToMw,
  onGetAllBasToMwStp,
} = require('../controllers/stats');

const router = express.Router();

router.get('/rcpt-logs', onGetAllRCPT_LOGS);
router.get('/rcpt-logs-stp', onGetAllRCPT_LOGS_STP);
router.get('/rcpt-logs-detail', onGetAllRCPT_LOGS_DETAIL);
router.get('/bas-to-mw', onGetAllBasToMw);
router.get('/bas-to-mw-stp', onGetAllBasToMwStp);
module.exports = router;
