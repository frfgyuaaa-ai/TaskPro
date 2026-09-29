import React, { useState, useMemo, useEffect } from 'react';
import { Task, Priority, UserProfile, Category } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';
import { UserAvatar } from '../components/UserAvatar';

interface TasksFeedScreenProps {
  tasks: Task[];
  user: UserProfile;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onTogglePin: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onNewTask: () => void;
  onFixOverdueTask?: (taskId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialCategory?: Category | null;
}

export const TasksFeedScreen: React.FC<TasksFeedScreenProps> = ({
  tasks,
  user,
  onToggleTaskComplete,
  onToggleSubtask,
  onTogglePin,
  onDeleteTask,
  onSelectTask,
  onNewTask,
  onFixOverdueTask,
  isDarkMode,
  onToggleDarkMode,
  initialCategory,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialCategory || 'All');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'alphabetical'>('deadline');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setActiveFilter(initialCategory);
    }
  }, [initialCategory]);

  // Dynamic counts for filters
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      today: tasks.filter(t => t.dueDate.toLowerCase().includes('today') || t.dueDate.toLowerCase().includes('bugun') || t.status === 'in_progress').length,
      high: tasks.filter(t => t.priority === 'high').length,
      overdue: tasks.filter(t => t.isOverdue && t.status !== 'completed').length,
      work: tasks.filter(t => t.category === 'Work').length,
      personal: tasks.filter(t => t.category === 'Personal').length,
      fitness: tasks.filter(t => t.category === 'Fitness').length,
    };
  }, [tasks]);

  const filterChips = [
    { id: 'All', label: `${t('filterAll')} (${counts.all})` },
    { id: 'Today', label: `${t('filterToday')} (${counts.today})` },
    { id: 'High Priority', label: `${t('filterHighPriority')} (${counts.high})`, hasDot: true },
    { id: 'Overdue', label: `${t('filterOverdue')} (${counts.overdue})` },
    { id: 'Work', label: `${t('filterWork')} (${counts.work})` },
    { id: 'Personal', label: `${t('filterPersonal')} (${counts.personal})` },
    { id: 'Fitness', label: `${t('filterFitness')} (${counts.fitness})` },
  ];

  // Filter & Sort logic
  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => {
      // Search
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      // Filter chips
      if (activeFilter === 'Today') {
        return (
          task.dueDate.toLowerCase().includes('today') ||
          task.dueDate.toLowerCase().includes('bugun') ||
          task.status === 'in_progress'
        );
      }
      if (activeFilter === 'High Priority') {
        return task.priority === 'high';
      }
      if (activeFilter === 'Overdue') {
        return task.isOverdue && task.status !== 'completed';
      }
      if (activeFilter === 'Work') {
        return task.category === 'Work';
      }
      if (activeFilter === 'Personal') {
        return task.category === 'Personal';
      }
      if (activeFilter === 'Fitness') {
        return task.category === 'Fitness';
      }
      if (activeFilter === 'Design System') {
        return task.category === 'Design System';
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      // Pinned tasks first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'priority') {
        const order: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      // Default: Overdue first, then normal
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return 0;
    });

    return result;
  }, [tasks, searchQuery, activeFilter, sortBy]);

  const dueTodayCount = tasks.filter(
    t => (t.dueDate.toLowerCase().includes('today') || t.dueDate.toLowerCase().includes('bugun')) && t.status !== 'completed'
  ).length;
  const overdueCount = tasks.filter(t => t.isOverdue && t.status !== 'completed').length;
  const userFirstName = user.name.trim().split(' ')[0] || user.name;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      {/* Interactive Demo Controls & Theme Indicator Pill */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
          <span>{t('syncedApps')}</span>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-xs font-semibold active:scale-95 transition-all shadow-sm hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span>{isDarkMode ? t('lightView') : t('darkView')}</span>
        </button>
      </div>

      {/* Top Hero Greeting customized for user */}
      <section className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            {t('hello')}, {userFirstName} <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h1>
          {/* Mini productivity sparkline badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+14% {t('productivityMetric')}</span>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant flex items-center gap-1.5 flex-wrap">
          <span>
            {t('tasksDueToday')}: <span className="font-semibold text-primary">{dueTodayCount}</span>
          </span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-bold">
              {overdueCount} {t('overduePill')}
            </span>
          )}
        </p>
      </section>

      {/* Quick Search Bar */}
      <div className="relative w-full mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-14 rounded-xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high/50 transition-all"
          placeholder={t('searchPlaceholder')}
          type="text"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold border border-surface-container-highest">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Filter Chips Row (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto no-scrollbar pb-1 mb-3 -mx-4 px-4 flex items-center gap-2">
        {filterChips.map((chip) => {
          const isSelected = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container-high/40'
              }`}
            >
              {chip.hasDot && <span className="w-2 h-2 rounded-full bg-error" />}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Controls and Quick Header Stats */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">swap_vert</span>
              <span className="capitalize">
                {sortBy === 'deadline'
                  ? t('sortDeadline')
                  : sortBy === 'priority'
                  ? t('sortPriority')
                  : t('sortAlphabetical')}
              </span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {showSortDropdown && (
              <div className="absolute left-0 top-10 w-40 bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-xl p-1 z-30">
                <button
                  onClick={() => {
                    setSortBy('deadline');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                    sortBy === 'deadline' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {t('sortDeadline')}
                </button>
                <button
                  onClick={() => {
                    setSortBy('priority');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                    sortBy === 'priority' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {t('sortPriority')}
                </button>
                <button
                  onClick={() => {
                    setSortBy('alphabetical');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                    sortBy === 'alphabetical' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {t('sortAlphabetical')}
                </button>
              </div>
            )}
          </div>

          <span className="text-xs text-on-surface-variant">
            {filteredTasks.length} {t('showing')}
          </span>
        </div>

        <button
          onClick={onNewTask}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-transform hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t('addTask')}</span>
        </button>
      </div>

      {/* TASK CARD FEED */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-surface-container-lowest border border-dashed border-surface-container-high">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">task</span>
            <p className="font-headline font-semibold text-on-surface">{t('noTasksFound')}</p>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
              {t('noTasksDesc')}
            </p>
            <button
              onClick={onNewTask}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95"
            >
              {t('createNewTaskBtn')}
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const totalSubtasks = task.subtasks?.length || 0;
            const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
            const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

            // Border accent color
            let accentColorClass = 'bg-primary-container';
            if (isCompleted) {
              accentColorClass = 'bg-secondary';
            } else if (task.priority === 'high' || task.isOverdue) {
              accentColorClass = 'bg-error';
            } else if (task.category === 'Design System') {
              accentColorClass = 'bg-primary-container';
            }

            return (
              <article
                key={task.id}
                className={`relative flex flex-col rounded-2xl p-4 shadow-sm border border-surface-container-high/40 overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${
                  isCompleted
                    ? 'bg-surface-container-low/70 opacity-90'
                    : 'bg-surface-container-lowest'
                }`}
                onClick={() => onSelectTask(task)}
              >
                {/* Left Accent Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColorClass}`} />

                {/* Top Meta Tags */}
                <div className="flex items-center justify-between pl-1 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Pill */}
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      task.category === 'Fitness'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : task.category === 'Design System'
                        ? 'bg-surface-variant text-on-surface'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {task.category === 'Work'
                        ? t('filterWork')
                        : task.category === 'Personal'
                        ? t('filterPersonal')
                        : task.category === 'Fitness'
                        ? t('filterFitness')
                        : task.category === 'Study'
                        ? t('filterStudy')
                        : task.category}
                    </span>

                    {/* Priority Pill */}
                    {task.priority === 'high' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                        {t('high')}
                      </span>
                    ) : task.priority === 'medium' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase">
                        {t('medium')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase">
                        {t('low')}
                      </span>
                    )}

                    {/* Completed Tag if already completed */}
                    {isCompleted && task.completedAt && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold bg-secondary-container/30 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                        {t('completedAt')} {task.completedAt}
                      </span>
                    )}
                  </div>

                  {/* Pin or Access Icon */}
                  <div className="flex items-center text-on-surface-variant" onClick={(e) => e.stopPropagation()}>
                    <button
                      aria-label="Pin task"
                      onClick={() => onTogglePin(task.id)}
                      className={`p-1 rounded hover:bg-surface-container transition-colors ${
                        task.isPinned ? 'text-primary' : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: task.isPinned ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        push_pin
                      </span>
                    </button>
                  </div>
                </div>

                {/* Title & Main Checkbox */}
                <div className="flex items-start gap-3 pl-1 mb-2">
                  <button
                    aria-label="Toggle completed"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskComplete(task.id);
                    }}
                    className={`task-toggle-btn shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                      isCompleted
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-transparent hover:text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </button>

                  <div className="flex flex-col min-w-0 flex-1">
                    <h2
                      className={`font-headline text-base sm:text-lg font-semibold tracking-tight leading-snug transition-colors ${
                        isCompleted ? 'line-through text-outline' : 'text-on-surface'
                      }`}
                    >
                      {task.title}
                    </h2>
                    <p
                      className={`text-sm mt-0.5 line-clamp-2 ${
                        isCompleted ? 'line-through text-outline' : 'text-on-surface-variant'
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Overdue Callout Badge with quick 1-tap resolve button */}
                {!isCompleted && task.isOverdue && (
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-error-container/60 text-on-error-container text-xs w-full pl-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-error shrink-0">schedule</span>
                      <span className="font-semibold text-error truncate">{t('overdueBy')} 2h</span>
                      <span className="text-on-surface-variant text-[11px] truncate">• {task.dueDate}</span>
                    </div>
                    {onFixOverdueTask && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFixOverdueTask(task.id);
                        }}
                        className="shrink-0 px-2 py-0.5 rounded bg-surface-container-lowest hover:bg-surface text-primary font-bold text-[11px] shadow-2xs transition-all active:scale-95"
                      >
                        ✓ {t('fixOverdue')}
                      </button>
                    )}
                  </div>
                )}

                {/* Due Date & Attachments */}
                {!isCompleted && !task.isOverdue && task.dueDate && (
                  <div className="flex flex-wrap items-center gap-2 pl-1 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md font-medium">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{task.dueDate}</span>
                    </span>
                    {task.attachments && task.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[15px]">attach_file</span>
                        <span>{task.attachments.length} files</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Fitness Metrics Pill if applicable */}
                {task.metrics && (
                  <div className="flex items-center gap-3 pl-1 pt-1 mb-1 text-xs text-on-surface-variant">
                    {task.metrics.calories && (
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-secondary">local_fire_department</span>
                        <span>{task.metrics.calories}</span>
                      </span>
                    )}
                    {task.metrics.duration && (
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">timer</span>
                        <span>{task.metrics.duration}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Checklist Progress Bar Section */}
                {!isCompleted && totalSubtasks > 0 && (
                  <div className="pl-1 mb-2">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">checklist</span>
                        <span>{t('checklistProgress')}</span>
                      </span>
                      <span className={`font-semibold ${subtaskProgress === 100 ? 'text-secondary' : 'text-primary'}`}>
                        {completedSubtasks} {t('completedOf')} {totalSubtasks} ({subtaskProgress}%)
                      </span>
                    </div>
                    {/* Meter */}
                    <div className="w-full h-1.5 sm:h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          subtaskProgress === 100 ? 'bg-secondary' : 'bg-secondary'
                        }`}
                        style={{ width: `${subtaskProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Expandable Checklist Items Preview */}
                {!isCompleted && task.subtasks && task.subtasks.length > 2 && (
                  <div className="flex flex-col gap-1.5 pl-1 py-1.5 mb-2 rounded-xl bg-surface-container/40 px-2.5">
                    {task.subtasks.slice(0, 3).map((sub) => (
                      <div
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSubtask(task.id, sub.id);
                        }}
                        className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            sub.completed ? 'text-secondary' : 'text-outline'
                          }`}
                        >
                          {sub.completed ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span className={sub.completed ? 'line-through text-outline' : 'font-medium text-on-surface'}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Bar: Quick Controls & Collaborators */}
                <div className="flex items-center justify-between pt-2 pl-1 text-on-surface-variant border-t border-surface-container/60 mt-1">
                  {/* Assignees Avatars */}
                  <div className="flex items-center -space-x-1.5">
                    {task.assignees && task.assignees.length > 0 ? (
                      task.assignees.map((assignee, idx) => (
                        <UserAvatar
                          key={idx}
                          name={assignee.name}
                          avatar={assignee.avatar}
                          size="sm"
                          className="ring-2 ring-surface"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-outline">Unassigned</span>
                    )}
                    {task.assignees && task.assignees.length > 2 && (
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] text-on-surface font-bold ring-2 ring-surface">
                        +{task.assignees.length - 2}
                      </span>
                    )}
                    {task.assignees && task.assignees.length === 1 && (
                      <span className="text-xs text-on-surface-variant ml-2 pl-1">
                        {t('assignedTo')} {task.assignees[0].name.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      aria-label="Edit Task"
                      onClick={() => onSelectTask(task)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container hover:text-primary transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[19px]">edit</span>
                    </button>
                    <button
                      aria-label="Delete Task"
                      onClick={() => onDeleteTask(task.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error-container hover:text-error transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[19px]">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Ambient Productivity Tip Pill */}
      <div className="mt-6 flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-high/60 border border-surface-container-high text-on-surface-variant">
        <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">tips_and_updates</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-on-surface">{t('dailyMomentum')}</span>
          <span className="text-xs text-on-surface-variant">
            {t('dailyMomentumText')}
          </span>
        </div>
      </div>
    </div>
  );
};
