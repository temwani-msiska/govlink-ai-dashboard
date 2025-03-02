import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

export const fetchNetworkStatus = async () => {
  const response = await axios.get(`${API_URL}network-status/`);
  return response.data;
};

export const fetchBandwidthMetrics = async () => {
    const response = await fetch('http://localhost:8000/api/bandwidth-metrics/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return response.json();
};

export const fetchRealTimeBandwidth = async () => {
    const response = await fetch('http://localhost:8000/api/bandwidth/current/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return response.json();
};

export const runSpeedTest = async () => {
    const response = await fetch('http://localhost:8000/api/bandwidth/speedtest/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return response.json();
};
