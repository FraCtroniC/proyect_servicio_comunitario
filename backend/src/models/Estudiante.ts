import { Model, DataTypes, Sequelize } from 'sequelize';

export class Estudiante extends Model {
  declare id_estudiante: number;
  declare id_persona: number | null;
  declare lugar_nac: string | null;
  declare municipio: string | null;
  declare estado: string | null;
  declare id_representante: number;
  declare estatus_estudiante: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;
  declare persona?: any;
  declare representante?: any;

  static associate(models: any) {
    Estudiante.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
    Estudiante.belongsTo(models.Representante, { foreignKey: 'id_representante', as: 'representante' });
    Estudiante.hasMany(models.Matricula, { foreignKey: 'id_estudiante', as: 'matriculas' });
    Estudiante.hasMany(models.HistoricoNotaCertificada, { foreignKey: 'id_estudiante', as: 'historicos' });
  }
}

export function initEstudiante(sequelize: Sequelize): typeof Estudiante {
  Estudiante.init(
    {
      id_estudiante: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'personas',
          key: 'id_persona',
        },
      },
      lugar_nac: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      municipio: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      id_representante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'representantes',
          key: 'id_representante',
        },
      },
      estatus_estudiante: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'estudiantes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Estudiante;
}
