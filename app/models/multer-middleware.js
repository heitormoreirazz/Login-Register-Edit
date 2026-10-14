const multer = require('multer');

// Armazenar em memória (para arquivos pequenos)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});