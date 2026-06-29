import { sequelize, Docente, Especialidad } from '../models';

async function migrateEspecialidades() {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();

    console.log('Sincronizando tabla de Especialidades y Docentes (alter)...');
    await Especialidad.sync({ alter: true });
    
    // We use a try-catch for Docente because changing string to int might fail if there's string data in there,
    // although postgres handles `alter` columns by trying to cast, which will fail for 'Matemáticas' -> int.
    // Actually! If 'especialidad' is currently a string, and we changed it to 'id_especialidad' (integer),
    // Sequelize alter will add `id_especialidad` (new column) because the name changed!
    // It might drop the old `especialidad` column depending on `alter` options.
    // Let's run a safe SQL query first before `.sync()` for Docente.
    
    console.log('Buscando especialidades únicas en docentes...');
    let rawDocentes: any[] = [];
    try {
      const [results] = await sequelize.query('SELECT id_docente, especialidad FROM docentes WHERE especialidad IS NOT NULL');
      rawDocentes = results;
    } catch (e) {
      console.log('La columna especialidad ya no existe o hubo un error al leerla.');
    }

    const uniqueSpecs = new Set<string>();
    for (const d of rawDocentes) {
      if (d.especialidad && d.especialidad.trim() !== '') {
        uniqueSpecs.add(d.especialidad.trim());
      }
    }

    const defaults = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Inglés', 'Deporte', 'Literatura'];
    for (const def of defaults) {
      uniqueSpecs.add(def);
    }

    console.log(`Encontradas ${uniqueSpecs.size} especialidades únicas. Creándolas...`);
    const specMap = new Map<string, number>();

    for (const specName of uniqueSpecs) {
      const [esp] = await Especialidad.findOrCreate({
        where: { nombre: specName },
        defaults: { nombre: specName, estatus: 'Activa' }
      });
      specMap.set(specName, esp.id_especialidad);
    }

    console.log('Sincronizando modelo Docente...');
    await Docente.sync({ alter: true });

    console.log('Actualizando docentes con su respectivo id_especialidad...');
    let updated = 0;
    for (const d of rawDocentes) {
      const specName = d.especialidad?.trim();
      if (specName && specMap.has(specName)) {
        const id_esp = specMap.get(specName);
        await sequelize.query('UPDATE docentes SET id_especialidad = $1 WHERE id_docente = $2', {
          bind: [id_esp, d.id_docente]
        });
        updated++;
      }
    }

    console.log(`Migración completada. ${updated} docentes actualizados.`);
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

migrateEspecialidades();
