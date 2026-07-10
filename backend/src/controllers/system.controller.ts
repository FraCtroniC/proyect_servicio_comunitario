import { Request, Response } from 'express';
import { BackupService } from '../services/backup.service';
import path from 'path';

export const SystemController = {
  backup: async (req: Request, res: Response) => {
    try {
      // Use the BackupService to generate the backup
      const filename = await BackupService.generarRespaldo();
      const backupPath = path.join(__dirname, '../../backups', filename);

      // Send the file to the client
      res.download(backupPath, filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
        }
        // Notice we DO NOT delete the file here anymore
        // The BackupService retention policy (limpiarRespaldosAntiguos) will handle cleanup
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ message: 'Internal server error during backup.' });
    }
  }
};
