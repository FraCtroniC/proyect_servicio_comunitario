import { Model, DataTypes, Sequelize } from 'sequelize';

export class FormatoSabana extends Model {
  declare id_formato: number;
  declare nombre_formato: string;
  declare configuracion: any;
  declare imagen_referencia: string | null;
  declare es_activo: boolean;
  declare creado_por: number | null;
  declare readonly fecha_creacion: Date;
  declare readonly fecha_modificacion: Date;

  static associate(models: any) {
    FormatoSabana.belongsTo(models.Usuario, { foreignKey: 'creado_por', as: 'creador' });
  }
}

export function initFormatoSabana(sequelize: Sequelize): typeof FormatoSabana {
  FormatoSabana.init(
    {
      id_formato: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre_formato: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      configuracion: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          margenes: { top: 20, bottom: 20, left: 15, right: 15 },
          orientacion: 'portrait',
          secciones: {
            header: { altura: 120, elementos: [] },
            body: { altura: 'auto', elementos: [] },
            footer: { altura: 80, elementos: [] },
          },
        },
      },
      imagen_referencia: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      es_activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creado_por: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fecha_modificacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'formatos_sabana',
      timestamps: true,
      createdAt: 'fecha_creacion',
      updatedAt: 'fecha_modificacion',
    }
  );
  return FormatoSabana;
}
