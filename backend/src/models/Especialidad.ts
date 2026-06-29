import { Model, DataTypes, Sequelize } from 'sequelize';

export class Especialidad extends Model {
  declare id_especialidad: number;
  declare nombre: string;
  declare estatus: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Especialidad.hasMany(models.Docente, { foreignKey: 'id_especialidad', as: 'docentes' });
  }
}

export function initEspecialidad(sequelize: Sequelize): typeof Especialidad {
  Especialidad.init(
    {
      id_especialidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      estatus: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: 'Activa'
      },
    },
    {
      sequelize,
      tableName: 'especialidades',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Especialidad;
}
