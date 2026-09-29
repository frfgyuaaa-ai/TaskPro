import React, { useState } from 'react';
import { TASKPRO_LOGO, SARAH_AVATAR } from '../data/initialTasks';
import { Screen, UserProfile } from '../types/task';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../i18n/LanguageContext';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  title?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  user,
  title,
  onBack,
}) => {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isStackScreen = currentScreen === 'new_task' || currentScreen === 'task_details';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container-high/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          {isStackScreen ? (
            <button
              aria-label="Go Back"
              onClick={onBack || (() => onNavigate('feed'))}
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onNavigate('feed')}
          >
            <img
              alt="TaskPro Logo"
              className="h-7 w-auto object-contain transition-transform hover:scale-105"
              src={TASKPRO_LOGO}
            />
            <span className="font-headline font-semibold text-lg text-on-surface tracking-tight truncate max-w-[170px]">
              {title || 'TaskPro'}
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector Pill */}
          <LanguageSelector variant="pill" />

          {/* Light/Dark Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={onToggleDarkMode}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-high/60 text-on-surface-variant hover:text-primary transition-all active:scale-90"
            title={isDarkMode ? t('lightView') : t('darkView')}
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center relative rounded-full bg-surface-container-high/60 text-on-surface-variant hover:text-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-[21px] sm:text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-pulse" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="font-headline text-sm font-semibold text-on-surface">{t('notifications')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">
                    {t('oneNew')}
                  </span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2.5 rounded-xl bg-error-container/20 border border-error-container/40 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                    <div className="text-xs">
                      <p className="font-semibold text-error">Strategy Deck is 2h overdue</p>
                      <p className="text-on-surface-variant mt-0.5">Executive sync begins in 30 minutes.</p>
                      <span className="text-[10px] text-outline mt-1 block">Today, 3:00 PM</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-surface-container flex items-start gap-2.5 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">sync</span>
                    <div className="text-xs">
                      <p className="font-medium text-on-surface">{t('syncedApps')}</p>
                      <p className="text-on-surface-variant mt-0.5">Slack, Google Calendar, GitHub.</p>
                      <span className="text-[10px] text-outline mt-1 block">10 mins ago</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-surface-container flex justify-between text-xs">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-on-surface-variant hover:text-primary font-medium"
                  >
                    {t('markAllRead')}
                  </button>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('profile');
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {t('viewSettings')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative pl-0.5">
            <button
              aria-label="Profile"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full ring-2 ring-primary/30 hover:ring-primary transition-all overflow-hidden active:scale-95 flex items-center justify-center"
            >
              <img
                alt={user.name}
                className="w-full h-full object-cover"
                src={user.avatar || SARAH_AVATAR}
              />
            </button>

            {/* User Quick Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-11 w-52 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-surface-container">
                  <p className="font-headline font-semibold text-xs text-on-surface truncate">{user.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    {t('profileSettings')}
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('feed');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">checklist</span>
                    {t('myTasksFeed')}
                  </button>
                  <div className="h-px bg-surface-container my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('auth');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-error hover:bg-error-container/30 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    {t('switchAccount')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
