import { Model, DataTypes, Sequelize } from 'sequelize';

export class AsistenciaEstudiante extends Model {
  declare id_asistencia_est: number;
  declare id_matricula: number;
  declare fecha: string;
  declare estatus: string | null;
  declare observacion: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    AsistenciaEstudiante.belongsTo(models.Matricula, { foreignKey: 'id_matricula', as: 'matricula' });
  }
}

export function initAsistenciaEstudiante(sequelize: Sequelize): typeof AsistenciaEstudiante {
  AsistenciaEstudiante.init(
    {
      id_asistencia_est: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_matricula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'matricula',
          key: 'id_matricula',
        },
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      estatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Presente, Ausente, Justificado',
      },
      observacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'asistencia_estudiante',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return AsistenciaEstudiante;
}
