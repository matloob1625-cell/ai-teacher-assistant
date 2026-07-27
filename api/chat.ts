import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "GEMINI_API_KEY missing" });

    const ai = new GoogleGenAI({ apiKey: key });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: String(message) }] }],
    });

    const reply =
      result?.candidates?.?.content?.parts?.map((p: any) => p.text).join("") || "";

    return res.status(200).json({ reply });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
