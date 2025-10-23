import axios from 'axios';

const server =
  window.location.href.includes('localhost') ||
  window.location.href.includes('nexgen40-dev');

const config = {
  baseURL: server ? `https://nexgen40-dev.twmetals.net/` : '../',
  onUploadProgress: function (progressEvent) {},

  onDownloadProgress: function (progressEvent) {},
};

const axiosInstance = axios.create(config);

export const getBaswareDashboard = (date) => {
  return axiosInstance.get(
    '/Basware-Status-Dashboard/api/stats/rcpt-logs',
    // 'http://localhost:5134/stats/rcpt-logs',
    {
      params: {
        date,
        timestamp: `${new Date().getTime()}`,
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    }
  );
};

export const getBaswareStpDashboard = (date) => {
  return axiosInstance.get(
    '/Basware-Status-Dashboard/api/stats/rcpt-logs-stp',
    // 'http://localhost:5134/stats/rcpt-logs-stp',
    {
      params: {
        date,
        timestamp: `${new Date().getTime()}`,
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    }
  );
};

export const getBaswareDashboardDetails = (req_name, status, date) => {
  console.log('API REQ NAME:', req_name);
  console.log('API STATUS:', status);
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  return axiosInstance.get(
    '/Basware-Status-Dashboard/api/stats/rcpt-logs-detail',
    {
      // return axiosInstance.get('http://localhost:5134/stats/rcpt-logs-detail', {
      params: {
        req_name,
        status: capitalizeFirstLetter(status),
        date,
        timestamp: `${new Date().getTime()}`,
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    }
  );
};

export const getBaswareToMw = (date) => {
  return axiosInstance.get('/Basware-Status-Dashboard/api/stats/bas-to-mw', {
    // return axiosInstance.get('http://localhost:5134/stats/bas-to-mw', {
    params: {
      date,
      timestamp: `${new Date().getTime()}`,
    },
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
};

export const getBaswareToMwStp = (date) => {
  return axiosInstance.get(
    '/Basware-Status-Dashboard/api/stats/bas-to-mw-stp',
    {
      // return axiosInstance.get('http://localhost:5134/stats/bas-to-mw-stp', {
      params: {
        date,
        timestamp: `${new Date().getTime()}`,
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    }
  );
};
