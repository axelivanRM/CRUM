CREATE OR REPLACE FUNCTION register_operator(
    username_input VARCHAR(50),
    password_hash_input VARCHAR(255),
    full_name_input VARCHAR(120),
    headquarters_input VARCHAR(100)
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
        2
    )
    RETURNING user_id INTO new_user_id;

    INSERT INTO operators (
        operator_id,
        full_name,
        headquarters
    )
    VALUES (
        new_user_id,
        full_name_input,
        headquarters_input
    );

    RETURN new_user_id;
END;
$$;