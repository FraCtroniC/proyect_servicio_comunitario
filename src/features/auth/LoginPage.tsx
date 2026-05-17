import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  userName: z.string().min(1, 'El usuario es requerido'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    signIn(data.userName.trim());
    navigate('/', { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-coral">Acceso</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Usa un nombre de usuario para iniciar (demo).</p>

        <label className="mt-8 block text-sm font-medium text-slate-700">
          Usuario
          <input
            {...register('userName')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-sand px-4 py-3 outline-none transition focus:border-moss"
            placeholder="Nombre de usuario"
          />
          {errors.userName && <p className="mt-2 text-sm text-red-600">{errors.userName.message}</p>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-sand transition hover:opacity-95 disabled:opacity-60"
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="mt-4 w-full text-sm font-medium text-moss transition hover:underline"
        >
          Recuperar acceso
        </button>
      </form>
    </main>
  );
}