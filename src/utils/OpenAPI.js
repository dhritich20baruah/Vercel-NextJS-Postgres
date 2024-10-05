const axios = require('axios');

const API_KEY = 'your-api-key-here';

const getOpenAIResponse = async () => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // You can also use 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'What is the weather today?' },
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
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
};

getOpenAIResponse();
