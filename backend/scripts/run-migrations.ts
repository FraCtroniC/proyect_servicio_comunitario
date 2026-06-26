import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database';
import { environment } from '../config/environment';

async function runMigrations() {
  const env = environment.nodeEnv || 'development';
  const config = databaseConfig[env];

  if (!environment.databaseUrl) {
    console.error('DATABASE_URL no está definida.');
    process.exit(1);
  }

  const sequelize = new Sequelize(environment.databaseUrl, config);

  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a la BD establecida.');

    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No hay migraciones pendientes.');
      await sequelize.close();
      return;
    }

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`▶ Ejecutando migración: ${file}`);

      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const stmt of statements) {
        try {
          await sequelize.query(stmt);
          console.log(`  ✓ ${stmt.substring(0, 80)}...`);
        } catch (err: any) {
          console.error(`  ✗ Error ejecutando: ${stmt.substring(0, 80)}`);
          console.error(`    ${err.message}`);
        }
      }

      console.log(`✓ Migración ${file} completada.`);
    }

    await sequelize.close();
    console.log('\n✓ Todas las migraciones ejecutadas correctamente.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

runMigrations();
