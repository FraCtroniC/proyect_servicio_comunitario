import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  if (process.env.REDIS_URL) {
    console.log('Conectando a Redis...');
    const redis = new Redis(process.env.REDIS_URL);
    await redis.flushdb();
    console.log('Cache limpiado con éxito en Redis.');
    process.exit(0);
  } else {
    console.log('No REDIS_URL');
  }
}

run();
