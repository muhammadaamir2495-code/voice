const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Security Middleware
app.use(cors()); // In production, restrict this to your frontend URL
app.use(express.json());

// Basic Rate Limiting Structure (Mock)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const simpleRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'];
  const now = Date.now();
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const limit = rateLimits.get(ip);
  if (now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (limit.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  limit.count += 1;
  next();
};

// --- API Routes ---

/**
 * @route   POST /api/chat
 * @desc    Proxy request to Google Gemini API
 * @access  Public (should be protected in production with Auth tokens)
 */
app.post('/api/chat', simpleRateLimiter, async (req, res) => {
  const { message } = req.body;

  // 1. Input Validation
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message. Please provide a string.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
  }

  try {
    // 2. Prepare Gemini Request
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // System instruction passed via context for better personality
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
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 3. Extract and Clean AI Response
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    if (!aiResponse) {
      throw new Error('Empty response from AI engine');
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // 4. Detailed Error Handling
    if (error.response?.status === 429) {
      return res.status(503).json({ error: 'Gemini service is overloaded. Try again in a moment.' });
    }

    res.status(500).json({ 
      error: 'An internal error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'up', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`--- Dialer AI Proxy Server ---`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/api/chat`);
});
