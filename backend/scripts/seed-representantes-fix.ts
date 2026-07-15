import { sequelize } from '../src/models';

const nombres = ['Carlos', 'Maria', 'Jose', 'Ana', 'Luis', 'Diana', 'Pedro', 'Sofia', 'Miguel', 'Laura', 'Ramon', 'Elena', 'Victor', 'Carmen', 'Oscar', 'Patricia', 'Hector', 'Marta', 'Alberto', 'Rosa'];
const apellidos = ['Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Fernandez', 'Perez', 'Sanchez', 'Ramirez', 'Cruz', 'Morales', 'Ortiz', 'Torres', 'Diaz', 'Castillo', 'Flores', 'Rivera', 'Gomez', 'Reyes', 'Moreno'];

async function seed() {
  await sequelize.authenticate();

  const [reps]: any = await sequelize.query(`
    SELECT r.id_representante
    FROM representantes r
    WHERE r.id_persona IS NULL
    ORDER BY r.id_representante
  `);

  console.log(`Generando datos para ${reps.length} representantes...`);

  for (let i = 0; i < reps.length; i++) {
    const idx = i;
    const n1 = nombres[idx % nombres.length];
    const n2 = idx % 3 === 0 ? apellidos[(idx + 3) % apellidos.length] : null;
    const a1 = apellidos[idx % apellidos.length];
    const a2 = idx % 2 === 0 ? apellidos[(idx + 5) % apellidos.length] : null;
    const cedula = `V-${String(20000000 + reps[i].id_representante * 100 + Math.floor(Math.random() * 99)).padStart(8, '0')}`;

    await sequelize.query(`
      INSERT INTO personas (cedula, nombre1, nombre2, apellido1, apellido2, created_at, updated_at)
      VALUES (:cedula, :n1, :n2, :a1, :a2, NOW(), NOW())
      ON CONFLICT (cedula) DO NOTHING
    `, { replacements: { cedula, n1, n2, a1, a2 } });

    await sequelize.query(`
      UPDATE representantes r
      SET id_persona = (SELECT id_persona FROM personas WHERE cedula = :cedula)
      WHERE r.id_representante = :id AND r.id_persona IS NULL
    `, { replacements: { cedula, id: reps[i].id_representante } });

    const nombreCompleto = `${n1}${n2 ? ' ' + n2 : ''} ${a1}${a2 ? ' ' + a2 : ''}`;
    console.log(`  ${i + 1}. id_representante=${reps[i].id_representante} → ${nombreCompleto} (${cedula})`);
  }

  const [verificacion]: any = await sequelize.query(
    `SELECT COUNT(*) as count FROM representantes WHERE id_persona IS NULL`
  );
  console.log(`\n✅ Representantes sin persona: ${verificacion[0].count}`);

  if (verificacion[0].count === '0' || verificacion[0].count === 0) {
    console.log('🎉 Todos los representantes tienen persona ahora.');
  }

  await sequelize.close();
}

seed().catch(console.error);
