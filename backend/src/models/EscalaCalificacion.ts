import { Model, DataTypes, Sequelize } from 'sequelize';

export class EscalaCalificacion extends Model {
  public id_escala!: number;
  public nota_impresa!: string;
  public nota_literal!: string;
  public nota_calculo!: number | null;
  public ponderacion_letra!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

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
