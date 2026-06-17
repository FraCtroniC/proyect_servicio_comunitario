import { Model, DataTypes, Sequelize } from 'sequelize';

export class PeriodoEscolar extends Model {
  public id_periodo!: number;
  public nombre!: string;
  public estatus!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    PeriodoEscolar.hasMany(models.Seccion, { foreignKey: 'id_periodo', as: 'secciones' });
    PeriodoEscolar.hasMany(models.Matricula, { foreignKey: 'id_periodo', as: 'matriculas' });
    PeriodoEscolar.hasMany(models.Momento, { foreignKey: 'id_periodo', as: 'momentos' });
    PeriodoEscolar.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_periodo', as: 'historicos' });
  }
}

export function initPeriodoEscolar(sequelize: Sequelize): typeof PeriodoEscolar {
  PeriodoEscolar.init(
    {
      id_periodo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      estatus: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'periodos_escolares',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return PeriodoEscolar;
}
