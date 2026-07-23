import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, ChevronRight, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Modal } from './Modal';
import { SchoolPeriod } from '../types';

interface EstudiantePromocion {
  id_estudiante: number;
  nombre: string;
  gradoActual: string;
  gradoNumero: number;
  seccionActual: string;
  materiasReprobadas: number;
  materiasReprobadasDetalle: { id_asignatura: number; nombre: string }[];
  accionRecomendada: string;
  siguienteGrado: string | null;
  siguienteGradoNumero: number | null;
}

interface PreviewData {
  periodoActual: { id: number; nombre: string };
  siguientePeriodo: { id: number; nombre: string } | null;
  estudiantes: EstudiantePromocion[];
  resumen: {
    total: number;
    promovidos: number;
    promovidosPendientes: number;
    repitentes: number;
  };
}

interface PromocionManagerProps {
  isOpen: boolean;
  periodoId: string;
  periodoNombre: string;
  onClose: () => void;
  onComplete: () => void;
  onRefreshPeriods?: () => Promise<void>;
}

export default function PromocionManager({ isOpen, periodoId, periodoNombre, onClose, onComplete, onRefreshPeriods }: PromocionManagerProps) {
  const [step, setStep] = useState<'loading' | 'preview' | 'confirming' | 'done'>('loading');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [decisiones, setDecisiones] = useState<Record<number, string>>({});
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    setStep('loading');
    setError(null);
    try {
      const data = await api.promocion.getPreview(periodoId);
      setPreviewData(data);
      const initialDecisiones: Record<number, string> = {};
      const initialMaterias: Record<number, number[]> = {};
      data.estudiantes.forEach((e: EstudiantePromocion) => {
        initialDecisiones[e.id_estudiante] = e.accionRecomendada;
        if (e.accionRecomendada === 'promovido_pendientes' || e.accionRecomendada === 'graduado_pendientes') {
          initialMaterias[e.id_estudiante] = e.materiasReprobadasDetalle.map(m => m.id_asignatura);
        }
      });
      setDecisiones(initialDecisiones);
      setMateriasSeleccionadas(initialMaterias);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || 'Error al cargar el preview de promoción');
      setStep('preview');
    }
  }, [periodoId]);

  useEffect(() => {
    if (isOpen && periodoId) {
      fetchPreview();
    }
  }, [isOpen, periodoId, fetchPreview]);

  const handleDecisionChange = (idEstudiante: number, nuevaAccion: string) => {
    setDecisiones(prev => ({ ...prev, [idEstudiante]: nuevaAccion }));
    if (nuevaAccion === 'promovido_pendientes' || nuevaAccion === 'graduado_pendientes') {
      const est = previewData?.estudiantes.find(e => e.id_estudiante === idEstudiante);
      if (est) {
        setMateriasSeleccionadas(prev => ({
          ...prev,
          [idEstudiante]: est.materiasReprobadasDetalle.map(m => m.id_asignatura),
        }));
      }
    }
  };

  const toggleMateria = (idEstudiante: number, idAsignatura: number) => {
    setMateriasSeleccionadas(prev => {
      const actuales = prev[idEstudiante] || [];
      const existe = actuales.includes(idAsignatura);
      return {
        ...prev,
        [idEstudiante]: existe
          ? actuales.filter(id => id !== idAsignatura)
          : [...actuales, idAsignatura],
      };
    });
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'promovido':
      case 'graduado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'promovido_pendientes':
      case 'graduado_pendientes':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'repitente':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getAccionLabel = (accion: string) => {
    switch (accion) {
      case 'promovido': return 'Promovido';
      case 'graduado': return 'Graduado';
      case 'promovido_pendientes': return 'Pendientes';
      case 'graduado_pendientes': return 'Graduado Pendientes';
      case 'repitente': return 'Repitente';
      default: return accion;
    }
  };

  const handleConfirmar = async () => {
    const pendientesSinSeleccion = Object.entries(decisiones).some(
      ([id, accion]) =>
        (accion === 'promovido_pendientes' || accion === 'graduado_pendientes') &&
        (!materiasSeleccionadas[Number(id)] || materiasSeleccionadas[Number(id)].length === 0)
    );
    if (pendientesSinSeleccion) {
      toast.error('Selecciona al menos una materia pendiente para cada estudiante');
      return;
    }

    setStep('confirming');
    setLoading(true);
    try {
      const decisionesArray = Object.entries(decisiones).map(([id, accion]) => {
        const base: any = { id_estudiante: Number(id), accion };
        if (accion === 'promovido_pendientes' || accion === 'graduado_pendientes') {
          base.materias_pendientes = materiasSeleccionadas[Number(id)] || [];
        }
        return base;
      });

      const result = await api.promocion.confirmar(periodoId, decisionesArray);
      toast.success(result.message || 'Promoción completada exitosamente');
      setStep('done');
      if (onRefreshPeriods) await onRefreshPeriods();
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Error al confirmar la promoción');
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const resumenActual = previewData ? {
    total: previewData.estudiantes.length,
    promovidos: previewData.estudiantes.filter(e => decisiones[e.id_estudiante] === 'promovido' || decisiones[e.id_estudiante] === 'graduado').length,
    promovidosPendientes: previewData.estudiantes.filter(e => decisiones[e.id_estudiante] === 'promovido_pendientes' || decisiones[e.id_estudiante] === 'graduado_pendientes').length,
    repitentes: previewData.estudiantes.filter(e => decisiones[e.id_estudiante] === 'repitente').length,
  } : null;

  return (
    <Modal isOpen={isOpen} onClose={() => { if (!loading) onClose(); }} title={`Promoción de Estudiantes — ${periodoNombre}`}>
      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Cargando datos de promoción...</p>
        </div>
      )}

      {step === 'preview' && !error && previewData && (
        <div className="space-y-4">
          {previewData.siguientePeriodo && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Periodo Siguiente</span>
              <span className="text-sm font-black text-indigo-700 flex items-center gap-2">
                {previewData.periodoActual.nombre} <ChevronRight className="w-4 h-4" /> {previewData.siguientePeriodo.nombre}
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <p className="text-2xl font-black text-emerald-700">{resumenActual?.promovidos || 0}</p>
              <p className="text-xs font-bold text-emerald-600 uppercase">Promovidos</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <p className="text-2xl font-black text-amber-700">{resumenActual?.promovidosPendientes || 0}</p>
              <p className="text-xs font-bold text-amber-600 uppercase">Con Pendientes</p>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-center">
              <p className="text-2xl font-black text-rose-700">{resumenActual?.repitentes || 0}</p>
              <p className="text-xs font-bold text-rose-600 uppercase">Repitentes</p>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="p-2 font-bold text-slate-600">Estudiante</th>
                  <th className="p-2 font-bold text-slate-600 text-center">Grado</th>
                  <th className="p-2 font-bold text-slate-600 text-center">Sección</th>
                  <th className="p-2 font-bold text-slate-600 text-center">Reprobadas</th>
                  <th className="p-2 font-bold text-slate-600">Decisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewData.estudiantes.map(est => (
                  <React.Fragment key={est.id_estudiante}>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-medium text-slate-700">{est.nombre}</td>
                      <td className="p-2 text-center text-slate-600">{est.gradoActual}</td>
                      <td className="p-2 text-center font-bold text-slate-700">{est.seccionActual}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          est.materiasReprobadas === 0 ? 'bg-emerald-100 text-emerald-700' :
                          est.materiasReprobadas <= 2 ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {est.materiasReprobadas}
                        </span>
                      </td>
                      <td className="p-2">
                        <select
                          value={decisiones[est.id_estudiante] || est.accionRecomendada}
                          onChange={(e) => handleDecisionChange(est.id_estudiante, e.target.value)}
                          className={`w-full text-xs font-bold p-1.5 rounded border cursor-pointer ${getAccionColor(decisiones[est.id_estudiante] || est.accionRecomendada)}`}
                        >
                          <option value="promovido">Promovido</option>
                          <option value="promovido_pendientes">Pendientes</option>
                          <option value="repitente">Repitente</option>
                          {est.gradoNumero >= 5 && (
                            <>
                              <option value="graduado">Graduado</option>
                              <option value="graduado_pendientes">Graduado Pendientes</option>
                            </>
                          )}
                        </select>
                      </td>
                    </tr>
                    {(decisiones[est.id_estudiante] === 'promovido_pendientes' || decisiones[est.id_estudiante] === 'graduado_pendientes') && est.materiasReprobadasDetalle.length > 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-2 bg-amber-50/50">
                          <p className="text-xs font-bold text-amber-700 mb-1">Selecciona las materias pendientes:</p>
                          <div className="flex flex-wrap gap-2">
                            {est.materiasReprobadasDetalle.map(materia => (
                              <label key={materia.id_asignatura} className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-amber-200 rounded px-2 py-1 cursor-pointer hover:bg-amber-50">
                                <input
                                  type="checkbox"
                                  checked={(materiasSeleccionadas[est.id_estudiante] || []).includes(materia.id_asignatura)}
                                  onChange={() => toggleMateria(est.id_estudiante, materia.id_asignatura)}
                                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                />
                                {materia.nombre}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>
                Los estudiantes "Repitente" NO recibirán matrícula en el periodo {previewData.siguientePeriodo?.nombre || 'siguiente'}.
                Los estudiantes "Promovidos" serán matriculados en el siguiente grado.
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Confirmar Promoción
            </button>
          </div>
        </div>
      )}

      {step === 'confirming' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Procesando promoción de estudiantes...</p>
          <p className="text-xs text-slate-400">Creando periodo, secciones y matrículas</p>
        </div>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="text-lg font-bold text-slate-800">¡Promoción Completada!</p>
          <p className="text-sm text-slate-500">Los estudiantes han sido promovidos exitosamente.</p>
        </div>
      )}

      {error && step === 'preview' && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <XCircle className="w-10 h-10 text-rose-500" />
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={fetchPreview}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}
    </Modal>
  );
}
