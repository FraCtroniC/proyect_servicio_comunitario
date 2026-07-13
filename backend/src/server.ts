import { createServer } from 'http';
import app from './app';
import { environment } from '../config/environment';
import { sequelize } from './models';
import { connectRedis, closeRedis } from '../config/redis';
import { initSocket } from './socket';

async function main() {
  try {
    console.log('Conectando a la base de datos con Sequelize...');
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    if (environment.redisUrl) {
      try {
        await connectRedis();
        console.log('Conexión a Redis establecida correctamente.');
      } catch (err) {
        console.warn('No se pudo conectar a Redis. La caché y rate limiting continuarán sin Redis:', (err as Error).message);
      }
    } else {
      console.log('REDIS_URL no configurada. La caché y rate limiting no estarán disponibles.');
    }
  } catch (err) {
    console.error('Error al conectar con PostgreSQL mediante Sequelize:', err);
    process.exit(1);
  }

  const httpServer = createServer(app);
  initSocket(httpServer);

  httpServer.listen(environment.port, () => {
    console.log(`Servidor corriendo en puerto ${environment.port}`);
    console.log(`Entorno: ${environment.nodeEnv}`);

    import('./services/backup.service').then(({ BackupService }) => {
      BackupService.iniciarCronJob();
    }).catch(err => {
      console.error('Error inicializando cron job de respaldos:', err);
    });
  });
}

const gracefulShutdown = async () => {
  try {
    console.log('Cerrando conexión de Sequelize...');
    await sequelize.close();
    console.log('Conexión de Sequelize cerrada correctamente.');

    await closeRedis();
    console.log('Conexión de Redis cerrada correctamente.');

    process.exit(0);
  } catch (err) {
    console.error('Error durante el apagado:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

main();
