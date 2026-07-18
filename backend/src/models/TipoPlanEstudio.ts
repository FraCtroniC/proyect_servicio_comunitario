import { Model, DataTypes, Sequelize } from 'sequelize';

export class TipoPlanEstudio extends Model {
  declare id_tipo_plan: number;
  declare nombre: string;
  declare resolucion: string | null;
  declare estatus: 'Activo' | 'Inactivo';
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    TipoPlanEstudio.hasMany(models.PlanEstudio, { foreignKey: 'id_tipo_plan', as: 'materias' });
  }
}

export function initTipoPlanEstudio(sequelize: Sequelize): typeof TipoPlanEstudio {
  TipoPlanEstudio.init(
    {
      id_tipo_plan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      resolucion: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      estatus: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo',
      },
    },
    {
      sequelize,
      tableName: 'tipo_plan_estudio',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return TipoPlanEstudio;
}
