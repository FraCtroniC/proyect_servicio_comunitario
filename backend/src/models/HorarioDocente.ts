import { Model, DataTypes, Sequelize } from 'sequelize';

export class HorarioDocente extends Model {
  declare id_horario: number;
  declare id_docente: number;
  declare id_asignatura: number;
  declare id_seccion: number;
  declare id_dia: number;
  declare id_bloque: number;
  declare id_aula: number;
  declare id_periodo: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    HorarioDocente.belongsTo(models.Docente, { foreignKey: 'id_docente', as: 'docente' });
    HorarioDocente.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    HorarioDocente.belongsTo(models.Seccion, { foreignKey: 'id_seccion', as: 'seccion' });
    HorarioDocente.belongsTo(models.DiaSemana, { foreignKey: 'id_dia', as: 'dia' });
    HorarioDocente.belongsTo(models.BloqueHorario, { foreignKey: 'id_bloque', as: 'bloque' });
    HorarioDocente.belongsTo(models.Aula, { foreignKey: 'id_aula', as: 'aula' });
    HorarioDocente.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
  }
}

export function initHorarioDocente(sequelize: Sequelize): typeof HorarioDocente {
  HorarioDocente.init(
    {
      id_horario: {
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
      id_asignatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asignaturas',
          key: 'id_asignatura',
        },
      },
      id_seccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'secciones',
          key: 'id_seccion',
        },
      },
      id_dia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'dias_semana',
          key: 'id_dia',
        },
      },
      id_bloque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'bloques_horarios',
          key: 'id_bloque',
        },
      },
      id_aula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'aulas',
          key: 'id_aula',
        },
      },
      id_periodo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'periodos_escolares',
          key: 'id_periodo',
        },
      },
    },
    {
      sequelize,
      tableName: 'horario_docente',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return HorarioDocente;
}
