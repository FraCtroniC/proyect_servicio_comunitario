import { Model, DataTypes, Sequelize } from 'sequelize';

export class GradoAno extends Model {
  declare id_grado: number;
  declare numero: number;
  declare nombre: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    GradoAno.hasMany(models.Seccion, { foreignKey: 'id_grado', as: 'secciones' });
    GradoAno.hasMany(models.PlanEstudio, { foreignKey: 'id_grado', as: 'planes' });
    GradoAno.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_grado', as: 'historicos' });
  }
}

export function initGradoAno(sequelize: Sequelize): typeof GradoAno {
  GradoAno.init(
    {
      id_grado: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'grados_anos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return GradoAno;
}
