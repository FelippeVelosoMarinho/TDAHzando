const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Servir a pasta de uploads de áudio de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurando o Multer para salvar os arquivos de áudio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Função para garantir que o "banco de dados" JSON exista
const dataFile = path.join(__dirname, 'data', 'songs.json');
const ensureDataFile = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
};

// Rota: Listar todas as músicas
app.get('/api/songs', (req, res) => {
  ensureDataFile();
  const songs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  res.json(songs);
});

// Rota: Adicionar uma nova música (com upload de arquivo de áudio)
// Espera os campos: title, artist, youtubeLink, cifraText e o arquivo de audio 'audioFile'
app.post('/api/songs', upload.single('audioFile'), (req, res) => {
  ensureDataFile();
  const songs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

  const newSong = {
    id: crypto.randomUUID(),
    title: req.body.title || 'Sem Título',
    artist: req.body.artist || 'Desconhecido',
    youtubeLink: req.body.youtubeLink || '',
    cifraText: req.body.cifraText || '', // O texto padrão CifraClub
    audioUrl: req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };

  songs.push(newSong);
  fs.writeFileSync(dataFile, JSON.stringify(songs, null, 2));

  res.status(201).json(newSong);
});

// Rota: Deletar uma música
app.delete('/api/songs/:id', (req, res) => {
  ensureDataFile();
  let songs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const song = songs.find(s => s.id === req.params.id);
  
  if (song) {
    songs = songs.filter(s => s.id !== req.params.id);
    fs.writeFileSync(dataFile, JSON.stringify(songs, null, 2));
    
    // Deletar o arquivo de áudio também
    if (song.audioUrl) {
      const filename = song.audioUrl.split('/').pop();
      const filepath = path.join(__dirname, 'uploads', filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
  }
  
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🎸 Backend TDAHzando rodando na porta ${PORT}`);
  ensureDataFile();
});
