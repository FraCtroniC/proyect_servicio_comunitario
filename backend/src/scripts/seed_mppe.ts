import { sequelize, Asignatura, PlanEstudio, GradoAno } from '../models';

async function seedMPPE() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD.');

    console.log('Borrando PlanEstudio actual...');
    await PlanEstudio.destroy({ where: {} });
    console.log('Borrando Asignaturas actuales...');
    await Asignatura.destroy({ where: {} });

    const grados = await GradoAno.findAll();
    const gradoMap = new Map();
    grados.forEach((g: any) => gradoMap.set(g.numero, g.id_grado));

    if (!gradoMap.has(1)) {
        console.error('No se encontraron los grados del 1 al 5 en la BD.');
        process.exit(1);
    }

    const asignaturasBase = [
      'Castellano', 'Inglés', 'Matemática', 'Educación Física',
      'Arte y Patrimonio', 'Ciencias Naturales', 'Geografía, Historia y Ciudadanía',
      'Orientación y Convivencia', 'Grupos Creación, Recreación y Producción',
      'Física', 'Química', 'Biología', 'Formación para la Soberanía Nacional',
      'Ciencias de la Tierra'
    ];

    const asigMap = new Map();
    for (const name of asignaturasBase) {
      const a = await Asignatura.create({ nombre: name, tipo_calificacion: 'Cuantitativa' }) as any;
      asigMap.set(name, a.id_asignatura);
    }
    console.log('Asignaturas base creadas.');

    const plan = [
      ...[1, 2].flatMap(y => [
        { asig: 'Castellano', cod: `CAS${y}`, pos: 1, year: y },
        { asig: 'Inglés', cod: `ING${y}`, pos: 2, year: y },
        { asig: 'Matemática', cod: `MAT${y}`, pos: 3, year: y },
        { asig: 'Educación Física', cod: `EDF${y}`, pos: 4, year: y },
        { asig: 'Arte y Patrimonio', cod: `AYP${y}`, pos: 5, year: y },
        { asig: 'Ciencias Naturales', cod: `CNA${y}`, pos: 6, year: y },
        { asig: 'Geografía, Historia y Ciudadanía', cod: `GHC${y}`, pos: 7, year: y },
        { asig: 'Orientación y Convivencia', cod: `OYC${y}`, pos: 8, year: y },
        { asig: 'Grupos Creación, Recreación y Producción', cod: `CRP${y}`, pos: 9, year: y },
      ]),
      ...[
        { asig: 'Castellano', cod: 'CAS3', pos: 1, year: 3 },
        { asig: 'Inglés', cod: 'ING3', pos: 2, year: 3 },
        { asig: 'Matemática', cod: 'MAT3', pos: 3, year: 3 },
        { asig: 'Educación Física', cod: 'EDF3', pos: 4, year: 3 },
        { asig: 'Física', cod: 'FIS3', pos: 5, year: 3 },
        { asig: 'Química', cod: 'QUI3', pos: 6, year: 3 },
        { asig: 'Biología', cod: 'BIO3', pos: 7, year: 3 },
        { asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC3', pos: 8, year: 3 },
        { asig: 'Orientación y Convivencia', cod: 'OYC3', pos: 9, year: 3 },
        { asig: 'Grupos Creación, Recreación y Producción', cod: 'CRP3', pos: 10, year: 3 },
      ],
      ...[
        { asig: 'Castellano', cod: 'CAS4', pos: 1, year: 4 },
        { asig: 'Inglés', cod: 'ING4', pos: 2, year: 4 },
        { asig: 'Matemática', cod: 'MAT4', pos: 3, year: 4 },
        { asig: 'Educación Física', cod: 'EDF4', pos: 4, year: 4 },
        { asig: 'Física', cod: 'FIS4', pos: 5, year: 4 },
        { asig: 'Química', cod: 'QUI4', pos: 6, year: 4 },
        { asig: 'Biología', cod: 'BIO4', pos: 7, year: 4 },
        { asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC4', pos: 8, year: 4 },
        { asig: 'Formación para la Soberanía Nacional', cod: 'FSN4', pos: 9, year: 4 },
        { asig: 'Orientación y Convivencia', cod: 'OYC4', pos: 10, year: 4 },
        { asig: 'Grupos Creación, Recreación y Producción', cod: 'CRP4', pos: 11, year: 4 },
      ],
      ...[
        { asig: 'Castellano', cod: 'CAS5', pos: 1, year: 5 },
        { asig: 'Inglés', cod: 'ING5', pos: 2, year: 5 },
        { asig: 'Matemática', cod: 'MAT5', pos: 3, year: 5 },
        { asig: 'Educación Física', cod: 'EDF5', pos: 4, year: 5 },
        { asig: 'Física', cod: 'FIS5', pos: 5, year: 5 },
        { asig: 'Química', cod: 'QUI5', pos: 6, year: 5 },
        { asig: 'Biología', cod: 'BIO5', pos: 7, year: 5 },
        { asig: 'Ciencias de la Tierra', cod: 'CST5', pos: 8, year: 5 },
        { asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC5', pos: 9, year: 5 },
        { asig: 'Formación para la Soberanía Nacional', cod: 'FSN5', pos: 10, year: 5 },
        { asig: 'Orientación y Convivencia', cod: 'OYC5', pos: 11, year: 5 },
        { asig: 'Grupos Creación, Recreación y Producción', cod: 'CRP5', pos: 12, year: 5 },
      ]
    ];

    for (const item of plan) {
      await PlanEstudio.create({
        id_asignatura: asigMap.get(item.asig),
        id_grado: gradoMap.get(item.year),
        codigo_asignatura: item.cod,
        posicion: item.pos
      });
    }

    console.log('Plan de Estudio inyectado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedMPPE();
