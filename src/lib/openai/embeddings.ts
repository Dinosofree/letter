import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const truncated = text.length > 30000 ? text.slice(0, 30000) : text;

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: truncated,
  });

  return response.data[0].embedding;
}
