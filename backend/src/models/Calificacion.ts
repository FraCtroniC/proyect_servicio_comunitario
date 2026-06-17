import { Model, DataTypes, Sequelize } from 'sequelize';

export class Calificacion extends Model {
  public id_calificacion!: number;
  public id_matricula!: number;
  public id_plan!: number;
  public id_momento!: number;
  public id_escala!: number;
  public inasistencias_asignatura!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Calificacion.belongsTo(models.Matricula, { foreignKey: 'id_matricula', as: 'matricula' });
    Calificacion.belongsTo(models.PlanEstudio, { foreignKey: 'id_plan', as: 'plan' });
    Calificacion.belongsTo(models.Momento, { foreignKey: 'id_momento', as: 'momento' });
    Calificacion.belongsTo(models.EscalaCalificacion, { foreignKey: 'id_escala', as: 'escala' });
  }
}

export function initCalificacion(sequelize: Sequelize): typeof Calificacion {
  Calificacion.init(
    {
      id_calificacion: {
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
      id_plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plan_estudio',
          key: 'id_plan',
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
      id_escala: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'escala_calificaciones',
          key: 'id_escala',
        },
      },
      inasistencias_asignatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'calificaciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Calificacion;
}
