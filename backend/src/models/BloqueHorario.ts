import { Model, DataTypes, Sequelize } from 'sequelize';

export class BloqueHorario extends Model {
  declare id_bloque: number;
  declare hora_inicio: string;
  declare hora_fin: string;
  declare tipo_bloque: string | null;
  declare numero_bloque: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

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
