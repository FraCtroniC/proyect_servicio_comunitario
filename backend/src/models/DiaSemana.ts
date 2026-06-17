import { Model, DataTypes, Sequelize } from 'sequelize';

export class DiaSemana extends Model {
  public id_dia!: number;
  public nombre!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    DiaSemana.hasMany(models.HorarioDocente, { foreignKey: 'id_dia', as: 'horarios' });
  }
}

export function initDiaSemana(sequelize: Sequelize): typeof DiaSemana {
  DiaSemana.init(
    {
      id_dia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'dias_semana',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return DiaSemana;
}
