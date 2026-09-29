import React from 'react';
import { UserProfile } from '../types/task';
import { TASKPRO_LOGO } from '../data/initialTasks';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface ProfileScreenProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  completedTasksCount,
  totalTasksCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      {/* Profile Header Card */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left mb-4">
        <div className="relative">
          <img
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20 shadow-md"
            src={user.avatar}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white ring-2 ring-surface">
            <span className="material-symbols-outlined text-[14px]">verified</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-headline text-xl font-bold text-on-surface">{user.name}</h2>
          <p className="text-xs text-primary font-semibold mt-0.5">{user.role}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{user.email}</p>

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
                <p className="text-[11px] text-on-surface-variant">Local storage active</p>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary">{t('activePill')}</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-2">
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
