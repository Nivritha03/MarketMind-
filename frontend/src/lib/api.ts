import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export async function generateCampaign(product: string, audience: string) {
  const res = await api.post("/generate_campaign", { product, audience });
  return res.data;
}

export async function generatePitch(product: string, audience: string) {
  const res = await api.post("/generate_pitch", { product, audience });
  return res.data;
}

export async function getInsights(product: string, audience: string) {
  const res = await api.post("/insights", { product, audience });
  return res.data;
}

export async function analyzeSentiment(text: string) {
  const res = await api.post("/sentiment", { text });
  return res.data;
}

export async function scoreLeads(leads: Array<{ name: string; engagement: number; budget: number }>) {
  const res = await api.post("/score_leads", leads);
  return res.data;
}

export default api;
