import { Sequelize } from 'sequelize';
import { databaseConfig } from '../../config/database';
import { environment } from '../../config/environment';

import { initRol, Rol } from './Rol';
import { initEspecialidad, Especialidad } from './Especialidad';
import { initDocente, Docente } from './Docente';
import { initUsuario, Usuario } from './Usuario';
import { initPeriodoEscolar, PeriodoEscolar } from './PeriodoEscolar';
import { initGradoAno, GradoAno } from './GradoAno';
import { initSeccion, Seccion } from './Seccion';
import { initAsignatura, Asignatura } from './Asignatura';
import { initPlanEstudio, PlanEstudio } from './PlanEstudio';
import { initRepresentante, Representante } from './Representante';
import { initEstudiante, Estudiante } from './Estudiante';
import { initMatricula, Matricula } from './Matricula';
import { initMomento, Momento } from './Momento';
import { initEscalaCalificacion, EscalaCalificacion } from './EscalaCalificacion';
import { initCalificacion, Calificacion } from './Calificacion';
import { initHistoricoNotaCertificada, HistoricoNotaCertificada } from './HistoricoNotaCertificada';
import { initAula, Aula } from './Aula';
import { initDiaSemana, DiaSemana } from './DiaSemana';
import { initBloqueHorario, BloqueHorario } from './BloqueHorario';
import { initHorarioDocente, HorarioDocente } from './HorarioDocente';
import { initAsistenciaDocente, AsistenciaDocente } from './AsistenciaDocente';
import { initJustificacion, Justificacion } from './Justificacion';
import { initAuditoria, Auditoria } from './Auditoria';
import { initEvaluacion, Evaluacion } from './Evaluacion';
import { initNotaParcial, NotaParcial } from './NotaParcial';
import { initAsistenciaEstudiante, AsistenciaEstudiante } from './AsistenciaEstudiante';
import { initMateriaPendiente, MateriaPendiente } from './MateriaPendiente';
import { initLoginAudit, LoginAudit } from './LoginAudit';
import { initRefreshToken, RefreshToken } from './RefreshToken';

const env = environment.nodeEnv || 'development';
const config = databaseConfig[env];

if (!environment.databaseUrl) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno.');
}

const sequelize = new Sequelize(environment.databaseUrl, config);

// Inicializar todos los modelos
initRol(sequelize);
initEspecialidad(sequelize);
initDocente(sequelize);
initUsuario(sequelize);
initPeriodoEscolar(sequelize);
initGradoAno(sequelize);
initSeccion(sequelize);
initAsignatura(sequelize);
initPlanEstudio(sequelize);
initRepresentante(sequelize);
initEstudiante(sequelize);
initMatricula(sequelize);
initMomento(sequelize);
initEscalaCalificacion(sequelize);
initCalificacion(sequelize);
initHistoricoNotaCertificada(sequelize);
initAula(sequelize);
initDiaSemana(sequelize);
initBloqueHorario(sequelize);
initHorarioDocente(sequelize);
initAsistenciaDocente(sequelize);
initJustificacion(sequelize);
initAuditoria(sequelize);
initEvaluacion(sequelize);
initNotaParcial(sequelize);
initAsistenciaEstudiante(sequelize);
initMateriaPendiente(sequelize);
initLoginAudit(sequelize);
initRefreshToken(sequelize);

const models = {
  Rol,
  Especialidad,
  Docente,
  Usuario,
  PeriodoEscolar,
  GradoAno,
  Seccion,
  Asignatura,
  PlanEstudio,
  Representante,
  Estudiante,
  Matricula,
  Momento,
  EscalaCalificacion,
  Calificacion,
  HistoricoNotaCertificada,
  Aula,
  DiaSemana,
  BloqueHorario,
  HorarioDocente,
  AsistenciaDocente,
  Justificacion,
  Auditoria,
  Evaluacion,
  NotaParcial,
  AsistenciaEstudiante,
  MateriaPendiente,
  LoginAudit,
  RefreshToken
};

// Configurar todas las asociaciones
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  Sequelize,
  Rol,
  Especialidad,
  Docente,
  Usuario,
  PeriodoEscolar,
  GradoAno,
  Seccion,
  Asignatura,
  PlanEstudio,
  Representante,
  Estudiante,
  Matricula,
  Momento,
  EscalaCalificacion,
  Calificacion,
  HistoricoNotaCertificada,
  Aula,
  DiaSemana,
  BloqueHorario,
  HorarioDocente,
  AsistenciaDocente,
  Justificacion,
  Auditoria,
  Evaluacion,
  NotaParcial,
  AsistenciaEstudiante,
  MateriaPendiente,
  LoginAudit,
  RefreshToken
};
