import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { AlertBanner } from '@/components/ui/AlertBanner';

// Esquemas de validación definidos localmente para asegurar el funcionamiento inmediato
const recoveryLookupSchema = z.object({
  email: z.string().email('Ingrese un correo institucional válido'),
});

const recoveryResetSchema = z.object({
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  confirmPassword: z.string().min(4, 'Repita la contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RecoveryLookupData = z.infer<typeof recoveryLookupSchema>;
type RecoveryResetData = z.infer<typeof recoveryResetSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
  
  const [step, setStep] = useState<'lookup' | 'reset' | 'done'>(token ? 'reset' : 'lookup');
  const [formError, setFormError] = useState<string | null>(null);
  
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'success' | 'error';
  }>({ isOpen: false, title: '', message: '', variant: 'success' });

  const lookupForm = useForm<RecoveryLookupData>({
    resolver: zodResolver(recoveryLookupSchema),
  });
  const resetForm = useForm<RecoveryResetData>({
    resolver: zodResolver(recoveryResetSchema),
  });

  const onLookup = async (data: RecoveryLookupData) => {
    setFormError(null);
    try {
      // Corregido: La ruta en auth.routes.ts es /forgot-password
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: data.email }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setFormError(result.message || 'El correo no pudo ser procesado.');
        setModal({
          isOpen: true,
          title: 'Atención',
          message: 'El proceso fue rechazado. Por favor, verifique si el correo está bien ingresado o si pertenece a una cuenta activa.',
          variant: 'error'
        });
      } else {
        setModal({
          isOpen: true,
          title: 'Solicitud enviada',
          message: 'Proceso exitoso: Se ha enviado un correo con las instrucciones para restablecer su contraseña.',
          variant: 'success'
        });
        lookupForm.reset();
      }
    } catch (err) {
      setFormError('Error de conexión con el servidor.');
      setModal({ isOpen: true, title: 'Error de red', message: 'Error de red. Verifique su conexión con el servidor.', variant: 'error' });
    }
  };

  const onReset = async (data: RecoveryResetData) => {
    setFormError(null);

    if (!token || token.length < 20) {
      setFormError('El enlace de recuperación parece estar incompleto o es inválido.');
      return;
    }

    try {
      // Corregido: La ruta en auth.routes.ts es /reset-password
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          password: data.password 
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setFormError(result.message || 'No se pudo restablecer la contraseña.');
      } else {
        setStep('done');
      }
    } catch (err) {
      setFormError('Error de red al intentar cambiar la contraseña.');
    }
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
        subtitle="Defina su nueva contraseña de acceso para recuperar el control de su cuenta."
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
            {resetForm.formState.errors.password?.message && (
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
            {resetForm.formState.errors.confirmPassword?.message && (
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
              navigate('/forgot-password', { replace: true });
            }}
            className="btn-secondary w-full"
          >
            Solicitar nuevo enlace
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <>
      <AuthShell
        eyebrow="Recuperación"
        title="Recuperar acceso"
        subtitle="Indique su correo institucional para continuar con el restablecimiento de contraseña."
      >
        <form onSubmit={lookupForm.handleSubmit(onLookup)} className="space-y-5" noValidate>
          <label className="block text-sm font-medium text-charcoal">
            Correo institucional
            <input
              {...lookupForm.register('email')}
              type="email"
              autoComplete="email"
              maxLength={64}
              className="input-field mt-2"
              placeholder="correo@institucion.edu.ve"
            />
            {lookupForm.formState.errors.email?.message && (
              <p className="mt-2 text-sm text-danger">{lookupForm.formState.errors.email.message}</p>
            )}
          </label>

          {formError && <AlertBanner>{formError}</AlertBanner>}

          <button type="submit" disabled={lookupForm.formState.isSubmitting} className="btn-primary w-full">
            {lookupForm.formState.isSubmitting ? 'Procesando…' : 'Continuar'}
          </button>

          <Link to="/login" className="block w-full text-center text-sm font-medium text-accent hover:text-ink">
            Volver al inicio de sesión
          </Link>
        </form>
      </AuthShell>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${modal.variant === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <span className="text-2xl font-bold">{modal.variant === 'success' ? '✓' : '!'}</span>
            </div>
            <h3 className="text-center text-xl font-bold text-charcoal">
              {modal.title}
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate">
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="btn-primary mt-8 w-full"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
