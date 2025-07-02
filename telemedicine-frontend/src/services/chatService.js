import axios from "axios";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getMessagesWithUser = (userId) =>
  axios.get(`/api/Chat/with/${userId}`, authHeader());

export const getApprovedDoctors = () =>
  axios.get(`/api/DoctorProfile/approved`);

export const getPatientsForDoctor = () =>
  axios.get(`/api/Chat/patients`, authHeader());
