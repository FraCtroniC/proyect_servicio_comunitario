import './src/models/index';
import { Usuario } from './src/models/Usuario';
import { Docente } from './src/models/Docente';
import { Op } from 'sequelize';

async function main() {
  const docentes = await Docente.findAll({
    where: {
      [Op.or]: [
        { nombre1: { [Op.like]: '%Daniela%' } },
        { apellido1: { [Op.like]: '%Chacon%' } }
      ]
    }
  });

  const d = docentes[0];
  if (d) {
    console.log('Encontrado Docente:', d.nombre1, d.apellido1, d.id_docente);
    const users = await Usuario.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: '%Daniela%' } },
          { username: { [Op.like]: '%Chacon%' } },
          { username: d.cedula_docente.replace(/^[VE]-/, '') },
          { username: d.cedula_docente }
        ]
      }
    });

    for (const u of users) {
      console.log('Actualizando Usuario:', u.username);
      u.id_docente = d.id_docente;
      await u.save();
    }
  }
}

main().catch(console.error).then(() => process.exit(0));
