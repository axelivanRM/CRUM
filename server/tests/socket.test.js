import { io } from "socket.io-client";
import { latLngToCell } from "h3-js";

// Configuración
const TOTAL_CLIENTES = 5;
const INTERVALO_MIN = 1000;
const INTERVALO_MAX = 3000;

// Resolución H3
const H3_RESOLUTION = 9;

// Límites geográficos de CDMX
const CDMX_BOUNDS = {
  minLat: 19.2,
  maxLat: 19.6,
  minLong: -99.36,
  maxLong: -98.94,
};

const AMBULANCE_TYPES = ["BASIC", "ADVANCED", "INTENSIVE_CARE"];
const OPERATIONAL_BASES = ["CRUM", "ERUM", "IMSS", "ISSSTE", "CRUZ_ROJA"];
const AVAILABILITY_STATUSES = [
  "AVAILABLE",
  "UNAVAILABLE",
  "HEADING",
  "ON_SERVICE",
];

const ambulancias = [];

// Generar número aleatorio entre mínimo y máximo
const aleatorio = (min, max) => Math.random() * (max - min) + min;

// Generar entero aleatorio
const aleatorioEntero = (min, max) => Math.floor(aleatorio(min, max + 1));

// Generar coordenada aleatoria dentro de CDMX
function generarCoordenadas() {
  const latitude = Number(
    aleatorio(CDMX_BOUNDS.minLat, CDMX_BOUNDS.maxLat).toFixed(7),
  );

  const longitude = Number(
    aleatorio(CDMX_BOUNDS.minLong, CDMX_BOUNDS.maxLong).toFixed(7),
  );

  return {
    latitude,
    longitude,
  };
}

// Generar payload aleatorio
function generarPayload(i) {
  // Generar coordenadas
  const { latitude, longitude } = generarCoordenadas();

  // Calcular índice H3 real a partir de las coordenadas
  const h3Index = latLngToCell(latitude, longitude, H3_RESOLUTION);

  return {
    id: i + 1,
    licensePlate: `AMB-${String(i + 1).padStart(3, "0")}`,
    ambulanceType: AMBULANCE_TYPES[aleatorioEntero(0, AMBULANCE_TYPES.length - 1)],
    operationalBase:
      OPERATIONAL_BASES[aleatorioEntero(0, OPERATIONAL_BASES.length - 1)],
    availabilityStatus:
      AVAILABILITY_STATUSES[aleatorioEntero(0, AVAILABILITY_STATUSES.length - 1)],
    location: {
      latitude,
      longitude,
      h3Index,
    },
    timestamp: new Date().toISOString(),
    test: true
  };
}

console.log(`🚀 Iniciando simulación de ${TOTAL_CLIENTES} ambulancias...\n`);

// Crear clientes
for (let i = 0; i < TOTAL_CLIENTES; i++) {
  const TOKEN_UNICO = `token_ambulancia_${i + 1}`;

  const socket = io("http://localhost:3000", {
    auth: {
      token: TOKEN_UNICO,
      test: true,
    },
  });

  ambulancias.push(socket);

  // Programar siguiente envío
  function programarEnvio() {
    if (!socket.connected) return;

    const intervalo = aleatorioEntero(INTERVALO_MIN, INTERVALO_MAX);

    socket.dataTimeout = setTimeout(() => {
      if (!socket.connected) return;

      const payload = generarPayload(i);

      console.log(`📤 [Ambulancia ${i + 1}] Enviando actualización`, {
        intervalo: `${intervalo} ms`,
        payload,
      });

      socket.emit("ambulance:status", payload);

      // Programar siguiente envío
      programarEnvio();
    }, intervalo);
  }

  // Conexión
  socket.on("connect", () => {
    console.log(`✅ [Ambulancia ${i + 1}] Conectada: ${socket.id}`);

    // Primer envío
    const payload = generarPayload(i);

    console.log(`📤 [Ambulancia ${i + 1}] Primer envío`, payload);

    socket.emit("ambulance:status", payload);

    // Iniciar envíos aleatorios
    programarEnvio();
  });

  socket.on("server:assignment", (payload, callback) => {
    console.log("Posición recibida:", payload);
    // Responder al cliente
    callback({
      response: true,
    });
  });

  // Desconexión
  socket.on("disconnect", (reason) => {
    console.log(`❌ [Ambulancia ${i + 1}] Desconectada: ${reason}`);

    clearTimeout(socket.dataTimeout);
  });

  // Errores
  socket.on("connect_error", (err) => {
    console.error(`⚠️ [Ambulancia ${i + 1}] Error:`, err.message);
  });
}

// Detener simulación con Ctrl + C
process.on("SIGINT", () => {
  console.log("\n🛑 Deteniendo simulación...");

  ambulancias.forEach((socket) => {
    clearTimeout(socket.dataTimeout);
    socket.disconnect();
  });

  process.exit(0);
});