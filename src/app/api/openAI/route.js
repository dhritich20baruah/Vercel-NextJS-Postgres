import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY});

export async function POST(req, res) {

  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }
  try {
    const { prompt } = await req.json();
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 100,
      },
    
    );

    console.log(response);
    return NextResponse.json(
      { text: "response.data.choices[0].message.content" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error processing your request" },
      { status: 500 }
    );
  }
}
