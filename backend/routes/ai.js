// routes/ai.js
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL,
    'X-Title': process.env.SITE_NAME,
  },
});

router.post('/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      // Validate input
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }
  
      const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-v3-base:free',
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        max_tokens: 1000,
      });
  
      // Validate the response
      if (!completion.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from AI");
      }
  
      res.json({
        response: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ 
        error: "Error processing your request",
        details: error.message 
      });
    }
  });

module.exports = router;