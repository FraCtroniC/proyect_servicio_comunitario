import { Model, DataTypes, Sequelize } from 'sequelize';

export class Representante extends Model {
  declare id_representante: number;
  declare cedula_rep: string | null;
  declare nombre1: string | null;
  declare nombre2: string | null;
  declare apellido1: string | null;
  declare apellido2: string | null;
  declare correo: string | null;
  declare telefono: string | null;
  declare direccion: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

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
        allowNull: true,
      },
      nombre1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nombre2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      apellido1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      apellido2: {
        type: DataTypes.STRING(50),
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
      direccion: {
        type: DataTypes.TEXT,
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
