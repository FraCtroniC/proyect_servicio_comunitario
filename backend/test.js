const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgresql://neondb_owner:npg_Z2rWfRlH8EGV@ep-late-tooth-at7fexxk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require');

const PeriodoEscolar = sequelize.define('PeriodoEscolar', {
  id_periodo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  estatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'periodos_escolares',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

async function test() {
  try {
    const result = await PeriodoEscolar.create({ nombre: '2026-2027', estatus: 'Planificación' });
    console.log('Success:', result.toJSON());
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await sequelize.close();
  }
}

test();
