import OpenAI from "openai";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { prompt = "", context = "", mode = "FDE coach" } = await request.json();
    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured in Netlify environment variables." }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const client = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      instructions: `You are the AI coach inside an FDE Career Command Center. Be practical, technical and honest. Help the user become a Forward Deployed Engineer using Learn -> Build -> Deploy -> Prove. Give concrete next actions. Mode: ${mode}. Context: ${context}`,
      input: prompt
    });
    return new Response(JSON.stringify({ text: response.output_text }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "AI request failed." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
