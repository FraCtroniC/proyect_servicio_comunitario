import { Model, DataTypes, Sequelize } from 'sequelize';

export class EscalaCalificacion extends Model {
  declare id_escala: number;
  declare nota_impresa: string;
  declare nota_literal: string;
  declare nota_calculo: number | null;
  declare ponderacion_letra: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    EscalaCalificacion.hasMany(models.Calificacion, { foreignKey: 'id_escala', as: 'calificaciones' });
    EscalaCalificacion.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_escala', as: 'historicos' });
  }
}

export function initEscalaCalificacion(sequelize: Sequelize): typeof EscalaCalificacion {
  EscalaCalificacion.init(
    {
      id_escala: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nota_impresa: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      nota_literal: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nota_calculo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ponderacion_letra: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'escala_calificaciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return EscalaCalificacion;
}
