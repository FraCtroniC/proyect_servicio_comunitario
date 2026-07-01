import bcrypt from 'bcrypt';
import { sequelize, Rol, Usuario } from '../models';

async function seedTestUsers() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD.');

    let controlRol = await Rol.findOne({ where: { nombre: 'Control de Estudios' } });
    if (!controlRol) {
      controlRol = await Rol.create({
        nombre: 'Control de Estudios',
        descripcion: 'Gestión administrativa y control académico',
      });
      console.log('Rol "Control de Estudios" creado.');
    }
    const controlRolId = controlRol.getDataValue('id_rol');

    const adminRol = await Rol.findOne({ where: { nombre: 'Administrador' } });
    const docenteRol = await Rol.findOne({ where: { nombre: 'Docente' } });

    if (!adminRol || !docenteRol) {
      console.error('Roles Administrador y Docente deben existir. Ejecuta seed.ts primero.');
      process.exit(1);
    }

    const adminRolId = adminRol.getDataValue('id_rol');
    const docenteRolId = docenteRol.getDataValue('id_rol');

    const passwordHash = await bcrypt.hash('1234', 10);

    const adminExists = await Usuario.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await Usuario.create({
        id_rol: adminRolId,
        username: 'admin',
        password_hash: passwordHash,
        estatus: 'Activo',
      });
      console.log('Usuario "admin" creado (rol: Administrador, clave: 1234).');
    } else {
      console.log('Usuario "admin" ya existe.');
    }

    const controlExists = await Usuario.findOne({ where: { username: 'control' } });
    if (!controlExists) {
      await Usuario.create({
        id_rol: controlRolId,
        username: 'control',
        password_hash: passwordHash,
        estatus: 'Activo',
      });
      console.log('Usuario "control" creado (rol: Control de Estudios, clave: 1234).');
    } else {
      console.log('Usuario "control" ya existe.');
    }

    const docenteExists = await Usuario.findOne({ where: { username: 'docente' } });
    if (!docenteExists) {
      await Usuario.create({
        id_rol: docenteRolId,
        username: 'docente',
        password_hash: passwordHash,
        estatus: 'Activo',
      });
      console.log('Usuario "docente" creado (rol: Docente, clave: 1234).');
    } else {
      console.log('Usuario "docente" ya existe.');
    }

    console.log('\n--- USUARIOS DE PRUEBA ---');
    console.log('admin   | clave: 1234 | Rol: Administrador    -> super_admin');
    console.log('control | clave: 1234 | Rol: Control Estudios -> control_estudios');
    console.log('docente | clave: 1234 | Rol: Docente          -> docente');
    console.log('arturo  | clave: 1234 | Rol: Administrador    -> super_admin (seed original)');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTestUsers();
