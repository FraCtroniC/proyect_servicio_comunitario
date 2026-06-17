import { Model, DataTypes, Sequelize } from 'sequelize';

export class Usuario extends Model {
  public id_usuario!: number;
  public id_rol!: number;
  public id_docente!: number | null;
  public username!: string;
  public password_hash!: string;
  public estatus!: string | null;
  public ultimo_acceso!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    Usuario.belongsTo(models.Docente, { foreignKey: 'id_docente', as: 'docente' });
  }
}

export function initUsuario(sequelize: Sequelize): typeof Usuario {
  Usuario.init(
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id_rol',
        },
      },
      id_docente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'docentes',
          key: 'id_docente',
        },
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      estatus: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: 'Activo',
      },
      ultimo_acceso: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'usuarios',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Usuario;
}
