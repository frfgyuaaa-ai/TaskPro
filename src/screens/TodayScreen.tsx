import React from 'react';
import { Task } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';

interface TodayScreenProps {
  tasks: Task[];
  onToggleTaskComplete: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onNewTask: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  tasks,
  onToggleTaskComplete,
  onSelectTask,
  onNewTask,
}) => {
  const { t } = useTranslation();
  const todayTasks = tasks.filter(
    (t) => t.dueDate.toLowerCase().includes('today') || t.status === 'in_progress'
  );
  const completedToday = todayTasks.filter((t) => t.status === 'completed').length;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-bold text-primary tracking-wider">
            {t('dailyFocus')}
          </span>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            {t('todaysSchedule')}
          </h1>
          <p className="text-xs text-on-surface-variant">
            Thursday, Oct 24 • {todayTasks.length} {t('tasksCount')}
          </p>
        </div>
        <button
          onClick={onNewTask}
          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-sm flex items-center gap-1 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t('addTask')}</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-on-surface">{t('dailyVelocity')}</span>
          <p className="text-xs text-on-surface-variant">
            {completedToday} {t('completedOf')} {todayTasks.length}
          </p>
          <div className="w-48 h-2 rounded-full bg-surface-container overflow-hidden mt-1">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="w-14 h-14 rounded-full border-4 border-secondary/30 flex items-center justify-center font-headline font-bold text-sm text-secondary bg-secondary-container/20">
          {progressPercent}%
        </div>
      </div>

      {/* Tasks List for Today */}
      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high">
            <p className="text-sm font-semibold text-on-surface">{t('allCaughtUp')}</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {t('upcomingDeadlines')}
            </p>
          </div>
        ) : (
          todayTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-surface-container-low border-surface-container-high opacity-80'
                    : 'bg-surface-container-lowest border-surface-container-high/60 shadow-xs hover:shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTaskComplete(task.id);
                  }}
                  className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-transparent hover:text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-surface-container text-on-surface-variant">
                      {task.category}
                    </span>
                    <span className="text-xs text-outline">•</span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {task.dueTime || 'All Day'}
                    </span>
                    {task.isOverdue && !isCompleted && (
                      <span className="text-[10px] font-bold text-error px-1.5 py-0.2 rounded bg-error-container">
                        {t('overduePill')}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-headline text-sm font-semibold leading-snug truncate ${
                      isCompleted ? 'line-through text-outline' : 'text-on-surface'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
