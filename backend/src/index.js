require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DB_FILE = path.join(__dirname, 'data.json');

function loadProjects() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return new Map(Object.entries(JSON.parse(data)));
    }
  } catch (e) {
    console.error('Error loading projects:', e);
  }
  return new Map();
}

function saveProjects() {
  try {
    const data = Object.fromEntries(projects);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
}

let projects = loadProjects();
console.log(`Loaded ${projects.size} projects`);

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
  saveProjects();
  res.json(project);
});

app.get('/api/projects', (req, res) => {
  const allProjects = Array.from(projects.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  res.json(allProjects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const { title, status } = req.body;
  if (title) project.title = title;
  if (status) project.status = status;
  projects.set(project.id, project);
  saveProjects();
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

  project.status = 'uploaded';
  projects.set(project.id, project);
  saveProjects();
  res.json(uploadedPhotos);
});

app.delete('/api/projects/:id', async (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  for (const photo of project.photos) {
    try {
      await cloudinary.uploader.destroy(photo.public_id);
    } catch (e) {
      console.error('Error deleting photo:', e);
    }
  }

  projects.delete(req.params.id);
  saveProjects();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});