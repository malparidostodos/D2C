-- Reemplaza 'correo_nuevo@ejemplo.com' con el email real que quieres autorizar
INSERT INTO admin_users (email) VALUES ('correo_nuevo@ejemplo.com');

-- Si quieres ver quiénes son admins actualmente:
-- SELECT * FROM admin_users;

-- Si quieres eliminar un admin:
-- DELETE FROM admin_users WHERE email = 'correo_a_eliminar@ejemplo.com';
