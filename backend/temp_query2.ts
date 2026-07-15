import { Op } from 'sequelize';
import { Usuario } from './src/models';

async function run() {
  try {
    const usernameKey = 'josdanielcch@gmail.com';
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { username: usernameKey },
          { correo: usernameKey }
        ]
      }
    });
    console.log("Usuario encontrado:", usuario ? usuario.username : "NO");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
