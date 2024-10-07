// pages/api/openai.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const API_KEY = process.env.OPENAI_KEY;

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = await req.json();
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // You can also use 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(response)
    return NextResponse.json({ text: "response.data.choices[0].message.content" }, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing your request' }, {status: 500});
  }
}
