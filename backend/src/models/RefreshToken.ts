import { Model, DataTypes, Sequelize } from 'sequelize';

export class RefreshToken extends Model {
  declare id: number;
  declare id_usuario: number;
  declare token_hash: string;
  declare expires_at: Date;
  declare created_at: Date;
  declare revoked_at: Date | null;
}

export function initRefreshToken(sequelize: Sequelize): typeof RefreshToken {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
      },
      token_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'refresh_tokens',
      timestamps: false,
    }
  );
  return RefreshToken;
}
