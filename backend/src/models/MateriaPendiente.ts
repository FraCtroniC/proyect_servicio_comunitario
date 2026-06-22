import { Model, DataTypes, Sequelize } from 'sequelize';

export class MateriaPendiente extends Model {
  declare id_materia_pendiente: number;
  declare id_estudiante: number;
  declare id_asignatura: number;
  declare id_periodo: number;
  declare id_docente_evaluador: number | null;
  declare nota_definitiva: number | null;
  declare estatus: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    MateriaPendiente.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante', as: 'estudiante' });
    MateriaPendiente.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    MateriaPendiente.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
    MateriaPendiente.belongsTo(models.Docente, { foreignKey: 'id_docente_evaluador', as: 'docente_evaluador' });
  }
}

export function initMateriaPendiente(sequelize: Sequelize): typeof MateriaPendiente {
  MateriaPendiente.init(
    {
      id_materia_pendiente: {
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
      id_docente_evaluador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'docentes',
          key: 'id_docente',
        },
      },
      nota_definitiva: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'Cursando',
        comment: 'Cursando, Aprobada, Aplazada',
      },
    },
    {
      sequelize,
      tableName: 'materia_pendiente',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return MateriaPendiente;
}
