import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { loginSchema, type LoginFormData } from '@/lib/security/authSchemas';
import { isHoneypotTriggered } from '@/lib/security/inputValidation';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const expired = (location.state as { reason?: string } | null)?.reason === 'expired';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    if (isHoneypotTriggered(data.website)) {
      setAuthError('No se pudo completar el inicio de sesión.');
      return;
    }

    const result = await signIn(data.userName, data.password);
    if (!result.ok) {
      setAuthError(result.message);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Acceso institucional"
      title="Iniciar sesión"
      subtitle="Ingrese sus credenciales autorizadas para acceder al panel administrativo."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {expired && (
          <AlertBanner variant="warning" title="Sesión finalizada">
            Por seguridad, su sesión expiró. Vuelva a iniciar sesión.
          </AlertBanner>
        )}

        <input {...register('website')} tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden />

        <label className="block text-sm font-medium text-charcoal">
          Usuario
          <input
            {...register('userName')}
            autoComplete="username"
            maxLength={32}
            className="input-field mt-2"
            placeholder="usuario.institucional"
          />
          {errors.userName && <p className="mt-2 text-sm text-danger">{errors.userName.message}</p>}
        </label>

        <label className="block text-sm font-medium text-charcoal">
          Contraseña
          <div className="relative mt-2">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              maxLength={64}
              className="input-field pr-20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-accent transition hover:text-ink"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm text-danger">{errors.password.message}</p>}
        </label>

        {authError && <AlertBanner>{authError}</AlertBanner>}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Verificando…' : 'Ingresar al sistema'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="w-full text-center text-sm font-medium text-accent transition hover:text-ink"
        >
          Recuperar contraseña
        </button>
      </form>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-slate">
        Conexión protegida. Los intentos fallidos repetidos activan un bloqueo temporal de la cuenta.
      </p>
    </AuthShell>
  );
}
