import { Model, DataTypes, Sequelize } from 'sequelize';

export class Rol extends Model {
  declare id_rol: number;
  declare nombre: string;
  declare descripcion: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Rol.hasMany(models.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
  }
}

export function initRol(sequelize: Sequelize): typeof Rol {
  Rol.init(
    {
      id_rol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Rol;
}
