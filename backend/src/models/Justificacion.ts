import { Model, DataTypes, Sequelize } from 'sequelize';

export class Justificacion extends Model {
  public id_justificacion!: number;
  public id_asistencia!: number;
  public motivo!: string | null;
  public soporte_digital!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Justificacion.belongsTo(models.AsistenciaDocente, { foreignKey: 'id_asistencia', as: 'asistencia' });
  }
}

export function initJustificacion(sequelize: Sequelize): typeof Justificacion {
  Justificacion.init(
    {
      id_justificacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_asistencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asistencia_docente',
          key: 'id_asistencia',
        },
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
      tableName: 'justificaciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Justificacion;
}
