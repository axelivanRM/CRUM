import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {query} from './config/dataBase.js';

//initialize express
const app = express();

//get port from enviroment 
const PORT = Number(process.env.PORT) || 3000;

//milddleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//test route
app.get('/health', (req, res) =>{
    res.status(200).json({
        status: 'ok',
        mesaje: 'Server Sicegemex working'
    });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await query('SELECT * FROM usuarios');
    res.json({
      status: 'success',
      mensaje: 'Base de datos conectada correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//listen to port
app.listen(PORT, ()=>{
    console.log(`Server Sicegemex running on port ${PORT}`);
})

try {
    await query('SELECT 1');
    console.log('📦 Pool de PostgreSQL listo para recibir consultas');
  } catch (error) {
    console.error('⚠️ No se pudo conectar a PostgreSQL:', error.message);
  }
