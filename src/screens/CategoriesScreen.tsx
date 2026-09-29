import React from 'react';
import { Task, Category } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';

interface CategoriesScreenProps {
  tasks: Task[];
  onSelectCategory: (category: Category) => void;
  onSelectTask: (task: Task) => void;
  onNewTask: () => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  tasks,
  onSelectCategory,
  onSelectTask,
  onNewTask,
}) => {
  const { t } = useTranslation();

  const categories: { name: Category; label: string; icon: string; color: string; bg: string }[] = [
    { name: 'Work', label: t('filterWork'), icon: 'terminal', color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Design System', label: 'Design System', icon: 'layers', color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { name: 'Fitness', label: t('filterFitness'), icon: 'fitness_center', color: 'text-secondary', bg: 'bg-secondary/10' },
    { name: 'Personal', label: t('filterPersonal'), icon: 'person', color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { name: 'Study', label: t('filterStudy'), icon: 'school', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-bold text-primary tracking-wider">
            {t('workspaceHub')}
          </span>
          <h1 className="font-headline text-2xl font-bold text-on-surface">{t('categoriesTitle')}</h1>
          <p className="text-xs text-on-surface-variant">{t('categoriesDesc')}</p>
        </div>
        <button
          onClick={onNewTask}
          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-sm flex items-center gap-1 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t('addTask')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {categories.map((cat) => {
          const categoryTasks = tasks.filter((t) => t.category === cat.name);
          const completedCount = categoryTasks.filter((t) => t.status === 'completed').length;
          const totalCount = categoryTasks.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors flex items-center">
                  <span>{totalCount} {t('tasksCount')}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>

              <div>
                <h3 className="font-headline text-base font-semibold text-on-surface">{cat.label}</h3>
                <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 mb-1">
                  <span>{t('progress')}</span>
                  <span className="font-semibold text-secondary">{percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
