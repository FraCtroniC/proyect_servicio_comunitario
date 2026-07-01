/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

interface ProfileData {
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  username: string;
  rol: string | null;
}

export default function UserProfileModal({ isOpen, onClose, currentUser, onLogout }: UserProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingProfile(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);

      api.auth.getProfile()
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => {
          console.error('Error al cargar perfil:', err);
          toast.error('No se pudieron cargar los datos del perfil.');
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [isOpen]);

  const getFullName = () => {
    if (!profile) return currentUser?.name || 'Usuario';
    const nombres = [profile.nombre1, profile.nombre2].filter(Boolean).join(' ');
    const apellidos = [profile.apellido1, profile.apellido2].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`.trim() || currentUser?.name || 'Usuario';
  };

  const handleSubmitPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos de contraseña son obligatorios.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Contraseña actualizada con éxito.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => onLogout(), 1500);
    } catch (err: any) {
      toast.error(err.message || 'Error al cambiar la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil" maxWidth="max-w-lg">
      {loadingProfile ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
          <span className="ml-3 text-sm text-slate-500">Cargando perfil...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Información del usuario */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                <User className="h-7 w-7 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-800 truncate">{getFullName()}</h3>
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                  {profile?.rol || currentUser?.role || 'Sin rol'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Nombre(s)</span>
                <span className="block text-slate-700 font-semibold">{[profile?.nombre1, profile?.nombre2].filter(Boolean).join(' ') || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Apellido(s)</span>
                <span className="block text-slate-700 font-semibold">{[profile?.apellido1, profile?.apellido2].filter(Boolean).join(' ') || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Usuario</span>
                <span className="block text-slate-700 font-semibold">{profile?.username || currentUser?.id || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Rol</span>
                <span className="block text-slate-700 font-semibold">{profile?.rol || '—'}</span>
              </div>
            </div>
          </div>

          {/* Cambio de contraseña */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              Cambiar Contraseña
            </h4>

            <div className="space-y-3">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 pr-10"
                    placeholder="Ingrese su contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 pointer-events-auto cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 pr-10"
                    placeholder="Ingrese la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 pointer-events-auto cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Confirme la nueva contraseña"
                />
              </div>

              <button
                onClick={handleSubmitPassword}
                disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
