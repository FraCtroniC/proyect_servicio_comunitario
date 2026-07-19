import { Model, DataTypes, Sequelize } from 'sequelize';

export class Momento extends Model {
  declare id_momento: number;
  declare id_periodo: number;
  declare estatus: string;
  declare descripcion: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Momento.belongsTo(models.PeriodoEscolar, { foreignKey: 'id_periodo', as: 'periodo' });
    Momento.hasMany(models.Calificacion, { foreignKey: 'id_momento', as: 'calificaciones' });
  }
}

export function initMomento(sequelize: Sequelize): typeof Momento {
  Momento.init(
    {
      id_momento: {
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
      estatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Abierto',
      },
      descripcion: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'momentos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Momento;
}
