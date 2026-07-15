import { Model, DataTypes, Sequelize } from 'sequelize';

export class AsistenciaDocente extends Model {
  declare id_asistencia: number;
  declare id_docente: number;
  declare fecha: string;
  declare hora_entrada: string | null;
  declare hora_salida: string | null;
  declare estatus: string | null;
  declare id_horario: number | null;
  declare id_asignatura: number | null;
  declare id_usuario_crea: number | null;
  declare id_usuario_modifica: number | null;
  declare fecha_anulacion: Date | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    AsistenciaDocente.belongsTo(models.Docente, { foreignKey: 'id_docente', as: 'docente' });
    AsistenciaDocente.belongsTo(models.HorarioDocente, { foreignKey: 'id_horario', as: 'horario' });
    AsistenciaDocente.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    AsistenciaDocente.hasMany(models.Justificacion, { foreignKey: 'id_asistencia', as: 'justificaciones' });
    AsistenciaDocente.belongsTo(models.Usuario, { foreignKey: 'id_usuario_crea', as: 'usuarioCrea' });
    AsistenciaDocente.belongsTo(models.Usuario, { foreignKey: 'id_usuario_modifica', as: 'usuarioModifica' });
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
      id_horario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'horario_docente',
          key: 'id_horario',
        },
      },
      id_asignatura: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'asignaturas',
          key: 'id_asignatura',
        },
      },
      id_usuario_crea: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      id_usuario_modifica: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      fecha_anulacion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'asistencia_docente',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['id_docente', 'fecha', 'id_horario']
        }
      ]
    }
  );
  return AsistenciaDocente;
}
