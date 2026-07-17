import { Model, DataTypes, Sequelize } from 'sequelize';

export class Usuario extends Model {
  declare id_usuario: number;
  declare id_rol: number;
  declare id_docente: number | null;
  declare id_persona: number | null;
  declare username: string;
  declare password_hash: string;
  declare estatus: string | null;
  declare failed_attempts: number;
  declare locked_until: Date | null;
  declare token_version: number;
  declare ultimo_acceso: Date | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;
  declare rol?: any;
  declare persona?: any;

  static associate(models: any) {
    Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    Usuario.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
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
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'personas',
          key: 'id_persona',
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
      failed_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      locked_until: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      token_version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
