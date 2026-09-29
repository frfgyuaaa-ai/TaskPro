import React from 'react';
import { Screen } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  todayCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  todayCount = 4,
}) => {
  const { t } = useTranslation();

  if (currentScreen === 'auth') return null;

  const navItems: { id: Screen; label: string; icon: string; count?: number }[] = [
    { id: 'feed', label: t('myTasks'), icon: 'check_box' },
    { id: 'today', label: t('today'), icon: 'calendar_today', count: todayCount },
    { id: 'categories', label: t('categories'), icon: 'layers' },
    { id: 'profile', label: t('profile'), icon: 'person' },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) for Add Task */}
      {(currentScreen === 'feed' || currentScreen === 'today' || currentScreen === 'categories') && (
        <button
          aria-label={t('addTask')}
          onClick={() => onNavigate('new_task')}
          className="fixed right-4 bottom-20 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-[0_8px_24px_rgba(70,72,212,0.4)] hover:bg-primary-container active:scale-95 transition-all group"
          title={t('addTask')}
        >
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
        </button>
      )}

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high/40 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] transition-colors relative ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="relative">
                  <span
                    className={`material-symbols-outlined text-[22px] transition-transform ${
                      isActive ? 'scale-110' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.count !== undefined && item.count > 0 && item.id === 'today' && (
                    <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-tight tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary absolute -bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
