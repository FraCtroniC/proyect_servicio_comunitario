import { Model, DataTypes, Sequelize } from 'sequelize';

export class Estudiante extends Model {
  public id_estudiante!: number;
  public cedula_escolar!: string;
  public nombre1!: string;
  public nombre2!: string | null;
  public apellido1!: string;
  public apellido2!: string | null;
  public fecha_nac!: Date;
  public lugar_nac!: string | null;
  public municipio!: string | null;
  public estado!: string | null;
  public genero!: string | null;
  public id_representante!: number;
  public estatus_estudiante!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

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
