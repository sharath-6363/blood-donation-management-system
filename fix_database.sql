-- Fix existing users table to set default role
UPDATE users SET role = 'STAFF' WHERE role IS NULL;

-- Verify the update
SELECT id, username, email, role, created_at FROM users;
