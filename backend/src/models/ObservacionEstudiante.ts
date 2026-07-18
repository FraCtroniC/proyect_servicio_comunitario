import { Model, DataTypes, Sequelize } from 'sequelize';

export class ObservacionEstudiante extends Model {
  declare id_observacion: number;
  declare texto: string;
  declare gravedad: string | null;
  declare id_usuario_crea: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    ObservacionEstudiante.belongsTo(models.Usuario, { foreignKey: 'id_usuario_crea', as: 'usuarioCrea' });
  }
}

export function initObservacionEstudiante(sequelize: Sequelize): typeof ObservacionEstudiante {
  ObservacionEstudiante.init(
    {
      id_observacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      gravedad: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      id_usuario_crea: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
    },
    {
      sequelize,
      tableName: 'observaciones_estudiante',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return ObservacionEstudiante;
}
