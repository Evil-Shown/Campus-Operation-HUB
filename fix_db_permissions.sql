-- Fix database permissions for campus_user
GRANT CONNECT ON DATABASE campus_op_hub TO campus_user;
GRANT USAGE ON SCHEMA public TO campus_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO campus_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO campus_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO campus_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO campus_user;






-- Fix all permissions for campus_user on the database
GRANT CONNECT ON DATABASE campus_op_hub TO campus_user;
GRANT USAGE ON SCHEMA public TO campus_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO campus_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO campus_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO campus_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO campus_user;