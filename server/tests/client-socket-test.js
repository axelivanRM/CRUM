// test-client.js (en la raíz de C:\CRUM\server)
import { io } from 'socket.io-client';

// ⚠️ CAMBIA ESTO por tu token real (o 'TOKEN_DE_PRUEBA_123' si usaste la Opción B)
const TOKEN = '70ebd0ac56c1ca028979446b2246d6ef0beaf4d8c45fd32635fd6dd4fb0bae56';

// Conexión al servidor enviando el token en el objeto 'auth'
const socket = io('http://localhost:3000', {
    auth: {
        token: TOKEN
    }
});


// --- EVENTO: Conexión exitosa ---
socket.on('connect', () => {
    console.log('✅ Conectado al servidor con ID:', socket.id);
    console.log('🔐 Token enviado:', TOKEN);

    // Esperamos 1 segundo y enviamos una ubicación de prueba
    setTimeout(() => {
        const payload = {
            status:"disponible",
            type:1,
            lat: 19.4326,
            lng: -99.1332,
            h3Index: '8841431201hhhhh'
            // NO enviamos id_user (el servidor lo añade desde el token)
        };

        console.log('📤 Enviando update_position:', payload);
        socket.emit('ambulance:status', payload);
    }, 1000);
});

// --- EVENTO: Confirmación del servidor ---
socket.on('update_position', (data) => {
    console.log('📩 Confirmación del servidor:', data);
});

// --- EVENTO: Error de validación (Zod) ---
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