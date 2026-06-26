import { Model, DataTypes, Sequelize } from 'sequelize';

export class AsistenciaEstudiante extends Model {
  declare id_asistencia_est: number;
  declare id_matricula: number;
  declare fecha: string;
  declare estatus: string | null;
  declare observacion: string | null;
  declare id_usuario_crea: number | null;
  declare id_usuario_modifica: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    AsistenciaEstudiante.belongsTo(models.Matricula, { foreignKey: 'id_matricula', as: 'matricula' });
    AsistenciaEstudiante.belongsTo(models.Usuario, { foreignKey: 'id_usuario_crea', as: 'usuarioCrea' });
    AsistenciaEstudiante.belongsTo(models.Usuario, { foreignKey: 'id_usuario_modifica', as: 'usuarioModifica' });
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
    },
    {
      sequelize,
      tableName: 'asistencia_estudiante',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['id_matricula', 'fecha']
        }
      ]
    }
  );
  return AsistenciaEstudiante;
}
