import axios from "axios";

const BASE_URL = "https://khamiyevbabek-001-site1.ktempurl.com/api/Meeting";

export const canJoinMeeting = (appointmentId) =>
  axios.get(`${BASE_URL}/canjoin/${appointmentId}`);

export const startMeeting = (appointmentId, token) => {
  return axios.post(
    `${BASE_URL}/start/${appointmentId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
