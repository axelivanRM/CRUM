import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

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

//listen to port
app.listen(PORT, ()=>{
    console.log(`Server Sicegemex running on port ${PORT}`);
})