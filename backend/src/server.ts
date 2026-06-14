import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port}`);
});
