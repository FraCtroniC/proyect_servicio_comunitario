const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgresql://neondb_owner:npg_Z2rWfRlH8EGV@ep-late-tooth-at7fexxk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require');

const Rol = sequelize.define('Rol', {
  id_rol: { type: DataTypes.INTEGER, primaryKey: true },
  nombre: DataTypes.STRING,
}, { tableName: 'roles', timestamps: false });

async function run() {
  const roles = await Rol.findAll();
  console.log(roles.map(r => r.toJSON()));
  process.exit(0);
}
run();
