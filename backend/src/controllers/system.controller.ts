import { Request, Response } from 'express';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { environment } from '../../config/environment';

export const SystemController = {
  backup: async (req: Request, res: Response) => {
    try {
      // Create a filename with timestamp
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${dateStr}.sql`;
      const backupPath = path.join(__dirname, '../../', filename);

      // Extract DB details from databaseUrl
      // Format: postgresql://user:password@localhost:5432/dbname
      const dbUrl = environment.databaseUrl;
      
      // Execute pg_dump
      // We assume pg_dump is available in the system PATH
      execFile('pg_dump', [dbUrl, '-f', backupPath], (error, stdout, stderr) => {
        if (error) {
          console.error(`Backup error: ${error.message}`);
          return res.status(500).json({ message: 'Error generating backup.' });
        }

        // Send the file to the client
        res.download(backupPath, filename, (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          // Delete the file after sending it
          fs.unlink(backupPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting backup file:', unlinkErr);
          });
        });
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ message: 'Internal server error during backup.' });
    }
  }
};
