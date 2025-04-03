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