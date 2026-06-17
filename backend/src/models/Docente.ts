import { Model, DataTypes, Sequelize } from 'sequelize';

export class Docente extends Model {
  public id_docente!: number;
  public cedula_docente!: string;
  public nombre1!: string;
  public nombre2!: string | null;
  public apellido1!: string;
  public apellido2!: string | null;
  public especialidad!: string | null;
  public telefono!: string | null;
  public correo!: string | null;
  public token_qr!: string | null;
  public estatus!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Docente.hasMany(models.Usuario, { foreignKey: 'id_docente', as: 'usuarios' });
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
      cedula_docente: {
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
      especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(50),
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
