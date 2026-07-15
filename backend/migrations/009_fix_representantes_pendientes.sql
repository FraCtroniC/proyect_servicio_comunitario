DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM representantes WHERE id_persona IS NULL;

  IF v_count > 0 THEN
    RAISE NOTICE 'Hay % representante(s) sin id_persona. Intentando vincular por cedula...', v_count;

    UPDATE representantes r
    SET id_persona = p.id_persona
    FROM personas p
    WHERE r.id_persona IS NULL
      AND p.cedula IN (
        SELECT cedula_rep FROM representantes_old_data
        WHERE id_representante = r.id_representante
      );

    SELECT COUNT(*) INTO v_count FROM representantes WHERE id_persona IS NULL;
    IF v_count > 0 THEN
      RAISE WARNING '% representante(s) no pudieron ser vinculados automaticamente. Sus datos personales se perdieron al eliminar las columnas viejas.', v_count;
    END IF;
  ELSE
    RAISE NOTICE 'Todos los representantes tienen id_persona asignado.';
  END IF;
END $$;
