CREATE OR REPLACE FUNCTION register_admin(
    username_input VARCHAR(50),
    password_hash_input VARCHAR(255)
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
        3
    )
    RETURNING user_id INTO new_user_id;

    RETURN new_user_id;
END;
$$;