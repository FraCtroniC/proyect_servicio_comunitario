import { Model, DataTypes, Sequelize } from 'sequelize';

export class NotaParcial extends Model {
  declare id_nota: number;
  declare id_matricula: number;
  declare id_evaluacion: number;
  declare id_escala: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;

  static associate(models: any) {
    NotaParcial.belongsTo(models.Matricula, { foreignKey: 'id_matricula', as: 'matricula' });
    NotaParcial.belongsTo(models.Evaluacion, { foreignKey: 'id_evaluacion', as: 'evaluacion' });
    NotaParcial.belongsTo(models.EscalaCalificacion, { foreignKey: 'id_escala', as: 'escala' });
  }
}

export function initNotaParcial(sequelize: Sequelize): typeof NotaParcial {
  NotaParcial.init(
    {
      id_nota: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_matricula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'matricula',
          key: 'id_matricula',
        },
      },
      id_evaluacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'evaluaciones',
          key: 'id_evaluacion',
        },
      },
      id_escala: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'escala_calificaciones',
          key: 'id_escala',
        },
      },
    },
    {
      sequelize,
      tableName: 'notas_parciales',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['id_matricula', 'id_evaluacion'],
        },
      ],
    }
  );
  return NotaParcial;
}
