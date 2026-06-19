import { Model, DataTypes, Sequelize } from 'sequelize';

export class Estudiante extends Model {
  declare id_estudiante: number;
  declare cedula_escolar: string;
  declare nombre1: string;
  declare nombre2: string | null;
  declare apellido1: string;
  declare apellido2: string | null;
  declare fecha_nac: Date;
  declare lugar_nac: string | null;
  declare municipio: string | null;
  declare estado: string | null;
  declare genero: string | null;
  declare id_representante: number;
  declare estatus_estudiante: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
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
      cedula_escolar: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      nombre1: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nombre2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      apellido1: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      apellido2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      fecha_nac: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      genero: {
        type: DataTypes.CHAR(1),
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
