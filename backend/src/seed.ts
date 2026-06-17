import bcrypt from 'bcrypt';
import { sequelize, Rol, Usuario } from './models';

const SALT_ROUNDS = 10;

async function seed() {
  try {
    console.log('Iniciando el sembrado de base de datos...');
    await sequelize.authenticate();
    console.log('Conexión con la BD establecida.');

    // 1. Sembrar roles si no existen
    const rolesCount = await Rol.count();
    let adminRolId = 1;

    if (rolesCount === 0) {
      console.log('No se encontraron roles, creando roles por defecto...');
      const adminRol = await Rol.create({
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema de control de notas y asistencia',
      });
      adminRolId = adminRol.getDataValue('id_rol');

      await Rol.create({
        nombre: 'Docente',
        descripcion: 'Acceso a registrar calificaciones y asistencias de sus secciones asignadas',
      });

      await Rol.create({
        nombre: 'Secretaria',
        descripcion: 'Gestión administrativa del plantel',
      });

      await Rol.create({
        nombre: 'Coordinador',
        descripcion: 'Supervisión académica y de personal',
      });

      console.log('Roles sembrados con éxito.');
    } else {
      console.log('Roles ya existentes en la BD.');
      const adminRol = await Rol.findOne({ where: { nombre: 'Administrador' } });
      if (adminRol) {
        adminRolId = adminRol.getDataValue('id_rol');
      }
    }

    // 2. Sembrar usuario por defecto si no existen usuarios
    const usuariosCount = await Usuario.count();
    if (usuariosCount === 0) {
      console.log('No se encontraron usuarios, creando usuario arturo (clave: 1234)...');
      const passwordHash = await bcrypt.hash('1234', SALT_ROUNDS);

      await Usuario.create({
        id_rol: adminRolId,
        username: 'arturo',
        password_hash: passwordHash,
        estatus: 'Activo',
      });
      console.log('Usuario de prueba "arturo" creado con éxito.');
    } else {
      console.log('Usuarios ya existentes en la BD.');
    }

    console.log('Proceso de sembrado finalizado correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el sembrado de la BD:', error);
    process.exit(1);
  }
}

seed();
