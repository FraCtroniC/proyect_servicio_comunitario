import { Model, DataTypes, Sequelize } from 'sequelize';

export class Docente extends Model {
  declare id_docente: number;
  declare id_persona: number | null;
  declare id_especialidad: number | null;
  declare token_qr: string | null;
  declare estatus: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;
  declare persona?: any;

  static associate(models: any) {
    Docente.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
    Docente.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad_rel' });
    Docente.hasMany(models.AsistenciaEstudiante, { foreignKey: 'id_docente_toma', as: 'asistenciasTomadas' });
  }
}

export function initDocente(sequelize: Sequelize): typeof Docente {
  Docente.init(
    {
      id_docente: {
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
      id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      token_qr: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      estatus: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'docentes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Docente;
}
