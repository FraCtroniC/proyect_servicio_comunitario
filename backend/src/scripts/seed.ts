import { sequelize, Rol, Docente, Usuario, Representante, Estudiante } from '../models';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Iniciando proceso de poblado (seed) de la base de datos...');

  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada (force: true).');

    // 1. Roles (Asegurar que existan los roles base)
    const roles = [
      { nombre: 'Director', descripcion: 'Administrador del sistema' },
      { nombre: 'Control de Estudios', descripcion: 'Gestión académica' },
      { nombre: 'Docente', descripcion: 'Profesor de asignatura' },
    ];

    for (const r of roles) {
      await Rol.findOrCreate({
        where: { nombre: r.nombre },
        defaults: r
      });
    }
    console.log('✅ Roles verificados.');

    // 2. Docentes (10 Docentes)
    const docentesData = [
      { cedula_docente: 'V-10234567', nombre1: 'Maria', apellido1: 'Perez', especialidad: 'Licenciada en Educación', telefono: '0414-1234567', correo: 'maria.perez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-12345678', nombre1: 'Jose', apellido1: 'Gonzalez', especialidad: 'Profesor de Matemáticas', telefono: '0412-2345678', correo: 'jose.gonzalez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-13456789', nombre1: 'Carmen', apellido1: 'Rodriguez', especialidad: 'Especialista en Historia', telefono: '0416-3456789', correo: 'carmen.rodriguez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-14567890', nombre1: 'Luis', apellido1: 'Fernandez', especialidad: 'Profesor de Física', telefono: '0424-4567890', correo: 'luis.fernandez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-15678901', nombre1: 'Ana', apellido1: 'Lopez', especialidad: 'Licenciada en Letras', telefono: '0414-5678901', correo: 'ana.lopez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-16789012', nombre1: 'Pedro', apellido1: 'Martinez', especialidad: 'Profesor de Biología', telefono: '0412-6789012', correo: 'pedro.martinez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-17890123', nombre1: 'Luisa', apellido1: 'Gomez', especialidad: 'Especialista en Química', telefono: '0416-7890123', correo: 'luisa.gomez@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-18901234', nombre1: 'Carlos', apellido1: 'Diaz', especialidad: 'Profesor de Educación Física', telefono: '0424-8901234', correo: 'carlos.diaz@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-19012345', nombre1: 'Marta', apellido1: 'Torres', especialidad: 'Licenciada en Geografía', telefono: '0414-9012345', correo: 'marta.torres@liceo.edu.ve', estatus: 'Activo' },
      { cedula_docente: 'V-20123456', nombre1: 'Jorge', apellido1: 'Ruiz', especialidad: 'Profesor de Inglés', telefono: '0412-0123456', correo: 'jorge.ruiz@liceo.edu.ve', estatus: 'Activo' },
    ];

    const docentesGenerados = [];
    for (const d of docentesData) {
      const [docente] = await Docente.findOrCreate({
        where: { cedula_docente: d.cedula_docente },
        defaults: d
      });
      docentesGenerados.push(docente);
    }
    console.log('✅ Docentes insertados.');

    // 3. Usuarios (10 Usuarios)
    const passwordHash = await bcrypt.hash('Liceo2026', 10);
    
    // Obtener roles existentes para saber sus IDs reales
    const rolDocente = await Rol.findOne({ where: { nombre: 'Docente' } });
    const rolControl = await Rol.findOne({ where: { nombre: 'Control de Estudios' } });
    const rolDirector = await Rol.findOne({ where: { nombre: 'Director' } });
    
    const idDoc = rolDocente ? rolDocente.get('id_rol') : 3;
    const idCtrl = rolControl ? rolControl.get('id_rol') : 2;
    const idDir = rolDirector ? rolDirector.get('id_rol') : 1;

    for (let i = 0; i < docentesGenerados.length; i++) {
      const docente = docentesGenerados[i];
      const dData = docentesData[i];
      const username = `${dData.nombre1.toLowerCase()}.${dData.apellido1.toLowerCase()}`;
      
      let idRol = idDoc;
      if (i === 0) idRol = idDir;
      if (i === 1 || i === 2) idRol = idCtrl;

      await Usuario.findOrCreate({
        where: { username },
        defaults: {
          id_rol: idRol,
          id_docente: docente.get('id_docente'),
          username,
          password_hash: passwordHash,
          correo: dData.correo,
          estatus: 'Activo'
        }
      });
    }
    console.log('✅ Usuarios insertados (Clave: Liceo2026).');

    // 4. Representantes (10 Representantes)
    const representantesData = [
      { cedula_rep: 'V-10111222', nombre1: 'Roberto', apellido1: 'Alvarez', telefono: '0414-1112223', direccion: 'Sector Centro' },
      { cedula_rep: 'V-11222333', nombre1: 'Elena', apellido1: 'Vargas', telefono: '0412-2223334', direccion: 'Urb. Los Pinos' },
      { cedula_rep: 'V-12333444', nombre1: 'Miguel', apellido1: 'Castillo', telefono: '0416-3334445', direccion: 'Barrio Sucre' },
      { cedula_rep: 'V-13444555', nombre1: 'Rosa', apellido1: 'Mendez', telefono: '0424-4445556', direccion: 'Av. Bolívar' },
      { cedula_rep: 'V-14555666', nombre1: 'Jesus', apellido1: 'Rojas', telefono: '0414-5556667', direccion: 'Sector El Carmen' },
      { cedula_rep: 'V-15666777', nombre1: 'Blanca', apellido1: 'Suarez', telefono: '0412-6667778', direccion: 'Urb. Las Acacias' },
      { cedula_rep: 'V-16777888', nombre1: 'Rafael', apellido1: 'Ortega', telefono: '0416-7778889', direccion: 'Sector La Paz' },
      { cedula_rep: 'V-17888999', nombre1: 'Gladys', apellido1: 'Silva', telefono: '0424-8889990', direccion: 'Barrio Obrero' },
      { cedula_rep: 'V-18999000', nombre1: 'Simon', apellido1: 'Paredes', telefono: '0414-9990001', direccion: 'Urb. San Jose' },
      { cedula_rep: 'V-19000111', nombre1: 'Teresa', apellido1: 'Campos', telefono: '0412-0001112', direccion: 'Sector Bella Vista' },
    ];

    const representantesGenerados = [];
    for (const r of representantesData) {
      const [rep] = await Representante.findOrCreate({
        where: { cedula_rep: r.cedula_rep },
        defaults: r
      });
      representantesGenerados.push(rep);
    }
    console.log('✅ Representantes insertados.');

    // 5. Estudiantes (15 Estudiantes asignados a los representantes)
    const estudiantesData = [
      { cedula_escolar: 'V-30111222', nombre1: 'Daniel', apellido1: 'Alvarez', fecha_nac: new Date('2010-05-14'), lugar_nac: 'Hospital Central', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-30111223', nombre1: 'Sofia', apellido1: 'Alvarez', fecha_nac: new Date('2011-08-20'), lugar_nac: 'Hospital Central', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-31222333', nombre1: 'Carlos', apellido1: 'Vargas', fecha_nac: new Date('2010-11-03'), lugar_nac: 'Clinica Sucre', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-32333444', nombre1: 'Diego', apellido1: 'Castillo', fecha_nac: new Date('2009-02-15'), lugar_nac: 'Ambulatorio', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-33444555', nombre1: 'Valeria', apellido1: 'Mendez', fecha_nac: new Date('2010-09-10'), lugar_nac: 'Hospital Central', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-34555666', nombre1: 'Andres', apellido1: 'Rojas', fecha_nac: new Date('2008-12-25'), lugar_nac: 'Clinica El Carmen', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-35666777', nombre1: 'Camila', apellido1: 'Suarez', fecha_nac: new Date('2011-01-30'), lugar_nac: 'Hospital Central', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-36777888', nombre1: 'Santiago', apellido1: 'Ortega', fecha_nac: new Date('2010-04-18'), lugar_nac: 'Hospital Central', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-37888999', nombre1: 'Isabella', apellido1: 'Silva', fecha_nac: new Date('2009-07-22'), lugar_nac: 'Ambulatorio', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-38999000', nombre1: 'Matias', apellido1: 'Paredes', fecha_nac: new Date('2010-10-05'), lugar_nac: 'Hospital Central', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-39000111', nombre1: 'Valentina', apellido1: 'Campos', fecha_nac: new Date('2011-03-12'), lugar_nac: 'Clinica San Jose', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-39111222', nombre1: 'Sebastian', apellido1: 'Vargas', fecha_nac: new Date('2008-06-08'), lugar_nac: 'Hospital Central', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-39222333', nombre1: 'Lucia', apellido1: 'Castillo', fecha_nac: new Date('2011-09-17'), lugar_nac: 'Clinica Sucre', genero: 'F', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-39333444', nombre1: 'Gabriel', apellido1: 'Mendez', fecha_nac: new Date('2009-11-29'), lugar_nac: 'Hospital Central', genero: 'M', estatus_estudiante: 'Activo' },
      { cedula_escolar: 'V-39444555', nombre1: 'Victoria', apellido1: 'Paredes', fecha_nac: new Date('2010-12-01'), lugar_nac: 'Hospital Central', genero: 'F', estatus_estudiante: 'Retirado' },
    ];

    for (let i = 0; i < estudiantesData.length; i++) {
      const e = estudiantesData[i];
      // Asignar representante (repartir cíclicamente)
      const rep = representantesGenerados[i % representantesGenerados.length];
      
      await Estudiante.findOrCreate({
        where: { cedula_escolar: e.cedula_escolar },
        defaults: {
          ...e,
          id_representante: rep.get('id_representante')
        }
      });
    }
    console.log('✅ Estudiantes insertados.');

    console.log('🎉 Poblado de datos completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el poblado de datos:', error);
    process.exit(1);
  }
}

seed();
