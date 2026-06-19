import { Model, DataTypes, Sequelize } from 'sequelize';

export class Docente extends Model {
  declare id_docente: number;
  declare cedula_docente: string;
  declare nombre1: string;
  declare nombre2: string | null;
  declare apellido1: string;
  declare apellido2: string | null;
  declare especialidad: string | null;
  declare telefono: string | null;
  declare correo: string | null;
  declare token_qr: string | null;
  declare estatus: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

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
