import { Model, DataTypes, Sequelize } from 'sequelize';

export class Usuario extends Model {
  declare id_usuario: number;
  declare id_rol: number;
  declare username: string;
  declare password_hash: string;
  declare estatus: string | null;
  declare failed_attempts: number;
  declare locked_until: Date | null;
  declare token_version: number;
  declare ultimo_acceso: Date | null;
  declare cedula: string | null;
  declare nombre1: string | null;
  declare nombre2: string | null;
  declare apellido1: string | null;
  declare apellido2: string | null;
  declare fecha_nac: string | null;
  declare correo: string | null;
  declare telefono: string | null;
  declare id_especialidad: number | null;
  declare token_qr: string | null;
  declare estatus_docente: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date | null;
  declare rol?: any;
  declare especialidad_rel?: any;

  static associate(models: any) {
    Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    Usuario.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad_rel' });
    Usuario.hasMany(models.HorarioDocente, { foreignKey: 'id_docente', as: 'horarios' });
    Usuario.hasMany(models.AsistenciaDocente, { foreignKey: 'id_docente', as: 'asistenciasDocente' });
    Usuario.hasMany(models.AsistenciaEstudiante, { foreignKey: 'id_docente_toma', as: 'asistenciasTomadas' });
    Usuario.hasMany(models.MateriaPendiente, { foreignKey: 'id_docente_evaluador', as: 'evaluacionesPendientes' });
    Usuario.hasMany(models.Seccion, { foreignKey: 'id_docente_guia', as: 'seccionesGuia' });
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
      cedula: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      nombre1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nombre2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      apellido1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      apellido2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      fecha_nac: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'especialidades',
          key: 'id_especialidad',
        },
      },
      token_qr: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      estatus_docente: {
        type: DataTypes.STRING(15),
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
