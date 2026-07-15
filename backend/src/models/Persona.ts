import { Model, DataTypes, Sequelize } from 'sequelize';

export class Persona extends Model {
  declare id_persona: number;
  declare cedula: string;
  declare nombre1: string;
  declare nombre2: string | null;
  declare apellido1: string;
  declare apellido2: string | null;
  declare fecha_nac: string | null;
  declare correo: string | null;
  declare telefono: string | null;
  declare genero: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    Persona.hasOne(models.Usuario, { foreignKey: 'id_persona', as: 'usuario' });
    Persona.hasOne(models.Docente, { foreignKey: 'id_persona', as: 'docente' });
    Persona.hasOne(models.Estudiante, { foreignKey: 'id_persona', as: 'estudiante' });
    Persona.hasOne(models.Representante, { foreignKey: 'id_persona', as: 'representante' });
  }
}

export function initPersona(sequelize: Sequelize): typeof Persona {
  Persona.init(
    {
      id_persona: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cedula: {
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
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      genero: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'personas',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Persona;
}
