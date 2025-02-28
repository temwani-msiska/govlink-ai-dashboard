import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

export const fetchNetworkStatus = async () => {
  const response = await axios.get(`${API_URL}network-status/`);
  return response.data;
};
