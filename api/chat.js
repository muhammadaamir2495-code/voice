import axios from 'axios';

export default async function handler(req, res) {
  // 1. CORS headers (optional for Vercel functions as they are usually same-origin or handled in vercel.json)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message. Please provide a string.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
  }

  try {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemInstruction = `You are a helpful AI support assistant for a Dialer app. Keep it brief.`;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nQuestion: ${message}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    if (!aiResponse) {
      throw new Error('Empty response from AI engine');
    }

    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      return res.status(503).json({ error: 'Gemini service is overloaded. Try again in a moment.' });
    }

    res.status(500).json({ 
      error: 'An internal error occurred while processing your request.',
      details: error.message
    });
  }
}
