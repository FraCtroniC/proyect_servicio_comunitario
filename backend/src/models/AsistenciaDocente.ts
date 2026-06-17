import { Model, DataTypes, Sequelize } from 'sequelize';

export class AsistenciaDocente extends Model {
  public id_asistencia!: number;
  public id_docente!: number;
  public fecha!: string;
  public hora_entrada!: string | null;
  public hora_salida!: string | null;
  public estatus!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    AsistenciaDocente.belongsTo(models.Docente, { foreignKey: 'id_docente', as: 'docente' });
    AsistenciaDocente.hasMany(models.Justificacion, { foreignKey: 'id_asistencia', as: 'justificaciones' });
  }
}

export function initAsistenciaDocente(sequelize: Sequelize): typeof AsistenciaDocente {
  AsistenciaDocente.init(
    {
      id_asistencia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_docente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'docentes',
          key: 'id_docente',
        },
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora_entrada: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      hora_salida: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      estatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'asistencia_docente',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return AsistenciaDocente;
}
