import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // 1. Create tipo_plan_estudio table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS tipo_plan_estudio (
        id_tipo_plan SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        resolucion VARCHAR(100),
        estatus VARCHAR(20) DEFAULT 'Activo' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table tipo_plan_estudio created or exists.');

    // 2. Insert plans if they don't exist
    const plans: any[] = await sequelize.query('SELECT * FROM tipo_plan_estudio', { type: QueryTypes.SELECT });
    
    let plan32011Id = plans.find(p => p.nombre.includes('32011'))?.id_tipo_plan;
    if (!plan32011Id) {
      const res = await sequelize.query(`
        INSERT INTO tipo_plan_estudio (nombre, resolucion) 
        VALUES ('Plan Oficial 32011', 'Gaceta Oficial 32011') RETURNING id_tipo_plan
      `, { type: QueryTypes.INSERT });
      plan32011Id = (res[0] as any)[0]?.id_tipo_plan || (res[0] as any).id_tipo_plan || 1;
      console.log('Inserted Plan 32011:', plan32011Id);
    }

    let plan31059Id = plans.find(p => p.nombre.includes('31059'))?.id_tipo_plan;
    if (!plan31059Id) {
      const res = await sequelize.query(`
        INSERT INTO tipo_plan_estudio (nombre, resolucion) 
        VALUES ('Plan Oficial 31059', 'Gaceta Oficial 31059') RETURNING id_tipo_plan
      `, { type: QueryTypes.INSERT });
      plan31059Id = (res[0] as any)[0]?.id_tipo_plan || (res[0] as any).id_tipo_plan || 2;
      console.log('Inserted Plan 31059:', plan31059Id);
    }

    // 3. Add id_tipo_plan to plan_estudio if it doesn't exist
    const columns: any[] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='plan_estudio' AND column_name='id_tipo_plan'
    `, { type: QueryTypes.SELECT });

    if (columns.length === 0) {
      await sequelize.query(`ALTER TABLE plan_estudio ADD COLUMN id_tipo_plan INTEGER`);
      console.log('Added id_tipo_plan to plan_estudio.');

      // Update existing rows to Plan 32011
      await sequelize.query(`UPDATE plan_estudio SET id_tipo_plan = ${plan32011Id}`);
      console.log('Migrated existing plan_estudio rows to Plan 32011.');

      // Add constraint and make not null
      await sequelize.query(`
        ALTER TABLE plan_estudio 
        ALTER COLUMN id_tipo_plan SET NOT NULL,
        ADD CONSTRAINT fk_plan_estudio_tipo 
        FOREIGN KEY (id_tipo_plan) REFERENCES tipo_plan_estudio(id_tipo_plan)
      `);
      console.log('Added NOT NULL and FOREIGN KEY constraint to plan_estudio.id_tipo_plan.');
    } else {
      console.log('Column id_tipo_plan already exists in plan_estudio.');
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
