import { Model, DataTypes, Sequelize } from 'sequelize';

export class HorarioDocente extends Model {
  public id_horario!: number;
  public id_docente!: number;
  public id_asignatura!: number;
  public id_seccion!: number;
  public id_dia!: number;
  public id_bloque!: number;
  public id_aula!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    HorarioDocente.belongsTo(models.Docente, { foreignKey: 'id_docente', as: 'docente' });
    HorarioDocente.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    HorarioDocente.belongsTo(models.Seccion, { foreignKey: 'id_seccion', as: 'seccion' });
    HorarioDocente.belongsTo(models.DiaSemana, { foreignKey: 'id_dia', as: 'dia' });
    HorarioDocente.belongsTo(models.BloqueHorario, { foreignKey: 'id_bloque', as: 'bloque' });
    HorarioDocente.belongsTo(models.Aula, { foreignKey: 'id_aula', as: 'aula' });
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
