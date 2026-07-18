import { redisClient } from '../shared/utils/redisClient';

async function flushCache() {
  if (redisClient) {
    console.log('Borrando cache de planes de estudio...');
    const keys = await redisClient.keys('cache:plan-estudio:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`Borradas ${keys.length} claves de cache`);
    } else {
      console.log('No había cache para borrar');
    }
    // Para asegurarnos borramos todo por si acaso
    await redisClient.flushdb();
    console.log('Cache Redis limpiado por completo.');
    process.exit(0);
  } else {
    console.log('Redis no configurado');
    process.exit(1);
  }
}

flushCache();
