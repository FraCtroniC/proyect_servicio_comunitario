import { sequelize } from '../models';
import { EscalaCalificacion } from '../models/EscalaCalificacion';

async function seedEscala() {
  await sequelize.authenticate();
  
  for(let i = 1; i <= 20; i++) {
    let literal = '';
    if(i < 10) literal = 'Insuficiente';
    else if (i < 15) literal = 'Mínima';
    else literal = 'Sobresaliente';
    
    let letra = 'C';
    if(i >= 15) letra = 'A';
    else if(i >= 10) letra = 'B';
    else letra = 'C';

    await EscalaCalificacion.findOrCreate({
      where: { id_escala: i },
      defaults: {
        id_escala: i,
        nota_impresa: i.toString().padStart(2, '0'),
        nota_literal: literal,
        nota_calculo: i,
        ponderacion_letra: letra
      }
    });
  }
  
  console.log('Escala seeded successfully');
  process.exit(0);
}

seedEscala().catch(e => {
  console.error(e);
  process.exit(1);
});
