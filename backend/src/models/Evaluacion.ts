import { Model, DataTypes, Sequelize } from 'sequelize';

export class Evaluacion extends Model {
  declare id_evaluacion: number;
  declare id_plan: number;
  declare id_seccion: number;
  declare id_momento: number;
  declare descripcion: string;
  declare ponderacion: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Evaluacion.belongsTo(models.PlanEstudio, { foreignKey: 'id_plan', as: 'plan' });
    Evaluacion.belongsTo(models.Seccion, { foreignKey: 'id_seccion', as: 'seccion' });
    Evaluacion.belongsTo(models.Momento, { foreignKey: 'id_momento', as: 'momento' });
    Evaluacion.hasMany(models.NotaParcial, { foreignKey: 'id_evaluacion', as: 'notas' });
  }
}

export function initEvaluacion(sequelize: Sequelize): typeof Evaluacion {
  Evaluacion.init(
    {
      id_evaluacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plan_estudio',
          key: 'id_plan',
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
      id_momento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'momentos',
          key: 'id_momento',
        },
      },
      descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      ponderacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        },
      },
    },
    {
      sequelize,
      tableName: 'evaluaciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Evaluacion;
}
