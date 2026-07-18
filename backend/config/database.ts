import { Options } from 'sequelize';

function createPoolConfig(max: number, min: number): Options['pool'] {
  return {
    max,
    min,
    acquire: 30000,
    idle: 10000,
    validate: (connection: any) => {
      try {
        return connection.query('SELECT 1') !== null;
      } catch {
        return false;
      }
    },
  };
}

export const databaseConfig: Record<string, Options> = {
  development: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Requerido para conectar con Neon DB localmente sin certificados locales
      },
    },
    pool: createPoolConfig(10, 2),
    logging: false,
  },
  test: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: createPoolConfig(10, 2),
    logging: false,
  },
  production: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      },
    },
    pool: createPoolConfig(20, 5),
    logging: false,
  },
};
