import axios from "axios";

const BASE_URL = "https://khamiyevbabek-001-site1.ktempurl.com/api/Meeting";

export const canJoinMeeting = (appointmentId) =>
  axios.get(`${BASE_URL}/canjoin/${appointmentId}`);

export const startMeeting = (appointmentId, token) => {
  console.log("📌 Appointment ID:", appointmentId);
  console.log("🔐 Token gedişi:", token);
  console.log("🕒 Vaxt indi:", new Date().toISOString());

  return axios.post(
    `${BASE_URL}/start/${appointmentId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
