import { Model, DataTypes, Sequelize } from 'sequelize';

export class Seccion extends Model {
  public id_seccion!: number;
  public id_grado!: number;
  public letra!: string;
  public id_docente_guia!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  public id_periodo!: number;

  static associate(models: any) {
    Seccion.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
    Seccion.belongsTo(models.GradoAno, { foreignKey: 'id_grado', as: 'grado' });
    Seccion.belongsTo(models.Docente, { foreignKey: 'id_docente_guia', as: 'docenteGuia' });
    Seccion.hasMany(models.Matricula, { foreignKey: 'id_seccion', as: 'matriculas' });
    Seccion.hasMany(models.HorarioDocente, { foreignKey: 'id_seccion', as: 'horarios' });
  }
}

export function initSeccion(sequelize: Sequelize): typeof Seccion {
  Seccion.init(
    {
      id_seccion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_periodo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'periodos_escolares',
          key: 'id_periodo',
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
      letra: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_docente_guia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'docentes',
          key: 'id_docente',
        },
      },
    },
    {
      sequelize,
      tableName: 'secciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Seccion;
}
