'use client';

import { useState } from 'react';
import {io} from 'socket.io-client';

export default function Page() {

    const token ='c18f780676f29a8f545da4eb51f7ce421d9043a3f8779160bd5ad39d4bd88bac';
    const [id, setId] = useState('');
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => {
    console.log(msg);
    setLogs((prev) => [...prev, msg]);
    };

    const sendData =  () => {
        console.log("¡Botón clickeado!"); // <-- ¿Sale al hacer clic?


        try {

            const socket = io('http://localhost:3000', { auth:{ token: token } });

            socket.on('connect', () => {
            console.log('Conectado al servidor');

            console.log(socket.id);

            setId(socket.id);


             setTimeout(() => {
                const payload = {
                    lat: 19.4326,
                    lng: -99.1332,
                    h3Index: '85283473fffffff'
                };
                socket.emit('update_position', payload);
             }, 1000);
            });


           socket.on('socket_connected', (id) => {setId(id)});

           socket.on('location_error', (err) => {
            console.error('❌ Error de validación:', err);
            });

            // --- EVENTO: Error de conexión (middleware rechazó) ---
            socket.on('connect_error', (err) => {
                console.error('❌ Error de conexión:', err.message);
            });

            // --- EVENTO: Desconexión ---
            socket.on('disconnect', (reason) => {
                console.log('🔌 Desconectado:', reason);
            });
            } catch (error) {
            console.error("Error:", error);
             }
        };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Prueba Socket.IO</h1>
            <button onClick={sendData}>
                Enviar datos
            </button>
            <p>Socket ID: {id || '(no conectado)'}</p>
        </div>
    );
}