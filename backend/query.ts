import { Usuario } from './src/models/Usuario';
import { Docente } from './src/models/Docente';
import { HorarioDocente } from './src/models/HorarioDocente';

async function main() {
  const users = await Usuario.findAll({ include: [{ model: Docente, as: 'docente' }] });
  console.log('Users:');
  users.forEach(u => console.log(`User ID: ${u.id_usuario}, Username: ${u.username}, idDocente: ${u.id_docente}`));
  
  const danielaUser = users.find(u => u.username.includes('Daniela') || (u.docente && (u.docente.nombres.includes('Daniela'))));
  if (danielaUser) {
    const horarios = await HorarioDocente.findAll({ where: { id_docente: danielaUser.id_docente } });
    console.log('Horarios for Daniela:', horarios.length);
  } else {
    console.log('Daniela user not found in DB.');
  }
}
main().catch(console.error).then(() => process.exit(0));
