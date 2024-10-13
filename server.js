import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import printifyRoutes from './api/printify.js';
import claudeRoutes from './api/claude.js';
import mockupGenerationRoutes from './api/mockupGeneration.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.PRINTIFY_API_KEY) {
  console.error('PRINTIFY_API_KEY is not set in the environment variables.');
  process.exit(1);
}

if (!process.env.CLAUDE_API_KEY) {
  console.error('CLAUDE_API_KEY is not set in the environment variables.');
  process.exit(1);
}

app.use(express.json());
app.use('/api/printify', printifyRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/mockups', mockupGenerationRoutes);

// In-memory storage for uploaded files
const uploadedFiles = new Map();

// File upload route
app.post('/api/upload', express.raw({type: 'application/octet-stream', limit: '10mb'}), (req, res) => {
  const fileId = Date.now().toString();
  uploadedFiles.set(fileId, req.body);
  res.json({ fileId: fileId });
});

// Serve uploaded files
app.get('/api/files/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const fileData = uploadedFiles.get(fileId);
  if (fileData) {
    res.contentType('application/octet-stream');
    res.send(fileData);
  } else {
    res.status(404).send('File not found');
  }
});

// Serve mockup images
app.use('/mockups', express.static(join(__dirname, 'mockups')));

// Serve static files from the React app
app.use(express.static(join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('PRINTIFY_API_KEY:', process.env.PRINTIFY_API_KEY ? 'Set' : 'Not set');
  console.log('CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? 'Set' : 'Not set');
});