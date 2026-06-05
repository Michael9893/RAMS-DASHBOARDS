import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'data-store.json');

// Interface structures
interface Note {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  downloads: number;
  description?: string;
}

interface DataStore {
  notes: Note[];
  photos: Photo[];
}

// Ensure database file exists on system with empty values as requested
function readStore(): DataStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading from data-store.json, resetting:', err);
  }
  return { notes: [], photos: [] };
}

function writeStore(data: DataStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to data-store.json:', err);
  }
}

// Initialize on boot
if (!fs.existsSync(STORE_PATH)) {
  writeStore({ notes: [], photos: [] });
}

// Enable rich client payloads (base64 compressed image strings up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 📌 REST API ENDPOINTS FOR DRAG-NOTES & ALBUM
// ==========================================

// Get shared Working Board Notes
app.get('/api/notes', (req, res) => {
  const store = readStore();
  res.json(store.notes || []);
});

// Create/Update high-fidelity Notes
app.post('/api/notes', (req, res) => {
  const incomingNotes: Note[] = req.body;
  if (!Array.isArray(incomingNotes)) {
    return res.status(400).json({ error: 'Payload must be an array of Notes' });
  }
  const store = readStore();
  store.notes = incomingNotes;
  writeStore(store);
  res.json({ success: true, notes: store.notes });
});

// Get shared Photos from Album
app.get('/api/photos', (req, res) => {
  const store = readStore();
  res.json(store.photos || []);
});

// Upload a new Snapshot to permanent Album
app.post('/api/photos', (req, res) => {
  const newPhoto: Photo = req.body;
  if (!newPhoto || !newPhoto.id || !newPhoto.url) {
    return res.status(400).json({ error: 'Invalid photo payload structure' });
  }
  const store = readStore();
  // Filter out any duplicates
  store.photos = store.photos.filter(p => p.id !== newPhoto.id);
  // Add to beginning of array so it shows first
  store.photos.unshift(newPhoto);
  writeStore(store);
  res.json({ success: true, photos: store.photos });
});

// Delete a Snapshot from shared Album
app.delete('/api/photos/:id', (req, res) => {
  const id = req.params.id;
  const store = readStore();
  store.photos = store.photos.filter(p => p.id !== id);
  writeStore(store);
  res.json({ success: true, photos: store.photos });
});

// Increment downloads counter
app.post('/api/photos/:id/download', (req, res) => {
  const id = req.params.id;
  const store = readStore();
  store.photos = store.photos.map(p => {
    if (p.id === id) {
      return { ...p, downloads: (p.downloads || 0) + 1 };
    }
    return p;
  });
  writeStore(store);
  res.json({ success: true, photos: store.photos });
});

// ==========================================
// 🛠️ VITE MIDDLEWARE & STATIC SERVING PIPELINE
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Fatal dev server crash:', err);
});
