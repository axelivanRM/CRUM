-- =============================================================================
-- ESQUEMA DE BASE DE DATOS: CRUM
-- Sistema de Coordinación y Despacho de Emergencias Médicas
-- =============================================================================

-- 1. TABLA BASE: USUARIOS (Autenticación y Roles del sistema)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol SMALLINT NOT NULL CHECK (rol IN (1, 2, 3)),
    creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

insert into usuarios(usuario, contrasena, rol) values ('Axel', 'cosasporhacer.com', 1)

-- 2. ESPECIALIZACIÓN: OPERADOR (Hereda de usuarios)
CREATE TABLE IF NOT EXISTS operadores (
    id_operador INT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    sede_crum VARCHAR(100) NOT NULL,
    CONSTRAINT fk_operador_usuario FOREIGN KEY (id_operador) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 3. ESPECIALIZACIÓN: AMBULANCIAS (Hereda de usuarios)
CREATE TABLE IF NOT EXISTS ambulancias (
    id_ambulancia INT PRIMARY KEY,
    placas VARCHAR(10) NOT NULL UNIQUE,
    tipo_ambulancia SMALLINT NOT NULL CHECK (tipo_ambulancia IN (1, 2, 3, 4)),
    base_operativa VARCHAR(100) NOT NULL,
    CONSTRAINT fk_ambulancia_usuario FOREIGN KEY (id_ambulancia) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 4. HOSPITALES (Destinos de traslado)
CREATE TABLE IF NOT EXISTS hospitales (
    id_hospital SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono_contacto VARCHAR(10),
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EMERGENCIAS (Incidentes reportados coordinados por un operador)
CREATE TABLE IF NOT EXISTS emergencias (
    id_emergencia SERIAL PRIMARY KEY,
    id_operador INT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    tipo_emergencia SMALLINT NOT NULL CHECK (tipo_emergencia IN (1, 2, 3)),
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL ,
    longitud DECIMAL(11, 8) NOT NULL ,
    hora_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_cierre TIMESTAMP WITH TIME ZONE,
    conversacion JSONB,
    CONSTRAINT fk_emergencia_operador FOREIGN KEY (id_operador) 
        REFERENCES operadores(id_operador) ON DELETE RESTRICT
);

-- 6. ASIGNACIONES (Despacho de ambulancia, solicitud a hospital y calificación del servicio)
CREATE TABLE IF NOT EXISTS asignaciones (
    id_asignacion SERIAL PRIMARY KEY,
    id_emergencia INT NOT NULL,
    id_ambulancia INT,
    
    -- Tiempos del ciclo de vida del servicio
    hora_asignacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_llegada TIMESTAMP WITH TIME ZONE,
    -- Detalles de operación y traslado
    tipo_ambulacia_solicitado SMALLINT NOT NULL CHECK (tipo_ambulacia_solicitado IN (1, 2, 3)),
    justificacion VARCHAR(100),
    ruta JSONB,
    
    CONSTRAINT fk_asignacion_emergencia FOREIGN KEY (id_emergencia) 
        REFERENCES emergencias(id_emergencia) ON DELETE CASCADE,
    CONSTRAINT fk_asignacion_ambulancia FOREIGN KEY (id_ambulancia) 
        REFERENCES ambulancias(id_ambulancia) ON DELETE RESTRICT
);

ALTER TABLE asignaciones 
ADD COLUMN calificacion_numerica SMALLINT CHECK (calificacion_numerica BETWEEN 1 AND 5)

ALTER TABLE asignaciones 
ADD COLUMN comentario Text

-- 7. MENSAJES (Chat / Bitácora operativa en tiempo real entre operador y unidad)
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL,
    id_remitente INT NOT NULL,
    contenido TEXT NOT NULL,
    hora_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_entrega TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_mensaje_asignacion FOREIGN KEY (id_asignacion) 
        REFERENCES asignaciones(id_asignacion) ON DELETE CASCADE,
    CONSTRAINT fk_mensaje_remitente FOREIGN KEY (id_remitente) 
        REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS hospitalizaciones (
    id_hospitalizacion SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL UNIQUE,
    id_hospital INT,
    hora_solicitud TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_traslado_inicio TIMESTAMP WITH TIME ZONE,
    hora_traslado_cierre TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_hosp_asignacion FOREIGN KEY (id_asignacion)
        REFERENCES asignaciones(id_asignacion) ON DELETE CASCADE,
    CONSTRAINT fk_hosp_hospital FOREIGN KEY (id_hospital)
        REFERENCES hospitales(id_hospital) ON DELETE RESTRICT,
    CONSTRAINT chk_tiempos_traslado CHECK (
        hora_traslado_cierre IS NULL OR 
        (hora_traslado_inicio IS NOT NULL AND hora_traslado_cierre >= hora_traslado_inicio)
    )
);

CREATE TABLE IF NOT EXISTS calificaciones (
    id_calificacion SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL,
    calificacion_numerica SMALLINT NOT NULL CHECK (calificacion_numerica BETWEEN 1 AND 5),
    comentario TEXT,
    creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calif_asignacion FOREIGN KEY (id_asignacion)
        REFERENCES asignaciones(id_asignacion) ON DELETE CASCADE
);

DROP TABLE calificaciones

-- =============================================================================
-- ÍNDICES RECOMENDADOS (Optimización de búsquedas y coordenadas)
-- =============================================================================
--CREATE INDEX IF NOT EXISTS idx_emergencias_operador ON emergencias(id_operador);
--CREATE INDEX IF NOT EXISTS idx_asignaciones_emergencia ON asignaciones(id_emergencia);
--CREATE INDEX IF NOT EXISTS idx_asignaciones_ambulancia ON asignaciones(id_ambulancia);
--CREATE INDEX IF NOT EXISTS idx_mensajes_asignacion ON mensajes(id_asignacion);