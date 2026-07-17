import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database';
import { environment } from '../config/environment';

async function runMigration011() {
  const config = databaseConfig[environment.nodeEnv || 'development'];

  if (!environment.databaseUrl) {
    console.error('DATABASE_URL no está definida.');
    process.exit(1);
  }

  const sequelize = new Sequelize(environment.databaseUrl, config);

  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a la BD establecida.');

    const filePath = path.join(__dirname, '..', 'migrations', '011_revert_supertipo_subtipo.sql');
    const sql = fs.readFileSync(filePath, 'utf8');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        if (s.length === 0) return false;
        const lines = s.split('\n').filter(l => l.trim().length > 0);
        const firstRealLine = lines.find(l => !l.trim().startsWith('--'));
        return firstRealLine != null;
      })
      .map(s => {
        const lines = s.split('\n').filter(l => !l.trim().startsWith('--'));
        return lines.join('\n').trim();
      })
      .filter(s => s.length > 0);

    console.log(`Ejecutando ${statements.length} statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 100).replace(/\n/g, ' ');
      try {
        await sequelize.query(stmt);
        console.log(`✓ [${i + 1}/${statements.length}] ${preview}...`);
      } catch (err: any) {
        console.error(`✗ [${i + 1}/${statements.length}] ${preview}`);
        console.error(`  ${err.message}`);
        console.error('ABORTANDO por error.');
        await sequelize.close();
        process.exit(1);
      }
    }

    await sequelize.close();
    console.log('\n✓ Migración 011 completada exitosamente.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

runMigration011();
