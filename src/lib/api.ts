import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

export const fetchNetworkStatus = async () => {
  const response = await axios.get(`${API_URL}network-status/`);
  return response.data;
};
export const fetchSimulationData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/network/simulation-data/");
    const data = await response.json();
    return data.network_data;
  } catch (error) {
    console.error("Error fetching simulation data:", error);
    return [];
  }
};
