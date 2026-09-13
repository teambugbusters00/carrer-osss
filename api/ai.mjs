import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { mode = "study", prompt = "", context = "" } = req.body || {};
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured in Vercel environment variables." });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      instructions: `You are the AI coach inside an FDE Career Command Center.
Help the user become a Forward Deployed Engineer. Be practical, technical and honest.
Current mode: ${mode}.
Give actionable suggestions, not generic motivation.
Prefer Learn -> Build -> Deploy -> Prove.
User context:
${context}`,
      input: prompt
    });

    return res.status(200).json({ text: response.output_text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "AI request failed. Check GROQ_API_KEY and Vercel logs." });
  }
}
