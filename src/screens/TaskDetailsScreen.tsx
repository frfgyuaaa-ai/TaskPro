import React, { useState, useEffect } from 'react';
import { Task, Subtask, ActivityItem, UserProfile } from '../types/task';
import { SARAH_AVATAR } from '../data/initialTasks';
import { useTranslation } from '../i18n/LanguageContext';
import { UserAvatar } from '../components/UserAvatar';

interface TaskDetailsScreenProps {
  task: Task;
  user?: UserProfile;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onBack: () => void;
}

export const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({
  task,
  user,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onBack,
}) => {
  const { t } = useTranslation();
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [showMenu, setShowMenu] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(task.title);

  useEffect(() => {
    setCurrentTask(task);
    setTitleText(task.title);
  }, [task]);

  const isCompleted = currentTask.status === 'completed';
  const subtasks = currentTask.subtasks || [];
  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle main status
  const handleToggleMainStatus = () => {
    const nextStatus = isCompleted ? 'in_progress' : 'completed';
    const updated: Task = {
      ...currentTask,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? 'Just now' : undefined,
      isOverdue: nextStatus === 'completed' ? false : currentTask.isOverdue,
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  // Toggle subtask
  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    const updated: Task = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  // Remove subtask
  const handleRemoveSubtask = (subId: string) => {
    const updatedSubtasks = subtasks.filter((s) => s.id !== subId);
    const updated: Task = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  // Add Subtask
  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSub: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskText.trim(),
      completed: false,
    };
    const updated: Task = {
      ...currentTask,
      subtasks: [...subtasks, newSub],
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewSubtaskText('');
  };

  // Add Comment/Activity
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const authorName = user?.name || 'Siz';
    const authorAvatar = user?.avatar || '';
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      text: newCommentText.trim(),
      time: 'Hozirgina',
    };
    const updated: Task = {
      ...currentTask,
      activities: [newActivity, ...(currentTask.activities || [])],
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewCommentText('');
  };

  // Quick fix overdue (clears error and sets date to today on schedule)
  const handleQuickFixOverdue = () => {
    const updated: Task = {
      ...currentTask,
      dueDate: 'Bugun, 18:00',
      isOverdue: false,
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setShowRescheduleModal(false);
  };

  // Reschedule
  const handleReschedule = (newDate: string) => {
    const updated: Task = {
      ...currentTask,
      dueDate: newDate,
      isOverdue: false,
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setShowRescheduleModal(false);
  };

  // Save title edit
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (!titleText.trim()) {
      setTitleText(currentTask.title);
      return;
    }
    const updated = { ...currentTask, title: titleText.trim() };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const primaryAssignee = currentTask.assignees?.[0] || {
    name: user?.name || 'Sarah Connor',
    avatar: user?.avatar || SARAH_AVATAR,
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-32 pt-2">
      {/* Top Utility Context Bar */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
          <span onClick={onBack} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{t('projects')}</span>
          </span>
          <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
          <span className="text-primary font-semibold truncate max-w-[150px]">{currentTask.project || 'Reja'}</span>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            aria-label="Task options"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-44 bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-xl p-1.5 z-30">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEditTask(currentTask);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>{t('editBtn')}</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleQuickFixOverdue();
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-secondary hover:bg-secondary-container/30 rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{t('fixOverdue')}</span>
              </button>
              <div className="h-px bg-surface-container my-1" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDeleteTask(currentTask.id);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/30 rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>{t('deleteTask')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Task Header Area */}
      <div className="pt-1 flex flex-col gap-2">
        {/* Status Toggle + Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle task status"
              onClick={handleToggleMainStatus}
              className={`group relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 active:scale-95 ${
                isCompleted
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container hover:bg-secondary-fixed text-transparent hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
            </button>
            <span
              className={`text-xs font-bold ${
                isCompleted ? 'text-secondary' : 'text-on-surface-variant'
              }`}
            >
              {isCompleted ? t('completedStatus') : t('inProgress')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* High Priority Pill */}
            {currentTask.priority === 'high' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container/70 text-error text-[11px] font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(186,26,26,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                {t('high')}
              </span>
            )}
            {/* Category Tag */}
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-bold uppercase">
              {currentTask.category}
            </span>
          </div>
        </div>

        {/* Editable Title */}
        <div className="flex items-start gap-2 mt-1">
          {isEditingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                className="w-full bg-surface-container-low px-2 py-1 rounded-lg font-headline text-xl sm:text-2xl font-semibold text-on-surface outline-none border border-primary"
              />
              <button
                onClick={handleSaveTitle}
                className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold"
              >
                Saqlash
              </button>
            </div>
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className={`font-headline text-xl sm:text-2xl font-semibold text-on-surface tracking-tight leading-snug flex-1 p-1 rounded-lg hover:bg-surface-container-low transition-colors cursor-text ${
                isCompleted ? 'line-through text-outline' : ''
              }`}
              title="Sarlavhani tahrirlash uchun bosing"
            >
              {currentTask.title}
            </h1>
          )}
          <button
            aria-label="Edit title hint"
            onClick={() => setIsEditingTitle(true)}
            className="mt-1 text-on-surface-variant/40 hover:text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </div>

      {/* Overdue Alert Banner if active + 1-Click Fix */}
      {!isCompleted && currentTask.isOverdue && (
        <div className="mt-4">
          <div className="relative overflow-hidden rounded-xl bg-error-container/30 border border-error-container/60 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-xs font-bold text-error tracking-tight truncate">
                  {t('overdueWarning')} (Kechikkan deb belgilangan)
                </div>
                <div className="text-[11px] text-on-error-container/90 truncate">
                  Ushbu vazifani to‘g‘rilash uchun bir marta bosing
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleQuickFixOverdue}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{t('fixOverdue')}</span>
              </button>
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-sm hover:bg-surface transition-all active:scale-95"
              >
                {t('rescheduleBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-5 shadow-2xl border border-surface-container-high space-y-4">
            <h3 className="font-headline font-semibold text-base text-on-surface">{t('rescheduleTitle')}</h3>
            <p className="text-xs text-on-surface-variant">{t('rescheduleDesc')}</p>
            <div className="space-y-2">
              <button
                onClick={() => handleReschedule('Bugun, 18:00')}
                className="w-full text-left px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary flex items-center justify-between"
              >
                <span>Bugun, 18:00 (Xatolikni to‘g‘rilash)</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </button>
              <button
                onClick={() => handleReschedule('Ertaga, 15:00')}
                className="w-full text-left px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-between"
              >
                <span>Ertaga, 15:00</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
              <button
                onClick={() => handleReschedule('Juma, 17:00')}
                className="w-full text-left px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-between"
              >
                <span>Bu juma, 17:00</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
              <button
                onClick={() => handleReschedule('Dushanba, 10:00')}
                className="w-full text-left px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-between"
              >
                <span>Keyingi dushanba, 10:00</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Bento Grid */}
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Due Date */}
          <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className={`material-symbols-outlined text-[18px] ${currentTask.isOverdue ? 'text-error' : 'text-primary'}`}>
                calendar_clock
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('sortDeadline')}</span>
            </div>
            <div className="text-xs font-bold text-on-surface truncate">{currentTask.dueDate}</div>
            <div className="text-[11px] text-on-surface-variant">{currentTask.dueTime || '15:00'}</div>
          </div>

          {/* Reminder */}
          <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-tertiary">notifications_active</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('reminderLabel')}</span>
            </div>
            <div className="text-xs font-bold text-on-surface">
              {currentTask.reminder?.timing ? `${currentTask.reminder.timing} ${t('before')}` : `15 ${t('minutesBefore')}`}
            </div>
            <div className="text-[11px] text-on-surface-variant">{t('mobilePushEmail')}</div>
          </div>

          {/* Assignee */}
          <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">person</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('assigneeLabel')}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <UserAvatar
                name={primaryAssignee.name}
                avatar={primaryAssignee.avatar}
                size="sm"
              />
              <span className="text-xs font-bold text-on-surface truncate">
                {primaryAssignee.name}
              </span>
            </div>
          </div>

          {/* Tags & Category */}
          <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-1 justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-secondary">label</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('tagCategory')}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(currentTask.tags || ['Reja', currentTask.category]).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant text-[10px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div className="mt-4">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">{t('descriptionSection')}</span>
            <button
              onClick={() => onEditTask(currentTask)}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </button>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            {currentTask.fullDescription || currentTask.description}
          </p>
        </div>
      </div>

      {/* Subtasks / Checklist Section */}
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-sm font-semibold text-on-surface flex items-center gap-1.5">
              <span>{t('subtasksLabel')}</span>
              <span className="text-xs text-on-surface-variant font-normal">
                ({completedCount} of {totalCount} {t('completedStatus').toLowerCase()})
              </span>
            </h3>
            <span className="text-xs font-bold text-secondary">{progressPercent}%</span>
          </div>
          {/* Animated Progress Bar */}
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist Item Stack */}
        <div className="flex flex-col gap-1.5 mt-1">
          {subtasks.map((st) => (
            <div
              key={st.id}
              className="group flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low border border-surface-container-high/40 hover:bg-surface-container transition-all"
            >
              <button
                type="button"
                onClick={() => handleToggleSubtask(st.id)}
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  st.completed
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-highest text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
              <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
                <span
                  className={`text-xs select-none transition-all ${
                    st.completed ? 'line-through text-outline' : 'text-on-surface font-medium'
                  }`}
                >
                  {st.title}
                </span>
                {st.isUrgent && !st.completed && (
                  <span className="px-1.5 py-0.2 rounded bg-error-container text-error text-[10px] font-bold">
                    {t('urgentBadge')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-error transition-all p-0.5"
                aria-label="Remove subtask"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add Subtask */}
        <div className="flex items-center gap-2 mt-1">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">
              add_task
            </span>
            <input
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-surface-container text-on-surface text-xs placeholder:text-outline outline-none border border-surface-container-high/40 focus:bg-surface-container-high transition-colors"
              placeholder={t('addSubtaskPlaceholder')}
              type="text"
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
          </div>
          <button
            onClick={handleAddSubtask}
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-all active:scale-95 shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Activity & Notes Timeline */}
      <div className="mt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-headline text-sm font-semibold text-on-surface">{t('activityNotes')}</span>
          <span className="text-xs text-on-surface-variant">
            {(currentTask.activities?.length || 0)} {t('updatesCount')}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {currentTask.activities?.map((act) => (
            <div key={act.id} className="flex items-start gap-2.5">
              {act.isSystem ? (
                <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                </div>
              ) : (
                <UserAvatar
                  name={act.author}
                  avatar={act.avatar}
                  size="sm"
                  className="mt-0.5"
                />
              )}
              <div className="flex flex-col flex-1 p-2.5 rounded-xl bg-surface-container border border-surface-container-high/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">{act.author}</span>
                  <span className="text-[10px] text-on-surface-variant">{act.time}</span>
                </div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    act.isSystem ? 'text-error' : 'text-on-surface-variant'
                  }`}
                >
                  {act.text}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Comment Input */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder={t('addNotePlaceholder')}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              className="flex-1 h-9 px-3 rounded-xl bg-surface-container-low border border-surface-container-high/50 text-xs text-on-surface placeholder:text-outline focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="h-9 px-3 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold transition-all"
            >
              {t('postNote')}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-surface-container-high/50 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <button
            onClick={handleToggleMainStatus}
            className={`flex-1 h-12 rounded-xl font-headline font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              isCompleted
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-secondary hover:bg-on-secondary-container text-on-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCompleted ? 'task_alt' : 'check_circle'}
            </span>
            <span>{isCompleted ? t('completedBanner') : t('markAsCompleted')}</span>
          </button>
          <button
            onClick={() => onEditTask(currentTask)}
            className="h-12 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-dim text-on-surface font-headline font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span>{t('editBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
