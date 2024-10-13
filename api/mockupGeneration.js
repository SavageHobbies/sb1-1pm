import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const mockupsDir = join(__dirname, '..', 'mockups');

router.get('/products', (req, res) => {
  try {
    const products = fs.readdirSync(mockupsDir).filter(file => fs.statSync(join(mockupsDir, file)).isDirectory());
    res.json(products);
  } catch (error) {
    console.error('Error reading product categories:', error);
    res.status(500).json({ error: 'Failed to read product categories' });
  }
});

router.get('/templates', (req, res) => {
  const { productType } = req.query;
  
  if (!productType) {
    return res.status(400).json({ error: 'Product type is required' });
  }

  const productDir = join(mockupsDir, productType.toLowerCase());

  if (!fs.existsSync(productDir)) {
    return res.status(404).json({ error: 'Product type not found' });
  }

  try {
    const files = fs.readdirSync(productDir);
    const templates = files
      .filter(file => file.endsWith('.psd'))
      .map(file => ({
        id: file,
        name: file.replace(/\.psd$/, ""),
        image: `/mockups/${productType.toLowerCase()}/${file}`
      }));
    res.json(templates);
  } catch (error) {
    console.error('Error reading mockup templates:', error);
    res.status(500).json({ error: 'Failed to read mockup templates' });
  }
});

router.post('/generate', express.json(), (req, res) => {
  const { templateId, designUrl } = req.body;

  if (!templateId || !designUrl) {
    return res.status(400).json({ error: 'Template ID and design URL are required' });
  }

  // Here you would implement the logic to generate the mockup
  // For now, we'll just return a success message
  res.json({ message: 'Mockup generation initiated', mockupUrl: '/path/to/generated/mockup.png' });
});

export default router;