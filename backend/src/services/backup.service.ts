import cron from 'node-cron';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { environment } from '../../config/environment';

const BACKUP_DIR = path.join(__dirname, '../../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const BackupService = {
  /**
   * Generates a backup of the database
   * @returns Promise<string> Resolves with the filename of the created backup
   */
  generarRespaldo: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${dateStr}.sql`;
      const backupPath = path.join(BACKUP_DIR, filename);

      // Prevent pg_dump errors on Windows due to missing root certificates with verify-full
      const dbUrl = environment.databaseUrl.replace('sslmode=verify-full', 'sslmode=require');
      
      const pgDumpExecutable = process.env.PG_DUMP_PATH || 'pg_dump';

      console.log(`[BackupService] Iniciando respaldo de base de datos: ${filename}`);

      execFile(pgDumpExecutable, [dbUrl, '-f', backupPath], (error, stdout, stderr) => {
        if (error) {
          console.error(`[BackupService] Error al generar respaldo: ${error.message}`);
          return reject(error);
        }
        console.log(`[BackupService] Respaldo generado exitosamente: ${filename}`);
        resolve(filename);
      });
    });
  },

  /**
   * Deletes backup files older than specified days
   * @param daysToKeep Number of days to retain backups
   */
  limpiarRespaldosAntiguos: (daysToKeep: number = 15) => {
    console.log(`[BackupService] Limpiando respaldos mayores a ${daysToKeep} días...`);
    fs.readdir(BACKUP_DIR, (err, files) => {
      if (err) {
        console.error('[BackupService] Error al leer directorio de respaldos:', err);
        return;
      }

      const now = Date.now();
      const cutoffTime = now - daysToKeep * 24 * 60 * 60 * 1000;

      files.forEach((file) => {
        if (!file.endsWith('.sql')) return;

        const filePath = path.join(BACKUP_DIR, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) {
            console.error(`[BackupService] Error al leer estadísticas de ${file}:`, statErr);
            return;
          }

          if (stats.mtimeMs < cutoffTime) {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`[BackupService] Error al eliminar respaldo antiguo ${file}:`, unlinkErr);
              } else {
                console.log(`[BackupService] Respaldo antiguo eliminado: ${file}`);
              }
            });
          }
        });
      });
    });
  },

  /**
   * Initializes the cron job for daily backups and cleanup
   */
  iniciarCronJob: () => {
    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('[BackupService] Ejecutando tarea programada de respaldo diario...');
      try {
        await BackupService.generarRespaldo();
        BackupService.limpiarRespaldosAntiguos(15);
      } catch (error) {
        console.error('[BackupService] Tarea de respaldo diario falló:', error);
      }
    });
    console.log('[BackupService] Cron job de respaldos diarios inicializado (2:00 AM).');
  }
};
