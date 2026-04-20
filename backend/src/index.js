require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projects = new Map();

app.post('/api/projects', (req, res) => {
  const { title } = req.body;
  const id = uuidv4();
  const project = {
    id,
    title: title || `Photo Dump ${new Date().toLocaleDateString()}`,
    status: 'uploading',
    created_at: new Date().toISOString(),
    photos: [],
  };
  projects.set(id, project);
  res.json(project);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

app.post('/api/projects/:id/photos', async (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { photos } = req.body;
  if (!photos || !Array.isArray(photos)) {
    return res.status(400).json({ error: 'Photos array required' });
  }

  const uploadedPhotos = [];

  for (const photo of photos) {
    try {
      const result = await cloudinary.uploader.upload(photo.url, {
        folder: `piqd/${project.id}`,
        resource_type: 'image',
      });

      const processedPhoto = {
        id: uuidv4(),
        project_id: project.id,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        created_at: new Date().toISOString(),
      };

      project.photos.push(processedPhoto);
      uploadedPhotos.push(processedPhoto);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }

  res.json(uploadedPhotos);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});