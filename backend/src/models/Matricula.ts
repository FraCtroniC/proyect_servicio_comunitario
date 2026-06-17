import { Model, DataTypes, Sequelize } from 'sequelize';

export class Matricula extends Model {
  public id_matricula!: number;
  public id_estudiante!: number;
  public id_seccion!: number;
  public id_periodo!: number;
  public numero_lista!: number | null;
  public estatus_matricula!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Matricula.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante', as: 'estudiante' });
    Matricula.belongsTo(models.Seccion, { foreignKey: 'id_seccion', as: 'seccion' });
    Matricula.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
    Matricula.hasMany(models.Calificacion, { foreignKey: 'id_matricula', as: 'calificaciones' });
  }
}

export function initMatricula(sequelize: Sequelize): typeof Matricula {
  Matricula.init(
    {
      id_matricula: {
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
      id_seccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'secciones',
          key: 'id_seccion',
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
      numero_lista: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estatus_matricula: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'matricula',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Matricula;
}
