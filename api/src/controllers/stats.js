// 'use strict';

const {
  getAllRCPT_LOGS,
  getAllRCPT_LOGS_STP,
  getAllRCPT_LOGS_DETAIL,
  getAllBasToMw,
  getAllBasToMwStp,
} = require('../db/stats');

exports.onGetAllRCPT_LOGS = async (req, res) => {
  try {
    const result = await getAllRCPT_LOGS(req.query);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.onGetAllRCPT_LOGS_STP = async (req, res) => {
  try {
    const result = await getAllRCPT_LOGS_STP(req.query);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.onGetAllBasToMw = async (req, res) => {
  try {
    const result = await getAllBasToMw(req.query);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.onGetAllBasToMwStp = async (req, res) => {
  try {
    const result = await getAllBasToMwStp(req.query);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.onGetAllRCPT_LOGS_DETAIL = async (req, res) => {
  try {
    const result = await getAllRCPT_LOGS_DETAIL(req.query);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
};
