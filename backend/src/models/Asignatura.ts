import { Model, DataTypes, Sequelize } from 'sequelize';

export class Asignatura extends Model {
  declare id_asignatura: number;
  declare nombre: string;
  declare tipo_calificacion: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Asignatura.hasMany(models.PlanEstudio, { foreignKey: 'id_asignatura', as: 'planes' });
    Asignatura.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_asignatura', as: 'historicos' });
    Asignatura.hasMany(models.HorarioDocente, { foreignKey: 'id_asignatura', as: 'horarios' });
  }
}

export function initAsignatura(sequelize: Sequelize): typeof Asignatura {
  Asignatura.init(
    {
      id_asignatura: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      tipo_calificacion: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'asignaturas',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Asignatura;
}
