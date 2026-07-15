SELECT
  (SELECT COUNT(*) FROM personas) AS total_personas,
  (SELECT COUNT(*) FROM docentes WHERE id_persona IS NOT NULL) AS docentes_con_persona,
  (SELECT COUNT(*) FROM docentes WHERE id_persona IS NULL) AS docentes_sin_persona,
  (SELECT COUNT(*) FROM estudiantes WHERE id_persona IS NOT NULL) AS estudiantes_con_persona,
  (SELECT COUNT(*) FROM estudiantes WHERE id_persona IS NULL) AS estudiantes_sin_persona,
  (SELECT COUNT(*) FROM representantes WHERE id_persona IS NOT NULL) AS representantes_con_persona,
  (SELECT COUNT(*) FROM representantes WHERE id_persona IS NULL) AS representantes_sin_persona,
  (SELECT COUNT(*) FROM usuarios WHERE id_persona IS NOT NULL) AS usuarios_con_persona,
  (SELECT COUNT(*) FROM usuarios WHERE id_persona IS NULL) AS usuarios_sin_persona;
