import { Model, DataTypes, Sequelize } from 'sequelize';

export class BloqueHorario extends Model {
  public id_bloque!: number;
  public hora_inicio!: string;
  public hora_fin!: string;
  public tipo_bloque!: string | null;
  public numero_bloque!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    BloqueHorario.hasMany(models.HorarioDocente, { foreignKey: 'id_bloque', as: 'horarios' });
  }
}

export function initBloqueHorario(sequelize: Sequelize): typeof BloqueHorario {
  BloqueHorario.init(
    {
      id_bloque: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      tipo_bloque: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      numero_bloque: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'bloques_horarios',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return BloqueHorario;
}
