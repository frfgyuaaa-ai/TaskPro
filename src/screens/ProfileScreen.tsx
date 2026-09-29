import React, { useState } from 'react';
import { UserProfile } from '../types/task';
import { TASKPRO_LOGO } from '../data/initialTasks';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { UserAvatar } from '../components/UserAvatar';
import { AVATAR_GRADIENTS, getStoredAccounts, saveAccount, Account } from '../utils/accountManager';

interface ProfileScreenProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onSwitchAccount?: (account: Account) => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  onUpdateUser,
  onSwitchAccount,
  completedTasksCount,
  totalTasksCount,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editRole, setEditRole] = useState(user.role);
  const [editAvatarUrl, setEditAvatarUrl] = useState(user.avatar || '');
  const [editAvatarColor, setEditAvatarColor] = useState(user.avatarColor || AVATAR_GRADIENTS[0]);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const handleStartEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditAvatarUrl(user.avatar || '');
    setEditAvatarColor(user.avatarColor || AVATAR_GRADIENTS[0]);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated: UserProfile = {
      ...user,
      name: editName.trim(),
      email: editEmail.trim() || user.email,
      role: editRole.trim() || user.role,
      avatar: editAvatarUrl.trim(),
      avatarColor: editAvatarColor,
    };

    onUpdateUser(updated);
    setIsEditing(false);
  };

  const allAccounts = getStoredAccounts();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      {/* Profile Header Card */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left mb-4 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <UserAvatar
            name={user.name}
            avatar={user.avatar}
            size="xl"
            avatarColor={user.avatarColor}
            className="ring-4 ring-primary/20 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white ring-2 ring-surface">
            <span className="material-symbols-outlined text-[14px]">verified</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{user.name}</h2>
              <p className="text-xs text-primary font-semibold mt-0.5">{user.role}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleStartEdit}
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 border border-primary/20"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>{t('editProfile')}</span>
            </button>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
              <span>4-{t('streakDays')}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">task_alt</span>
              <span>{completedTasksCount} / {totalTasksCount} {t('resolvedTasks')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
                <span>{t('editProfile')}</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Preview Avatar */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container/40">
                <UserAvatar
                  name={editName || 'User'}
                  avatar={editAvatarUrl}
                  avatarColor={editAvatarColor}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-on-surface truncate">{editName || 'Ismingiz'}</p>
                  <p className="text-[11px] text-on-surface-variant">{editEmail || 'email@domen.uz'}</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Masalan: Anvar Qodirov"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  placeholder="anvar@company.uz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                  {t('roleLabel')}
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="Masalan: Bosh mutaxassis, Dasturchi, Loyiha menejeri"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Avatar rangi / Gradient
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_GRADIENTS.map((grad, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEditAvatarColor(grad);
                        setEditAvatarUrl('');
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center transition-all ${
                        editAvatarColor === grad && !editAvatarUrl
                          ? 'ring-2 ring-primary ring-offset-2 scale-110'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {editAvatarColor === grad && !editAvatarUrl && (
                        <span className="material-symbols-outlined text-[16px] text-white">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Photo URL */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                  {t('avatarLabel')} (ixtiyoriy)
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://... rasm havolasi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container transition-all active:scale-95"
                >
                  {t('saveProfile')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Switch Account Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">switch_account</span>
                <span>Mavjud hisoblar ({allAccounts.length})</span>
              </h3>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {allAccounts.map((acc) => {
                const isCurrent = acc.id === user.id || acc.email === user.email;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      if (onSwitchAccount) {
                        onSwitchAccount(acc);
                      }
                      setShowSwitchModal(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      isCurrent
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-surface-container-high/40 hover:bg-surface-container'
                    }`}
                  >
                    <UserAvatar
                      name={acc.name}
                      avatar={acc.avatar}
                      avatarColor={acc.avatarColor}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-on-surface truncate">{acc.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{acc.email}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                        Hozirgi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-surface-container flex gap-2">
              <button
                onClick={() => {
                  setShowSwitchModal(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Yangi hisob ochish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connected Integrations Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
            {t('connectedWorkspaces')}
          </span>
          <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            {t('liveSyncedPill')}
          </span>
        </div>
        <div className="space-y-2">
          {[
            {
              name: 'Google Calendar & Workspace',
              desc: 'Syncs deadlines and executive sync events',
              icon: 'calendar_month',
              color: 'text-blue-500',
              status: 'Connected',
            },
            {
              name: 'Slack #exec-sync & Notifications',
              desc: 'Sends high-priority escalation pings',
              icon: 'chat',
              color: 'text-amber-500',
              status: 'Connected',
            },
            {
              name: 'GitHub Repositories',
              desc: 'Links pull requests and design token branches',
              icon: 'terminal',
              color: 'text-emerald-500',
              status: 'Connected',
            },
          ].map((app) => (
            <div
              key={app.name}
              className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/40 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <span className={`material-symbols-outlined text-[20px] ${app.color}`}>
                    {app.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{app.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{app.desc}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full shrink-0">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences & Settings */}
      <div className="mb-4">
        <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
          {t('preferences')}
        </span>
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 divide-y divide-surface-container-high/40 overflow-hidden">
          {/* Language Selector Row */}
          <LanguageSelector variant="settings-row" />

          {/* Theme Toggle Row */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                palette
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">{t('darkThemeMode')}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {isDarkMode ? t('darkView') : t('lightView')}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-11 h-6 rounded-full relative p-0.5 transition-colors ${
                isDarkMode ? 'bg-primary' : 'bg-outline-variant'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-Save & Stay Logged In Status */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                verified_user
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">Avtomatik doimiy sessiya</p>
                <p className="text-[11px] text-on-surface-variant">
                  Sizning hisobingizdan hech qachon chiqib ketilmaydi
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
              Doimiy faol
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                notifications_active
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">{t('pushNotifications')}</p>
                <p className="text-[11px] text-on-surface-variant">15 {t('minutesBefore')}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">{t('enabledPill')}</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                cloud_sync
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">{t('offlineCache')}</p>
                <p className="text-[11px] text-on-surface-variant">Local storage faol</p>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary">{t('activePill')}</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => setShowSwitchModal(true)}
          className="w-full py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 border border-surface-container-high/60"
        >
          <span className="material-symbols-outlined text-[18px]">switch_account</span>
          <span>Hisobni almashtirish ({allAccounts.length})</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl bg-error-container/40 hover:bg-error-container text-error text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>{t('signOutBtn')}</span>
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-6 pb-2 text-[11px] text-outline flex items-center justify-center gap-2">
        <img alt="TaskPro" src={TASKPRO_LOGO} className="w-4 h-4 object-contain" />
        <span>TaskPro Productivity Suite v2.4 • High Velocity Edition</span>
      </div>
    </div>
  );
};
