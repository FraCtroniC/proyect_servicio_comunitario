import { Model, DataTypes, Sequelize } from 'sequelize';

export class Representante extends Model {
  declare id_representante: number;
  declare id_persona: number | null;
  declare telefono: string | null;
  declare direccion: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;
  declare persona?: any;

  static associate(models: any) {
    Representante.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
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
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'personas',
          key: 'id_persona',
        },
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
