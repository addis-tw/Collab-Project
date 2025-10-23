// 'use strict';

const odbc = require('odbc');
const config = require('../utils/config');

const getQuery = (use, status, date = null) => {
  let query = ``;
  // const statusFilter = status ? `STATUS = '${status}' AND ` : '';
  let statusFilter = '';
  if (status === '') {
    statusFilter = `TRIM(STATUS) = '' AND `;
  } else if (status && status !== 'All') {
    statusFilter = `STATUS = '${status}' AND `;
  }

  let dateParam = date ? `'${date}'` : 'CURRENT DATE';

  // WHERE ${statusFilter}DATE(DATE_ADDED) = CURRENT DATE
  switch (use) {
    case 'rcpt_log_detail':
      query = `SELECT 
              (DISTRICT*1000000) + PO_NUMBER AS PO, 
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILE.RCPT_LOG
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logoe_detail':
      query = `SELECT 
              (DISTRICT*1000000)+OE_NUMBER AS FRO,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILE.RCPT_LOGOE
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logmp_detail':
      query = `SELECT
              (DISTRICT*1000000)+MP_NUMBER AS CHG,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILE.RCPT_LOGMP
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logsp_detail':
      query = `SELECT
              (DISTRICT*1000000)+SPO_NUMBER AS CHG,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILE.RCPT_LOGSP
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_log_detail_stp':
      query = `SELECT 
              (DISTRICT*1000000)+PO_NUMBER AS PO, 
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILESTP.RCPT_LOG
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logoe_detail_stp':
      query = `SELECT 
              (DISTRICT*1000000)+OE_NUMBER AS FRO,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILESTP.RCPT_LOGOE
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logmp_detail_stp':
      query = `SELECT
              (DISTRICT*1000000)+MP_NUMBER AS CHG,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILESTP.RCPT_LOGMP
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
    case 'rcpt_logsp_detail_stp':
      query = `SELECT 
              (DISTRICT*1000000)+SPO_NUMBER AS CHG,
              STATUS,
              DATA1 AS DATA,
              DATE_ADDED
              FROM MW4FILESTP.RCPT_LOGSP
              WHERE ${statusFilter}DATE(DATE_ADDED) = ${dateParam}
              ORDER BY DATE_ADDED DESC`;
      break;
  }
  return query;
};

async function runQuery(query) {
  // console.log('Running Query:', query);
  let connection;
  try {
    const { db, file } = config;
    connection = await odbc.connect(db);
    // console.log(99, 'Connected to DB');
    const result = await connection.query(query);
    // console.log(result);
    return { result, success: true };
  } catch (e) {
    // console.log('Query Error:', e);
    return { message: e.message, success: false };
  } finally {
    if (connection) {
      try {
        await connection.rollback();
      } catch (e) {}
      await connection.close();
    }
  }
}

exports.getAllRCPT_LOGS = async (request) => {
  // const queries = [
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOG WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGOE WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGMP WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGSP WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  // ];

  let date = request.date ? `'${request.date}'` : 'CURRENT DATE';
  const queries = [
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOG WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGOE WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGMP WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILE.RCPT_LOGSP WHERE DATE(DATE_ADDED) = ${date}`,
  ];
  console.log(137, queries);
  try {
    const results = await Promise.all(queries.map(runQuery));
    return {
      rcptLog: results[0].result,
      rcptLogOE: results[1].result,
      rcptLogMP: results[2].result,
      rcptLogSP: results[3].result,
      success: true,
    };
  } catch (e) {
    return { message: e.message, success: false };
  }
};

