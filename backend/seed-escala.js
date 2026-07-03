const { Client } = require('pg');

async function seed() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_Z2rWfRlH8EGV@ep-late-tooth-at7fexxk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full'
  });
  
  await client.connect();
  
  try {
    for (let i = 1; i <= 20; i++) {
      let literal = '';
      if (i < 10) literal = 'Insuficiente';
      else if (i < 15) literal = 'Mínima';
      else literal = 'Sobresaliente';
      
      let letra = 'C';
      if (i >= 15) letra = 'A';
      else if (i >= 10) letra = 'B';
      else letra = 'C';

      const query = `
        INSERT INTO "escala_calificaciones" (id_escala, nota_impresa, nota_literal, nota_calculo, ponderacion_letra, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (id_escala) DO NOTHING;
      `;
      
      const values = [i, i.toString().padStart(2, '0'), literal, i, letra];
      await client.query(query, values);
    }
    console.log('Seeded Escala successfully');
  } catch (err) {
    console.error('Error seeding escala:', err);
  } finally {
    await client.end();
  }
}

seed();
