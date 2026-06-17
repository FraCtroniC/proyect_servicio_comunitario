import { Model, DataTypes, Sequelize } from 'sequelize';

export class Rol extends Model {
  public id_rol!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

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
