import { sequelize, Rol, Persona, Docente, Usuario, Representante, Estudiante, EscalaCalificacion } from '../models';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Iniciando proceso de poblado (seed) de la base de datos...');

  try {
    await sequelize.authenticate();
    console.log('Conexion a la base de datos establecida.');
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada (force: true).');

    // 1. Roles
    const roles = [
      { id_rol: 4, nombre: 'Administrador', descripcion: 'Administrador del sistema' },
      { id_rol: 8, nombre: 'Control de Estudios', descripcion: 'Gestión academica' },
      { id_rol: 5, nombre: 'Docente', descripcion: 'Profesor de asignatura' },
    ];

    for (const r of roles) {
      await Rol.findOrCreate({ where: { id_rol: r.id_rol }, defaults: r });
    }
    console.log('Roles verificados.');

    // 1.5 Escala Calificaciones
    for (let i = 1; i <= 20; i++) {
      let literal = '';
      if (i < 10) literal = 'Insuficiente';
      else if (i < 15) literal = 'Minima';
      else literal = 'Sobresaliente';
      let letra = 'C';
      if (i >= 15) letra = 'A';
      else if (i >= 10) letra = 'B';
      await EscalaCalificacion.findOrCreate({
        where: { id_escala: i },
        defaults: { id_escala: i, nota_impresa: i.toString().padStart(2, '0'), nota_literal: literal, nota_calculo: i, ponderacion_letra: letra }
      });
    }
    console.log('Escala de calificaciones insertada.');

    // 2. Docentes (12) y sus Personas
    const docentesData = [
      { cedula: 'V-10234567', nombre1: 'Maria', apellido1: 'Perez', telefono: '0414-1234567', correo: 'maria.perez@liceo.edu.ve' },
      { cedula: 'V-12345678', nombre1: 'Jose', apellido1: 'Gonzalez', telefono: '0412-2345678', correo: 'jose.gonzalez@liceo.edu.ve' },
      { cedula: 'V-13456789', nombre1: 'Carmen', apellido1: 'Rodriguez', telefono: '0416-3456789', correo: 'carmen.rodriguez@liceo.edu.ve' },
      { cedula: 'V-14567890', nombre1: 'Luis', apellido1: 'Fernandez', telefono: '0424-4567890', correo: 'luis.fernandez@liceo.edu.ve' },
      { cedula: 'V-15678901', nombre1: 'Ana', apellido1: 'Lopez', telefono: '0414-5678901', correo: 'ana.lopez@liceo.edu.ve' },
      { cedula: 'V-16789012', nombre1: 'Pedro', apellido1: 'Martinez', telefono: '0412-6789012', correo: 'pedro.martinez@liceo.edu.ve' },
      { cedula: 'V-17890123', nombre1: 'Luisa', apellido1: 'Gomez', telefono: '0416-7890123', correo: 'luisa.gomez@liceo.edu.ve' },
      { cedula: 'V-18901234', nombre1: 'Carlos', apellido1: 'Diaz', telefono: '0424-8901234', correo: 'carlos.diaz@liceo.edu.ve' },
      { cedula: 'V-19012345', nombre1: 'Marta', apellido1: 'Torres', telefono: '0414-9012345', correo: 'marta.torres@liceo.edu.ve' },
      { cedula: 'V-20123456', nombre1: 'Jorge', apellido1: 'Ruiz', telefono: '0412-0123456', correo: 'jorge.ruiz@liceo.edu.ve' },
      { cedula: 'V-21234567', nombre1: 'Diana', apellido1: 'Morales', telefono: '0414-1122334', correo: 'diana.morales@liceo.edu.ve' },
      { cedula: 'V-22345678', nombre1: 'Ricardo', apellido1: 'Navas', telefono: '0412-2233445', correo: 'ricardo.navas@liceo.edu.ve' },
    ];

    const passwordHash = await bcrypt.hash('Liceo2026', 10);
    const rolDocente = await Rol.findOne({ where: { nombre: 'Docente' } });
    const rolControl = await Rol.findOne({ where: { nombre: 'Control de Estudios' } });
    const rolDirector = await Rol.findOne({ where: { nombre: 'Administrador' } });
    const idDoc = rolDocente ? rolDocente.get('id_rol') : 5;
    const idCtrl = rolControl ? rolControl.get('id_rol') : 8;
    const idDir = rolDirector ? rolDirector.get('id_rol') : 4;

    for (let i = 0; i < docentesData.length; i++) {
      const d = docentesData[i];
      const persona = await Persona.create({
        cedula: d.cedula, nombre1: d.nombre1, apellido1: d.apellido1,
        telefono: d.telefono, correo: d.correo,
      });

      const docente = await Docente.create({
        id_persona: persona.id_persona, estatus: 'Activo',
      });

      let idRol = idDoc;
      if (i === 0) idRol = idDir;
      if (i === 1 || i === 2) idRol = idCtrl;

      const username = `${d.nombre1.toLowerCase()}.${d.apellido1.toLowerCase()}`;
      await Usuario.create({
        id_rol: idRol,
        id_docente: docente.id_docente,
        id_persona: persona.id_persona,
        username,
        password_hash: passwordHash,
        estatus: 'Activo',
      });
    }
    console.log('Docentes y usuarios insertados (Clave: Liceo2026).');

    // 3. Representantes (10) y sus Personas
    const representantesData = [
      { cedula: 'V-10111222', nombre1: 'Roberto', apellido1: 'Alvarez', telefono: '0414-1112223', direccion: 'Sector Centro' },
      { cedula: 'V-11222333', nombre1: 'Elena', apellido1: 'Vargas', telefono: '0412-2223334', direccion: 'Urb. Los Pinos' },
      { cedula: 'V-12333444', nombre1: 'Miguel', apellido1: 'Castillo', telefono: '0416-3334445', direccion: 'Barrio Sucre' },
      { cedula: 'V-13444555', nombre1: 'Rosa', apellido1: 'Mendez', telefono: '0424-4445556', direccion: 'Av. Bolivar' },
      { cedula: 'V-14555666', nombre1: 'Jesus', apellido1: 'Rojas', telefono: '0414-5556667', direccion: 'Sector El Carmen' },
      { cedula: 'V-15666777', nombre1: 'Blanca', apellido1: 'Suarez', telefono: '0412-6667778', direccion: 'Urb. Las Acacias' },
      { cedula: 'V-16777888', nombre1: 'Rafael', apellido1: 'Ortega', telefono: '0416-7778889', direccion: 'Sector La Paz' },
      { cedula: 'V-17888999', nombre1: 'Gladys', apellido1: 'Silva', telefono: '0424-8889990', direccion: 'Barrio Obrero' },
      { cedula: 'V-18999000', nombre1: 'Simon', apellido1: 'Paredes', telefono: '0414-9990001', direccion: 'Urb. San Jose' },
      { cedula: 'V-19000111', nombre1: 'Teresa', apellido1: 'Campos', telefono: '0412-0001112', direccion: 'Sector Bella Vista' },
    ];

    for (const r of representantesData) {
      const persona = await Persona.create({
        cedula: r.cedula, nombre1: r.nombre1, apellido1: r.apellido1,
      });
      await Representante.create({
        id_persona: persona.id_persona, telefono: r.telefono, direccion: r.direccion,
      });
    }
    console.log('Representantes insertados.');

    // 4. Estudiantes (15) y sus Personas
    const estudiantesData = [
      { cedula: 'V-30111222', nombre1: 'Daniel', apellido1: 'Alvarez', fecha_nac: new Date('2010-05-14'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-30111223', nombre1: 'Sofia', apellido1: 'Alvarez', fecha_nac: new Date('2011-08-20'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-31222333', nombre1: 'Carlos', apellido1: 'Vargas', fecha_nac: new Date('2010-11-03'), lugar_nac: 'Clinica Sucre' },
      { cedula: 'V-32333444', nombre1: 'Diego', apellido1: 'Castillo', fecha_nac: new Date('2009-02-15'), lugar_nac: 'Ambulatorio' },
      { cedula: 'V-33444555', nombre1: 'Valeria', apellido1: 'Mendez', fecha_nac: new Date('2010-09-10'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-34555666', nombre1: 'Andres', apellido1: 'Rojas', fecha_nac: new Date('2008-12-25'), lugar_nac: 'Clinica El Carmen' },
      { cedula: 'V-35666777', nombre1: 'Camila', apellido1: 'Suarez', fecha_nac: new Date('2011-01-30'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-36777888', nombre1: 'Santiago', apellido1: 'Ortega', fecha_nac: new Date('2010-04-18'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-37888999', nombre1: 'Isabella', apellido1: 'Silva', fecha_nac: new Date('2009-07-22'), lugar_nac: 'Ambulatorio' },
      { cedula: 'V-38999000', nombre1: 'Matias', apellido1: 'Paredes', fecha_nac: new Date('2010-10-05'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-39000111', nombre1: 'Valentina', apellido1: 'Campos', fecha_nac: new Date('2011-03-12'), lugar_nac: 'Clinica San Jose' },
      { cedula: 'V-39111222', nombre1: 'Sebastian', apellido1: 'Vargas', fecha_nac: new Date('2008-06-08'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-39222333', nombre1: 'Lucia', apellido1: 'Castillo', fecha_nac: new Date('2011-09-17'), lugar_nac: 'Clinica Sucre' },
      { cedula: 'V-39333444', nombre1: 'Gabriel', apellido1: 'Mendez', fecha_nac: new Date('2009-11-29'), lugar_nac: 'Hospital Central' },
      { cedula: 'V-39444555', nombre1: 'Victoria', apellido1: 'Paredes', fecha_nac: new Date('2010-12-01'), lugar_nac: 'Hospital Central' },
    ];

    const representantes = await Representante.findAll();
    for (let i = 0; i < estudiantesData.length; i++) {
      const e = estudiantesData[i];
      const rep = representantes[i % representantes.length];
      const persona = await Persona.create({
        cedula: e.cedula, nombre1: e.nombre1, apellido1: e.apellido1,
        fecha_nac: e.fecha_nac, genero: (e.nombre1.endsWith('a') ? 'F' : 'M'),
      });
      await Estudiante.create({
        id_persona: persona.id_persona,
        lugar_nac: e.lugar_nac,
        id_representante: rep.get('id_representante') as number,
        estatus_estudiante: 'Activo',
      });
    }
    console.log('Estudiantes insertados.');

    console.log('Poblado de datos completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el poblado de datos:', error);
    process.exit(1);
  }
}

seed();
