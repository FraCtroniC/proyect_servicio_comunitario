import app from './app';
import { environment } from '../config/environment';
import { sequelize } from './models';

async function main() {
  try {
    console.log('Conectando a la base de datos con Sequelize...');
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL (Sequelize) establecida correctamente.');

    // Sincronizar modelos en desarrollo si es necesario (sin alterar datos existentes por ahora)
    // await sequelize.sync();
  } catch (err) {
    console.error('Error al conectar con PostgreSQL mediante Sequelize:', err);
    process.exit(1);
  }

  app.listen(environment.port, () => {
    console.log(`Servidor corriendo en puerto ${environment.port}`);
    console.log(`Entorno: ${environment.nodeEnv}`);
  });
}

const gracefulShutdown = async () => {
  try {
    console.log('Cerrando conexión de Sequelize...');
    await sequelize.close();
    console.log('Conexión de Sequelize cerrada correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar la conexión de Sequelize:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

main();
