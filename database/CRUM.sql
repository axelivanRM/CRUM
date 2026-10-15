-- =============================================================================
-- ESQUEMA DE BASE DE DATOS: CRUM
-- Sistema de Coordinación y Despacho de Emergencias Médicas
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role SMALLINT NOT NULL CHECK (role IN (1, 2, 3)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS operators (
    operator_id INT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    headquarters VARCHAR(100) NOT NULL,
    CONSTRAINT fk_operator_user
        FOREIGN KEY (operator_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ambulances (
    ambulance_id INT PRIMARY KEY,
    license_plate VARCHAR(10) NOT NULL,
    ambulance_type SMALLINT NOT NULL CHECK (ambulance_type IN (1, 2, 3, 4)),
    operating_base VARCHAR(100) NOT NULL,
    CONSTRAINT fk_ambulance_user
        FOREIGN KEY (ambulance_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(10),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergencies (
    emergency_id SERIAL PRIMARY KEY,
    operator_id INT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    emergency_type SMALLINT NOT NULL CHECK (emergency_type IN (1, 2, 3)),
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    conversation JSONB,
    CONSTRAINT fk_emergency_operator
        FOREIGN KEY (operator_id)
        REFERENCES operators(operator_id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    emergency_id INT NOT NULL,
    ambulance_id INT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    arrived_at TIMESTAMP WITH TIME ZONE,
    requested_ambulance_type SMALLINT NOT NULL
        CHECK (requested_ambulance_type IN (1, 2, 3)),
    justification VARCHAR(100),
    route JSONB,
    numeric_rating SMALLINT CHECK (numeric_rating BETWEEN 1 AND 5),
    comment TEXT,
    CONSTRAINT fk_assignment_emergency
        FOREIGN KEY (emergency_id)
        REFERENCES emergencies(emergency_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_assignment_ambulance
        FOREIGN KEY (ambulance_id)
        REFERENCES ambulances(ambulance_id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_message_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS hospital_transfers (
    hospital_transfer_id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL UNIQUE,
    hospital_id INT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transfer_started_at TIMESTAMP WITH TIME ZONE,
    transfer_completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_transfer_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_transfer_hospital
        FOREIGN KEY (hospital_id)
        REFERENCES hospitals(hospital_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_transfer_timestamps CHECK (
        transfer_completed_at IS NULL
        OR (
            transfer_started_at IS NOT NULL
            AND transfer_completed_at >= transfer_started_at
        )
    )
);

-- =============================================================================
-- ÍNDICES RECOMENDADOS (Optimización de búsquedas y coordenadas)
-- =============================================================================
--CREATE INDEX IF NOT EXISTS idx_emergencias_operador ON emergencias(id_operador);
--CREATE INDEX IF NOT EXISTS idx_asignaciones_emergencia ON asignaciones(id_emergencia);
--CREATE INDEX IF NOT EXISTS idx_asignaciones_ambulancia ON asignaciones(id_ambulancia);
--CREATE INDEX IF NOT EXISTS idx_mensajes_asignacion ON mensajes(id_asignacion);