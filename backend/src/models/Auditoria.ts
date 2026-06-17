import { Model, DataTypes, Sequelize } from 'sequelize';

export class Auditoria extends Model {
  public id_auditoria!: number;
  public id_usuario!: number | null;
  public accion!: string;
  public tabla_afectada!: string;
  public registro_id!: number | null;
  public valores_antiguos!: any | null;
  public valores_nuevos!: any | null;
  public ip_direccion!: string | null;
  public readonly fecha_hora!: Date;

  static associate(models: any) {
    Auditoria.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  }
}

export function initAuditoria(sequelize: Sequelize): typeof Auditoria {
  Auditoria.init(
    {
      id_auditoria: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      accion: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tabla_afectada: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      registro_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      valores_antiguos: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      valores_nuevos: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ip_direccion: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'auditoria',
      timestamps: true,
      createdAt: 'fecha_hora',
      updatedAt: false,
    }
  );
  return Auditoria;
}
