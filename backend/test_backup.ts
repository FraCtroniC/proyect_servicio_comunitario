import { BackupService } from './src/services/backup.service';

async function test() {
  try {
    console.log('Starting backup...');
    let dbUrl = process.env.DATABASE_URL || '';
    dbUrl = dbUrl.replace('sslmode=verify-full', 'sslmode=require');
    process.env.DATABASE_URL = dbUrl;
    const filename = await BackupService.generarRespaldo();
    console.log('Backup generated:', filename);
  } catch (error) {
    console.error('Failed:', error);
  }
}

test();
