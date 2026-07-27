import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "GEMINI_API_KEY missing" });

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(String(message));
    return res.status(200).json({ reply: result.response.text() });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
