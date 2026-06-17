import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/services/api';
import { AlertBanner } from '@/components/ui/AlertBanner';

type Classroom = {
  id_aula: number;
  nombre_codigo: string;
  capacidad: number | null;
  tipo_espacio: string | null;
  ubicacion: string | null;
  estatus: string | null;
};

const classroomSchema = z.object({
  nombre_codigo: z.string().min(1, 'El código/nombre es requerido').max(30, 'Máximo 30 caracteres'),
  capacidad: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(1, 'Debe ser al menos 1').nullable()
  ),
  tipo_espacio: z.string().min(1, 'El tipo de espacio es requerido').max(30),
  ubicacion: z.string().max(100, 'Máximo 100 caracteres').optional().nullable().or(z.literal('')),
  estatus: z.string().min(1, 'El estatus es requerido').max(20),
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

export function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      nombre_codigo: '',
      capacidad: null,
      tipo_espacio: 'Aula Regular',
      ubicacion: '',
      estatus: 'Activo',
    },
  });

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const data = await api.get<Classroom[]>('/api/aulas');
      setClassrooms(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las aulas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const openAddModal = () => {
    setEditingClassroom(null);
    reset({
      nombre_codigo: '',
      capacidad: null,
      tipo_espacio: 'Aula Regular',
      ubicacion: '',
      estatus: 'Activo',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    reset({
      nombre_codigo: classroom.nombre_codigo,
      capacidad: classroom.capacidad,
      tipo_espacio: classroom.tipo_espacio || 'Aula Regular',
      ubicacion: classroom.ubicacion || '',
      estatus: classroom.estatus || 'Activo',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ClassroomFormData) => {
    try {
      if (editingClassroom) {
        await api.patch(`/api/aulas/${editingClassroom.id_aula}`, data);
      } else {
        await api.post('/api/aulas', data);
      }
      setIsModalOpen(false);
      fetchClassrooms();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la aula.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta aula? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/api/aulas/${id}`);
      fetchClassrooms();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la aula.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Infraestructura</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Gestión de Aulas</h3>
          <p className="mt-2 text-sm text-slate">Administre los espacios físicos, laboratorios y áreas deportivas del liceo.</p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva aula
        </button>
      </div>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-line bg-paper p-12 text-center text-slate">
              No hay aulas registradas en el sistema. Presione "Nueva aula" para comenzar.
            </div>
          ) : (
            classrooms.map((c) => (
              <div
                key={c.id_aula}
                className="group relative flex flex-col justify-between rounded-xl border border-line bg-paper p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="badge border-accent/20 bg-accent/5 text-accent">
                      {c.tipo_espacio || 'Espacio Común'}
                    </span>
                    <span
                      className={`badge ${
                        c.estatus === 'Activo'
                          ? 'border-success/20 bg-success/5 text-success'
                          : 'border-warning/20 bg-warning/5 text-warning'
                      }`}
                    >
                      {c.estatus}
                    </span>
                  </div>

                  <h4 className="mt-4 font-display text-lg font-semibold text-ink">{c.nombre_codigo}</h4>

                  <div className="mt-3 space-y-1.5 text-xs text-slate">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal">Capacidad:</span>{' '}
                      {c.capacidad ? `${c.capacidad} estudiantes` : 'No definida'}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal">Ubicación:</span>{' '}
                      {c.ubicacion || 'No especificada'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(c)}
                    className="btn-secondary flex-1 py-2 text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id_aula)}
                    className="rounded-lg border border-danger/20 bg-paper px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/5"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-soft">
            <h3 className="font-display text-xl font-semibold text-ink">
              {editingClassroom ? 'Modificar Aula' : 'Crear Nueva Aula'}
            </h3>
            <p className="mt-1 text-xs text-slate">Ingrese los datos para configurar el espacio académico.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Código o Nombre del Aula
                  <input
                    {...register('nombre_codigo')}
                    maxLength={30}
                    className="input-field mt-1.5"
                    placeholder="Ej. Aula 5, Laboratorio A"
                  />
                </label>
                {errors.nombre_codigo && (
                  <p className="mt-1 text-xs text-danger">{errors.nombre_codigo.message}</p>
                )}
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal">
                    Capacidad Máxima
                    <input
                      type="number"
                      {...register('capacidad')}
                      className="input-field mt-1.5"
                      placeholder="Ej. 35"
                    />
                  </label>
                  {errors.capacidad && <p className="mt-1 text-xs text-danger">{errors.capacidad.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal">
                    Tipo de Espacio
                    <select {...register('tipo_espacio')} className="input-field mt-1.5">
                      <option value="Aula Regular">Aula Regular</option>
                      <option value="Laboratorio">Laboratorio</option>
                      <option value="Cancha">Cancha</option>
                      <option value="CBIT">CBIT</option>
                    </select>
                  </label>
                  {errors.tipo_espacio && (
                    <p className="mt-1 text-xs text-danger">{errors.tipo_espacio.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Ubicación
                  <input
                    {...register('ubicacion')}
                    maxLength={100}
                    className="input-field mt-1.5"
                    placeholder="Ej. Planta Alta, Ala Este"
                  />
                </label>
                {errors.ubicacion && <p className="mt-1 text-xs text-danger">{errors.ubicacion.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Estado
                  <select {...register('estatus')} className="input-field mt-1.5">
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </label>
                {errors.estatus && <p className="mt-1 text-xs text-danger">{errors.estatus.message}</p>}
              </div>

              <div className="flex gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-2">
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
