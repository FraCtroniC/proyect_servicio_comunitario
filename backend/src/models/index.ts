import { Sequelize } from 'sequelize';
import { databaseConfig } from '../../config/database';
import { environment } from '../../config/environment';
import { initRol, Rol } from './Rol';
import { initDocente, Docente } from './Docente';
import { initUsuario, Usuario } from './Usuario';

const env = environment.nodeEnv || 'development';
const config = databaseConfig[env];

if (!environment.databaseUrl) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno.');
}

const sequelize = new Sequelize(environment.databaseUrl, config);

// Inicializar modelos
initRol(sequelize);
initDocente(sequelize);
initUsuario(sequelize);

// Configurar asociaciones
const models = { Rol, Docente, Usuario };
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, Sequelize, Rol, Docente, Usuario };
