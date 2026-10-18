import api from "./api.js"; 

// PUBLIC: customer form
export const submitFeedback = async (payload) => {
  const res = await api.post("/feedback", payload);
  return res.data;
};

// ADMIN
export const getAllFeedback = async () => {
  const res = await api.get("/admin/feedback/");
  return res.data.data;  
};

export const deleteFeedback = async (id) => {
  const res = await api.delete(`/admin/feedback/${id}`);
  return res.data;
};