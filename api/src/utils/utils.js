"use strict";

exports.checkIfValueValid = (request) => {
  if (!request) {
    return {
      message: "no data provided to process with the request",
      success: false,
    };
  }
  if (!request.job_type || !request.job_type.trim()) {
    return {
      message: `your missing a value for order job type, please provide and try again`,
      success: false,
    };
  } else if (!request.dist || !+request.dist) {
    return {
      message: `your missing a value for order district, please provide and try again`,
      success: false,
    };
  } else if (!request.order_no || !+request.order_no) {
    return {
      message: `your missing a value for order number, please provide and try again`,
      success: false,
    };
  } else if (!request.line || !+request.line) {
    return {
      message: `your missing a value for order line, please provide and try again`,
      success: false,
    };
  } else if (!request.pcs || !+request.pcs) {
    return {
      message: `your missing a value for pcs, please provide and try again`,
      success: false,
    };
  } else if (!request.pull_length || !+request.pull_length) {
    return {
      message: `your missing a value for pull length, please provide and try again`,
      success: false,
    };
  } else if (!request.user || !request.user.trim()) {
    return {
      message: `your missing a value for user, please provide and try again`,
      success: false,
    };
  } else if (!request.process || !request.process.trim()) {
    return {
      message: `your missing a value for order process, please provide and try again`,
      success: false,
    };
  } else {
    return {
      success: true,
    };
  }
};
