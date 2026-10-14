CREATE OR REPLACE FUNCTION user_exists(
    username_input VARCHAR,
    role_input SMALLINT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE username = username_input
          AND role = role_input
    );
$$;