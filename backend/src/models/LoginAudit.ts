import { Model, DataTypes, Sequelize } from 'sequelize';

export class LoginAudit extends Model {
  declare id: number;
  declare username: string;
  declare ip_address: string;
  declare user_agent: string | null;
  declare success: boolean;
  declare readonly created_at: Date;
}

export function initLoginAudit(sequelize: Sequelize): typeof LoginAudit {
  LoginAudit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'login_audit',
      timestamps: false,
    }
  );
  return LoginAudit;
}
