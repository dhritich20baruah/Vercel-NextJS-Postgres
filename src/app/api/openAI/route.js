import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(req, res) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }
  try {
    const { prompt } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or 'gpt-3.5-turbo'
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    // Access the generated text from the response
    const generatedText = completion.choices[0].message.content;
    console.log(generatedText);
    return NextResponse.json({ text: generatedText }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error processing your request" },
      { status: 500 }
    );
  }
}
