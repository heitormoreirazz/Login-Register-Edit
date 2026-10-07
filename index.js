
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const router = require('./router');

dotenv.config();

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'login-register-edit-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use('/', router);

app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Página Inicial' });
});

app.listen(port, host, () => {
  console.log(`Servidor iniciado em http://${host}:${port}`);
});
