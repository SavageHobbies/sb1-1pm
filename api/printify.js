import express from 'express';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import FormData from 'form-data';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.psd'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG, and PSD files are allowed.'));
    }
  },
});

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const API_KEY = process.env.PRINTIFY_API_KEY;

if (!API_KEY) {
  console.error('Printify API key is not set. Please set the PRINTIFY_API_KEY environment variable.');
}

const printifyApi = axios.create({
  baseURL: PRINTIFY_API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

router.get('/catalog/blueprints', async (req, res) => {
  try {
    console.log('Fetching product catalog...');
    const response = await printifyApi.get('/catalog/blueprints.json');
    console.log('Product catalog fetched successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching product catalog:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch product catalog', details: error.response?.data || error.message });
  }
});

router.post('/shops/:shopId/uploads/images', upload.single('file'), async (req, res) => {
  try {
    const { shopId } = req.params;
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${PRINTIFY_API_URL}/shops/${shopId}/uploads/images.json`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload image', details: error.response?.data || error.message });
  }
});

export default router;