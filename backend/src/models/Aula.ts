import { Model, DataTypes, Sequelize } from 'sequelize';

export class Aula extends Model {
  public id_aula!: number;
  public nombre_codigo!: string;
  public capacidad!: number | null;
  public tipo_espacio!: string | null;
  public ubicacion!: string | null;
  public estatus!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date | null;

  static associate(models: any) {
    Aula.hasMany(models.HorarioDocente, { foreignKey: 'id_aula', as: 'horarios' });
  }
}

export function initAula(sequelize: Sequelize): typeof Aula {
  Aula.init(
    {
      id_aula: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre_codigo: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tipo_espacio: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      estatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'aulas',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Aula;
}
