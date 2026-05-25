import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';

const schema = z.object({
  userName: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setAuthError(null);
    const result = signIn(data.userName.trim(), data.password);
    if (!result.ok) {
      setAuthError(result.message);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Acceso seguro"
      title="Iniciar sesión"
      subtitle="Ingresa tu usuario y contraseña para entrar al panel del liceo."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700">
          Usuario
          <input
            {...register('userName')}
            autoComplete="username"
            className="input-field mt-2"
            placeholder="Ej. arturo"
          />
          {errors.userName && <p className="mt-2 text-sm font-medium text-ember">{errors.userName.message}</p>}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Contraseña
          <div className="relative mt-2">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="input-field pr-24"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-moss transition hover:bg-moss/10"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm font-medium text-ember">{errors.password.message}</p>}
        </label>

        {authError && (
          <p className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-medium text-ember" role="alert">
            {authError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          Entrar al sistema
        </button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="w-full text-center text-sm font-semibold text-moss transition hover:text-ink"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </AuthShell>
  );
}
