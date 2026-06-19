import { Model, DataTypes, Sequelize } from 'sequelize';

export class HistoricoNotaCertificada extends Model {
  declare id_historico: number;
  declare id_estudiante: number;
  declare id_grado: number;
  declare id_asignatura: number;
  declare id_periodo: number;
  declare id_escala: number;
  declare institucion_origen: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    HistoricoNotaCertificada.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante', as: 'estudiante' });
    HistoricoNotaCertificada.belongsTo(models.GradoAno, { foreignKey: 'id_grado', as: 'grado' });
    HistoricoNotaCertificada.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    HistoricoNotaCertificada.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
    HistoricoNotaCertificada.belongsTo(models.EscalaCalificacion, { foreignKey: 'id_escala', as: 'escala' });
  }
}

export function initHistoricoNotaCertificada(sequelize: Sequelize): typeof HistoricoNotaCertificada {
  HistoricoNotaCertificada.init(
    {
      id_historico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'estudiantes',
          key: 'id_estudiante',
        },
      },
      id_grado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'grados_anos',
          key: 'id_grado',
        },
      },
      id_asignatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asignaturas',
          key: 'id_asignatura',
        },
      },
      id_periodo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'periodos_escolares',
          key: 'id_periodo',
        },
      },
      id_escala: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'escala_calificaciones',
          key: 'id_escala',
        },
      },
      institucion_origen: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'L.N. Estilita Orozco',
      },
    },
    {
      sequelize,
      tableName: 'historico_notas_certificadas',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return HistoricoNotaCertificada;
}
