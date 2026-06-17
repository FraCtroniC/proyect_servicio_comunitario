import { Model, DataTypes, Sequelize } from 'sequelize';

export class PlanEstudio extends Model {
  public id_plan!: number;
  public id_grado!: number;
  public id_asignatura!: number;
  public codigo_asignatura!: string | null;
  public posicion!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    PlanEstudio.belongsTo(models.GradoAno, { foreignKey: 'id_grado', as: 'grado' });
    PlanEstudio.belongsTo(models.Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });
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
