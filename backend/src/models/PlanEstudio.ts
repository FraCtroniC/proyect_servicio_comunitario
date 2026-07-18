import { Model, DataTypes, Sequelize } from 'sequelize';

export class PlanEstudio extends Model {
  declare id_plan: number;
  declare id_grado: number;
  declare id_asignatura: number;
  declare id_tipo_plan: number;
  declare codigo_asignatura: string | null;
  declare posicion: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    PlanEstudio.belongsTo(models.GradoAno, { foreignKey: 'id_grado', as: 'grado' });
    PlanEstudio.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
    PlanEstudio.belongsTo(models.TipoPlanEstudio, { foreignKey: 'id_tipo_plan', as: 'tipo_plan' });
    PlanEstudio.hasMany(models.Calificacion, { foreignKey: 'id_plan', as: 'calificaciones' });
  }
}

export function initPlanEstudio(sequelize: Sequelize): typeof PlanEstudio {
  PlanEstudio.init(
    {
      id_plan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      id_tipo_plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_plan_estudio',
          key: 'id_tipo_plan',
        },
      },
      codigo_asignatura: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      posicion: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'plan_estudio',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return PlanEstudio;
}
