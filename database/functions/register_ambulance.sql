CREATE OR REPLACE FUNCTION register_ambulance(
    username_input VARCHAR(50),
    password_hash_input VARCHAR(255),
    license_plate_input VARCHAR(10),
    ambulance_type_input SMALLINT,
    operating_base_input VARCHAR(100)
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id INT;
BEGIN
    INSERT INTO users (
        username,
        password_hash,
        role
    )
    VALUES (
        username_input,
        password_hash_input,
        1
    )
    RETURNING user_id INTO new_user_id;

    INSERT INTO ambulances (
        ambulance_id,
        license_plate,
        ambulance_type,
        operating_base
    )
    VALUES (
        new_user_id,
        license_plate_input,
        ambulance_type_input,
        operating_base_input
    );

    RETURN new_user_id;
END;
$$;