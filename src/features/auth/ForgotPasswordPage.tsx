import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { AlertBanner } from '@/components/ui/AlertBanner';
import {
  recoveryLookupSchema,
  recoveryResetSchema,
  type RecoveryLookupData,
  type RecoveryResetData,
} from '@/lib/security/authSchemas';
import { lookupUserForRecovery, updatePassword } from '@/services/authCredentials';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'lookup' | 'reset' | 'done'>('lookup');
  const [resolvedUser, setResolvedUser] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const lookupForm = useForm<RecoveryLookupData>({ resolver: zodResolver(recoveryLookupSchema) });
  const resetForm = useForm<RecoveryResetData>({ resolver: zodResolver(recoveryResetSchema) });

  const onLookup = (data: RecoveryLookupData) => {
    setFormError(null);
    const result = lookupUserForRecovery(data.userName);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setResolvedUser(result.userName);
    setStep('reset');
  };

  const onReset = async (data: RecoveryResetData) => {
    if (!resolvedUser) return;
    setFormError(null);
    const result = await updatePassword(resolvedUser, data.password);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setStep('done');
  };

  if (step === 'done') {
    return (
      <AuthShell
        eyebrow="Confirmación"
        title="Contraseña actualizada"
        subtitle="Su nueva contraseña quedó registrada. Puede iniciar sesión de inmediato."
      >
        <AlertBanner variant="success">El cambio se aplicó correctamente.</AlertBanner>
        <button type="button" onClick={() => navigate('/login')} className="btn-primary mt-6 w-full">
          Ir al inicio de sesión
        </button>
      </AuthShell>
    );
  }

  if (step === 'reset') {
    return (
      <AuthShell
        eyebrow="Restablecimiento"
        title="Nueva contraseña"
        subtitle={`Defina una contraseña segura para el usuario ${resolvedUser}.`}
      >
        <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5" noValidate>
          <label className="block text-sm font-medium text-charcoal">
            Nueva contraseña
            <input
              {...resetForm.register('password')}
              type="password"
              autoComplete="new-password"
              maxLength={64}
              className="input-field mt-2"
              placeholder="Mínimo 4 caracteres"
            />
            {resetForm.formState.errors.password && (
              <p className="mt-2 text-sm text-danger">{resetForm.formState.errors.password.message}</p>
            )}
          </label>

          <label className="block text-sm font-medium text-charcoal">
            Confirmar contraseña
            <input
              {...resetForm.register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              maxLength={64}
              className="input-field mt-2"
              placeholder="Repita la contraseña"
            />
            {resetForm.formState.errors.confirmPassword && (
              <p className="mt-2 text-sm text-danger">{resetForm.formState.errors.confirmPassword.message}</p>
            )}
          </label>

          <p className="text-xs leading-relaxed text-slate">
            No use contraseñas comunes ni que contengan su nombre de usuario. Evite espacios y caracteres especiales
            sospechosos.
          </p>

          {formError && <AlertBanner>{formError}</AlertBanner>}

          <button type="submit" disabled={resetForm.formState.isSubmitting} className="btn-primary w-full">
            {resetForm.formState.isSubmitting ? 'Guardando…' : 'Guardar contraseña'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('lookup');
              setResolvedUser(null);
              setFormError(null);
            }}
            className="btn-secondary w-full"
          >
            Cambiar usuario
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Recuperación"
      title="Recuperar acceso"
      subtitle="Indique su usuario institucional para continuar con el restablecimiento de contraseña."
    >
      <form onSubmit={lookupForm.handleSubmit(onLookup)} className="space-y-5" noValidate>
        <label className="block text-sm font-medium text-charcoal">
          Usuario
          <input
            {...lookupForm.register('userName')}
            autoComplete="username"
            maxLength={32}
            className="input-field mt-2"
            placeholder="usuario.institucional"
          />
          {lookupForm.formState.errors.userName && (
            <p className="mt-2 text-sm text-danger">{lookupForm.formState.errors.userName.message}</p>
          )}
        </label>

        {formError && <AlertBanner>{formError}</AlertBanner>}

        <button type="submit" disabled={lookupForm.formState.isSubmitting} className="btn-primary w-full">
          Continuar
        </button>

        <Link to="/login" className="block w-full text-center text-sm font-medium text-accent hover:text-ink">
          Volver al inicio de sesión
        </Link>
      </form>
    </AuthShell>
  );
}
