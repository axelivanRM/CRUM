// test-client.js (en la raíz de C:\CRUM\server)
import { io } from 'socket.io-client';

// ⚠️ CAMBIA ESTO por tu token real (o 'TOKEN_DE_PRUEBA_123' si usaste la Opción B)
const TOKEN = '3baa4860fe7a1e8cef0f5095f83357c51040fb2d06a00b90b384e437b563d0f4';

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
            lat: 19.4326,
            lng: -99.1332,
            index: 1
            // NO enviamos id_user (el servidor lo añade desde el token)
        };

        console.log('📤 Enviando update_position:', payload);
        socket.emit('update_position', payload);
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