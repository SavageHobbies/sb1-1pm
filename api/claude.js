import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

router.post('/generate-product-details', async (req, res) => {
  try {
    const { productType, designDescription } = req.body;

    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Generate a creative product title and description for a ${productType} with the following design: ${designDescription}. Format the response as JSON with "title" and "description" fields.`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const generatedContent = JSON.parse(response.data.content[0]);
    res.json(generatedContent);
  } catch (error) {
    console.error('Error generating product details:', error);
    res.status(500).json({ error: 'Failed to generate product details' });
  }
});

export default router;