exports.getAllRCPT_LOGS_STP = async (request) => {
  // const queries = [
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOG WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGOE WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGMP WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  //   `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGSP WHERE DATE(DATE_ADDED) = CURRENT DATE`,
  // ];

  let date = request.date ? `'${request.date}'` : 'CURRENT DATE';
  const queries = [
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOG WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGOE WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGMP WHERE DATE(DATE_ADDED) = ${date}`,
    `SELECT Sum(CASE WHEN STATUS = 'Success' then 1 else 0 end ) as Success ,Sum(CASE WHEN STATUS = 'Error' then 1 else 0 end ) as Error ,Sum(CASE WHEN trim(STATUS) = '' then 1 else 0 end ) as Waiting FROM MW4FILESTP.RCPT_LOGSP WHERE DATE(DATE_ADDED) = ${date}`,
  ];
  try {
    const results = await Promise.all(queries.map(runQuery));
    return {
      rcptLog: results[0].result,
      rcptLogOE: results[1].result,
      rcptLogMP: results[2].result,
      rcptLogSP: results[3].result,
      success: true,
    };
  } catch (e) {
    return { message: e.message, success: false };
  }
};

exports.getAllRCPT_LOGS_DETAIL = async (request) => {
  try {
    const { req_name, status } = request;
    const date = request.date || null;
    // console.log(req_name, status);
    const query = getQuery(req_name, status, date);
    // console.log(159, query);
    const result = await runQuery(query);
    return {
      result,
      success: true,
    };
  } catch (e) {
    return { message: e.message, success: false };
  }
};

exports.getAllBasToMw = async (request) => {
  // const queries = [
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_INV FROM MW4FILE.INV_MAT_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_CHG FROM MW4FILE.INV_PRC_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_FRT FROM MW4FILE.INV_FRT_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(EXT_GUID) AS BAS_TO_MW_EXP FROM MW4FILE.INVEXPDSTA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(SEQUENCE) AS VENDORS, CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END AS Status FROM MW4FILE.VENDINFOLG WHERE DATE(DATE_ADDED) = CURRENT DATE GROUP BY CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END`,
  // ];

  let date = request.date ? `'${request.date}'` : 'CURRENT DATE';
  const queries = [
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_INV FROM MW4FILE.INV_MAT_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_CHG FROM MW4FILE.INV_PRC_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_FRT FROM MW4FILE.INV_FRT_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(EXT_GUID) AS BAS_TO_MW_EXP FROM MW4FILE.INVEXPDSTA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(SEQUENCE) AS VENDORS, CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END AS Status FROM MW4FILE.VENDINFOLG WHERE DATE(DATE_ADDED) = ${date} GROUP BY CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END`,
  ];

  // console.log(191, queries);
  try {
    const results = await Promise.all(queries.map(runQuery));
    // console.log(191, results[4].result[0]);
    return {
      inv: results[0].result[0].BAS_TO_MW_INV,
      chg: results[1].result[0].BAS_TO_MW_CHG,
      frt: results[2].result[0].BAS_TO_MW_FRT,
      exp: results[3].result[0].BAS_TO_MW_EXP,
      ven: results[4].result[0],
      success: true,
    };
  } catch (e) {
    return { message: e.message, success: false };
  }
};

exports.getAllBasToMwStp = async (request) => {
  // const queries = [
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_INV FROM MW4FILESTP.INV_MAT_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_CHG FROM MW4FILESTP.INV_PRC_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(REC_GUID) AS BAS_TO_MW_FRT FROM MW4FILESTP.INV_FRT_HA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(EXT_GUID) AS BAS_TO_MW_EXP FROM MW4FILESTP.INVEXPDSTA WHERE DATE(CREATED_TIMESTAMP) = CURRENT DATE`,
  //   `SELECT COUNT(SEQUENCE) AS VENDORS, CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END AS Status FROM MW4FILESTP.VENDINFOLG WHERE DATE(DATE_ADDED) = CURRENT DATE GROUP BY CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END`,
  // ];

  let date = request.date ? `'${request.date}'` : 'CURRENT DATE';
  const queries = [
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_INV FROM MW4FILESTP.INV_MAT_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_CHG FROM MW4FILESTP.INV_PRC_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(REC_GUID) AS BAS_TO_MW_FRT FROM MW4FILESTP.INV_FRT_HA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(EXT_GUID) AS BAS_TO_MW_EXP FROM MW4FILESTP.INVEXPDSTA WHERE DATE(CREATED_TIMESTAMP) = ${date}`,
    `SELECT COUNT(SEQUENCE) AS VENDORS, CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END AS Status FROM MW4FILESTP.VENDINFOLG WHERE DATE(DATE_ADDED) = ${date} GROUP BY CASE WHEN TRIM(DATA1) = '' THEN 'PENDING' ELSE DATA1 END`,
  ];
  try {
    const results = await Promise.all(queries.map(runQuery));
    // console.log(215, results[0].result);
    return {
      inv_stp: results[0].result[0].BAS_TO_MW_INV,
      chg_stp: results[1].result[0].BAS_TO_MW_CHG,
      frt_stp: results[2].result[0].BAS_TO_MW_FRT,
      exp_stp: results[3].result[0].BAS_TO_MW_EXP,
      ven_stp: results[4].result[0],
      success: true,
    };
  } catch (e) {
    return { message: e.message, success: false };
  }
};
