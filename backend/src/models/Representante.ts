import { Model, DataTypes, Sequelize } from 'sequelize';

export class Representante extends Model {
  public id_representante!: number;
  public cedula_rep!: string;
  public nombre1!: string;
  public nombre2!: string | null;
  public apellido1!: string;
  public apellido2!: string | null;
  public telefono!: string | null;
  public direccion!: string | null;
  public correo!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Representante.hasMany(models.Estudiante, { foreignKey: 'id_representante', as: 'estudiantes' });
  }
}

export function initRepresentante(sequelize: Sequelize): typeof Representante {
  Representante.init(
    {
      id_representante: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cedula_rep: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      nombre1: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nombre2: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      apellido1: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      apellido2: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      direccion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'representantes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Representante;
}
