import { Model, DataTypes, Sequelize } from 'sequelize';

export class JustificacionEstudiante extends Model {
  declare id_justificacion_est: number;
  declare id_asistencia_est: number;
  declare motivo: string | null;
  declare soporte_digital: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    JustificacionEstudiante.belongsTo(models.AsistenciaEstudiante, { foreignKey: 'id_asistencia_est', as: 'asistencia' });
  }
}

export function initJustificacionEstudiante(sequelize: Sequelize): typeof JustificacionEstudiante {
  JustificacionEstudiante.init(
    {
      id_justificacion_est: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_asistencia_est: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asistencia_estudiante',
          key: 'id_asistencia_est',
        },
        onDelete: 'CASCADE',
      },
      motivo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      soporte_digital: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'justificaciones_estudiante',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return JustificacionEstudiante;
}
