import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { connectDB } from './config/db.js';
import routerAPI from './routes/index.js';
import { profileImageDir } from './middlewares/profileImageUpload.js';
import {
  notFound,
  errorHandler
} from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = fileURLToPath(
  new URL('./public/', import.meta.url)
);

app.use(express.static(publicPath));
app.use('/uploads/profiles', express.static(profileImageDir, {
  setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff')
}));

const port = process.env.PORT;

const homePath = fileURLToPath(
  new URL('./views/index.html', import.meta.url)
);

await connectDB();

app.get('/', (req, res) => {
  res.sendFile(homePath);
});

routerAPI(app);

app.use('/api', notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor Web en http://localhost:${port}`);
});
