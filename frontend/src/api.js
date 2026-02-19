import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Campaign
export const generateCampaign = async (product, audience) => {
  const res = await API.post("/generate_campaign", { product, audience });
  return res.data;
};

// Pitch
export const generatePitch = async (product, audience) => {
  const res = await API.post("/generate_pitch", { product, audience });
  return res.data;
};

// Insights
export const getInsights = async (product, audience) => {
  const res = await API.post("/insights", { product, audience });
  return res.data;
};

// Sentiment
export const analyzeSentiment = async (text) => {
  const res = await API.post("/sentiment", { text });
  return res.data;
};

// Lead Scoring
export const scoreLeads = async (leads) => {
  const res = await API.post("/score_leads", leads);
  return res.data;
};
