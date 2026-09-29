import React, { useState } from 'react';
import { Category, Priority, Subtask, Task, Attachment } from '../types/task';
import { SARAH_AVATAR, COLLEAGUE_1 } from '../data/initialTasks';
import { useTranslation } from '../i18n/LanguageContext';

interface NewTaskScreenProps {
  onSaveTask: (task: Task) => void;
  onCancel: () => void;
  editingTask?: Task | null;
}

export const NewTaskScreen: React.FC<NewTaskScreenProps> = ({
  onSaveTask,
  onCancel,
  editingTask,
}) => {
  const { t } = useTranslation();
  const [taskName, setTaskName] = useState(
    editingTask?.title || 'Design System Architecture Review'
  );
  const [category, setCategory] = useState<Category>(
    editingTask?.category || 'Work'
  );
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority || 'high'
  );
  const [selectedPreset, setSelectedPreset] = useState<string>('Tomorrow');
  const [dateStr, setDateStr] = useState(editingTask?.dueDate || 'Oct 24, 2024');
  const [timeStr, setTimeStr] = useState(editingTask?.dueTime || '03:00 PM');
  const [reminderEnabled, setReminderEnabled] = useState(
    editingTask?.reminder?.enabled ?? true
  );
  const [reminderTiming, setReminderTiming] = useState(
    editingTask?.reminder?.timing || '30m'
  );
  const [description, setDescription] = useState(
    editingTask?.description ||
      'Standardize color semantics for high-contrast accessibility tokens across Web and iOS applications.'
  );

  const [subtasks, setSubtasks] = useState<Subtask[]>(
    editingTask?.subtasks || [
      { id: 'st-sketch', title: 'Prepare wireframe sketches', completed: true },
      { id: 'st-type', title: 'Review typography scale', completed: false },
    ]
  );
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const [attachments, setAttachments] = useState<Attachment[]>(
    editingTask?.attachments || [
      { id: 'att-arch', name: 'arch_guidelines_v2.pdf', size: '2.4 MB', type: 'application/pdf' },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Subtask helpers
  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newItem: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskText.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newItem]);
    setNewSubtaskText('');
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAtt: Attachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/octet-stream',
      };
      setAttachments((prev) => [...prev, newAtt]);
    }
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmittedSuccess(true);
      setTimeout(() => {
        const newTask: Task = {
          id: editingTask?.id || `task-${Date.now()}`,
          title: taskName.trim(),
          description: description.trim() || 'No description provided',
          fullDescription: description.trim(),
          category,
          priority,
          status: editingTask?.status || 'todo',
          dueDate: dateStr,
          dueTime: timeStr,
          isOverdue: false,
          isPinned: editingTask?.isPinned || false,
          subtasks,
          attachments,
          assignees: editingTask?.assignees || [
            { name: 'Sarah Connor', avatar: SARAH_AVATAR },
            { name: 'Elena Rostova', avatar: COLLEAGUE_1 },
          ],
          reminder: {
            enabled: reminderEnabled,
            timing: reminderTiming,
          },
          tags: [category, priority === 'high' ? 'Urgent' : 'Standard'],
        };
        onSaveTask(newTask);
      }, 600);
    }, 500);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-28 pt-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Card Container */}
        <div className="w-full bg-surface-container-lowest border border-surface-container-high/60 backdrop-blur-xl rounded-2xl p-4 shadow-sm space-y-4">
          {/* Header Meta & Quick Status Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {editingTask ? t('editActionItem') : t('newActionItem')}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              {t('draftSaved')}
            </span>
          </div>

          {/* Task Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant" htmlFor="task-title-input">
              {t('taskNameLabel')}
            </label>
            <div className="relative bg-surface-container-low rounded-xl px-3.5 py-2.5 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 border border-surface-container-high/40 transition-all">
              <input
                id="task-title-input"
                className="w-full bg-transparent font-headline text-base sm:text-lg font-semibold text-on-surface placeholder:text-outline focus:outline-none"
                placeholder={t('taskNamePlaceholder')}
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-on-surface-variant">{t('categoryLabel')}</span>
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {[
                { name: 'Work' as Category, label: t('filterWork'), icon: 'terminal' },
                { name: 'Personal' as Category, label: t('filterPersonal'), icon: 'person' },
                { name: 'Study' as Category, label: t('filterStudy'), icon: 'school' },
                { name: 'Fitness' as Category, label: t('filterFitness'), icon: 'fitness_center' },
              ].map((cat) => {
                const isActive = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setCategory('Design System')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  category === 'Design System'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">layers</span>
                <span>Design System</span>
              </button>
            </div>
          </div>

          {/* Priority Level Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">{t('priorityLabel')}</span>
              <span
                className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  priority === 'high'
                    ? 'bg-error-container text-on-error-container'
                    : priority === 'medium'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {priority === 'high'
                  ? t('criticalAttention')
                  : priority === 'medium'
                  ? t('standardVelocity')
                  : t('flexibleWindow')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-container-high/40">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  priority === 'low'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                <span>{t('low')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  priority === 'medium'
                    ? 'bg-surface-container-lowest text-amber-600 shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t('medium')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  priority === 'high'
                    ? 'bg-surface-container-lowest text-error shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
                </span>
                <span>{t('high')}</span>
              </button>
            </div>
          </div>

          {/* Due Date & Time Picker Section */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-on-surface-variant">{t('dueDateTimeLabel')}</span>
            {/* Preset Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              {[
                { id: 'Today', label: t('presetToday') },
                { id: 'Tomorrow', label: t('presetTomorrow') },
                { id: 'This Weekend', label: t('presetWeekend') },
                { id: 'Next Week', label: t('presetNextWeek') },
              ].map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      if (preset.id === 'Today') setDateStr('Today, Oct 24');
                      if (preset.id === 'Tomorrow') setDateStr('Oct 25, 2024');
                      if (preset.id === 'This Weekend') setDateStr('Oct 26, 2024');
                      if (preset.id === 'Next Week') setDateStr('Nov 02, 2024');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container shadow-xs font-semibold'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Specific Date & Hour Selectors */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container-high/40">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase font-bold text-on-surface-variant">{t('dateLabel')}</span>
                  <input
                    className="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none"
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container-high/40">
                <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase font-bold text-on-surface-variant">{t('timeLabel')}</span>
                  <input
                    className="w-full bg-transparent text-xs font-semibold text-on-surface focus:outline-none"
                    type="text"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reminder Toggle & Timing */}
          <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">notifications_active</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">{t('remindMe')}</span>
                <span className="text-[11px] text-on-surface-variant">
                  {reminderTiming === '30m' ? `30 ${t('minutesBefore')}` : `${reminderTiming} ${t('before')}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={reminderTiming}
                onChange={(e) => setReminderTiming(e.target.value)}
                className="bg-surface-container text-xs font-semibold px-2 py-1 rounded-lg text-on-surface outline-none cursor-pointer border border-surface-container-high"
              >
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="1h">1h</option>
                <option value="1d">1d</option>
              </select>

              {/* Custom Switch */}
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`w-11 h-6 rounded-full relative p-0.5 transition-colors ${
                  reminderEnabled ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Description Textarea with Toolbar */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-on-surface-variant">{t('descriptionLabel')}</span>
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-high/40">
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-container border-b border-surface-container-high/40 text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => setDescription((prev) => prev + ' **bold**')}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescription((prev) => prev + '\n- Item')}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescription((prev) => prev + ' [link](https://...)')}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescription((prev) => prev + ' `code`')}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">code</span>
                </button>
              </div>
              <textarea
                className="w-full bg-transparent px-3 py-2 text-xs leading-relaxed text-on-surface placeholder:text-outline focus:outline-none resize-none"
                placeholder={t('descriptionPlaceholder')}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Checklist & Subtasks Creator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">{t('subtasksLabel')}</span>
              <span className="text-xs font-bold text-primary">
                {completedSubtasksCount} / {subtasks.length} {t('subtasksCompleted')}
              </span>
            </div>

            {/* List */}
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl border border-surface-container-high/40 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleSubtask(st.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        st.completed
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-highest text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <span
                      className={`text-xs truncate select-none ${
                        st.completed ? 'line-through text-outline' : 'text-on-surface font-medium'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(st.id)}
                    className="text-outline hover:text-error transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high/40 focus-within:bg-surface-container-lowest transition-all">
              <input
                className="flex-1 bg-transparent text-xs text-on-surface placeholder:text-outline focus:outline-none"
                placeholder={t('addSubtaskPlaceholder')}
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>

          {/* Attachments Upload Dropzone */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-on-surface-variant">{t('attachmentsLabel')}</span>
            <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low border border-dashed border-surface-container-highest hover:bg-surface-container transition-all text-center cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-1">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </div>
              <span className="text-xs font-semibold text-on-surface">{t('attachDropzone')}</span>
              <span className="text-[11px] text-outline">{t('attachSupported')}</span>
            </label>

            {/* Attached file list */}
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-surface-container-high/40"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <span className="text-xs font-semibold text-on-surface truncate">{att.name}</span>
                    <span className="text-[10px] text-outline">{att.size} • {t('uploadedPill')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-outline hover:text-error p-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Fixed Action Row */}
        <div className="w-full flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all active:scale-[0.98]"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-[2] py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              isSubmittedSuccess
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>{t('deploying')}</span>
              </>
            ) : isSubmittedSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                <span>{t('taskCreatedSuccess')}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>{editingTask ? t('saveChangesCTA') : t('createTaskCTA')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
