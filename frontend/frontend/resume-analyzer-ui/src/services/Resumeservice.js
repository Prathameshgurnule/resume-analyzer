import axios from "axios";

const BASE_URL = "http://localhost:8081/api/resume";

export const getAllResumes = () => {
  return axios.get(`${BASE_URL}/all`);
};