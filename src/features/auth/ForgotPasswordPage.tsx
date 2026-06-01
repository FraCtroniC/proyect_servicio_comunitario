import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { findUser, updatePassword } from '@/services/authCredentials';

const lookupSchema = z.object({
  userName: z.string().min(1, 'Indica tu usuario'),
});

const resetSchema = z
  .object({
    password: z.string().min(4, 'Mínimo 4 caracteres'),
    confirmPassword: z.string().min(4, 'Confirma la contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type LookupData = z.infer<typeof lookupSchema>;
type ResetData = z.infer<typeof resetSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'lookup' | 'reset' | 'done'>('lookup');
  const [resolvedUser, setResolvedUser] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const lookupForm = useForm<LookupData>({ resolver: zodResolver(lookupSchema) });
  const resetForm = useForm<ResetData>({ resolver: zodResolver(resetSchema) });

  const onLookup = (data: LookupData) => {
    setLookupError(null);
    const user = findUser(data.userName);
    if (!user) {
      setLookupError('No encontramos ese usuario. Verifica el nombre e intenta de nuevo.');
      return;
    }
    setResolvedUser(user.userName);
    setStep('reset');
  };

  const onReset = (data: ResetData) => {
    if (!resolvedUser) return;
    setResetError(null);
    const ok = updatePassword(resolvedUser, data.password);
    if (!ok) {
      setResetError('No se pudo actualizar la contraseña. Intenta otra vez.');
      return;
    }
    setStep('done');
  };

  if (step === 'done') {
    return (
      <AuthShell
        eyebrow="Listo"
        title="Contraseña actualizada"
        subtitle="Ya puedes iniciar sesión con tu nueva contraseña."
      >
        <button type="button" onClick={() => navigate('/login')} className="btn-primary w-full">
          Ir al inicio de sesión
        </button>
      </AuthShell>
    );
  }

  if (step === 'reset') {
    return (
      <AuthShell
        eyebrow="Nueva clave"
        title="Restablecer contraseña"
        subtitle={`Define una contraseña nueva para el usuario ${resolvedUser}.`}
      >
        <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Nueva contraseña
            <input
              {...resetForm.register('password')}
              type="password"
              autoComplete="new-password"
              className="input-field mt-2"
              placeholder="Mínimo 4 caracteres"
            />
            {resetForm.formState.errors.password && (
              <p className="mt-2 text-sm font-medium text-ember">{resetForm.formState.errors.password.message}</p>
            )}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Confirmar contraseña
            <input
              {...resetForm.register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              className="input-field mt-2"
              placeholder="Repite la contraseña"
            />
            {resetForm.formState.errors.confirmPassword && (
              <p className="mt-2 text-sm font-medium text-ember">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </label>

          {resetError && (
            <p className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-medium text-ember">
              {resetError}
            </p>
          )}

          <button type="submit" disabled={resetForm.formState.isSubmitting} className="btn-primary w-full">
            Guardar contraseña
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('lookup');
              setResolvedUser(null);
            }}
            className="w-full text-sm font-semibold text-slate-600 transition hover:text-ink"
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
      subtitle="Escribe tu usuario. Si existe en el sistema, podrás definir una contraseña nueva."
    >
      <form onSubmit={lookupForm.handleSubmit(onLookup)} className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700">
          Usuario
          <input
            {...lookupForm.register('userName')}
            autoComplete="username"
            className="input-field mt-2"
            placeholder="Ej. arturo"
          />
          {lookupForm.formState.errors.userName && (
            <p className="mt-2 text-sm font-medium text-ember">{lookupForm.formState.errors.userName.message}</p>
          )}
        </label>

        {lookupError && (
          <p className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-medium text-ember">
            {lookupError}
          </p>
        )}

        <button type="submit" disabled={lookupForm.formState.isSubmitting} className="btn-primary w-full">
          Continuar
        </button>

        <Link to="/login" className="block w-full text-center text-sm font-semibold text-moss transition hover:text-ink">
          Volver al inicio de sesión
        </Link>
      </form>
    </AuthShell>
  );
}
