import { Model, DataTypes, Sequelize } from 'sequelize';

export class PeriodoEscolar extends Model {
  declare id_periodo: number;
  declare nombre: string;
  declare estatus: string;
  declare fecha_inicio: Date | null;
  declare fecha_fin: Date | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    PeriodoEscolar.hasMany(models.Matricula, { foreignKey: 'id_periodo', as: 'matriculas' });
    PeriodoEscolar.hasMany(models.Momento, { foreignKey: 'id_periodo', as: 'momentos' });
    PeriodoEscolar.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_periodo', as: 'historicos' });
    PeriodoEscolar.hasMany(models.HorarioDocente, { foreignKey: 'id_periodo', as: 'horarios' });
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
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
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
