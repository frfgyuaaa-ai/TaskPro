import React, { useState, useEffect } from 'react';
import { Screen, Task, UserProfile, Category } from './types/task';
import { INITIAL_TASKS, CURRENT_USER } from './data/initialTasks';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TasksFeedScreen } from './screens/TasksFeedScreen';
import { NewTaskScreen } from './screens/NewTaskScreen';
import { TaskDetailsScreen } from './screens/TaskDetailsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { TodayScreen } from './screens/TodayScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';

const TASKS_STORAGE_KEY = 'taskpro_tasks_v1';
const THEME_STORAGE_KEY = 'taskpro_theme_v1';
const USER_STORAGE_KEY = 'taskpro_user_v1';

function AppContent() {
  const { t } = useTranslation();

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  }, [tasks]);

  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<Screen>('feed');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Task actions
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'completed';
          const nextStatus = isDone ? 'in_progress' : 'completed';
          const completedAt = nextStatus === 'completed' ? 'Just now' : undefined;
          showToast(nextStatus === 'completed' ? '✓ ' + (t.status ? 'Completed' : 'Done') : 'Reopened');
          return {
            ...t,
            status: nextStatus,
            completedAt,
            isOverdue: nextStatus === 'completed' ? false : t.isOverdue,
          };
        }
        return t;
      })
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'completed' ? 'in_progress' : 'completed',
              completedAt: prev.status === 'completed' ? undefined : 'Just now',
            }
          : null
      );
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const handleTogglePin = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isPinned: !t.isPinned } : t))
    );
    showToast('Pin updated');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setCurrentScreen('feed');
    }
    showToast('Task removed');
  };

  const handleSaveTask = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [task, ...prev];
    });
    setEditingTask(null);
    setSelectedTask(task);
    setCurrentScreen('task_details');
    showToast('✓ Saved');
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('task_details');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentScreen('new_task');
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setCurrentScreen('new_task');
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setCurrentScreen('feed');
    showToast(`Salom, ${newUser.name.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    setCurrentScreen('auth');
    showToast('Tizimdan chiqildi');
  };

  // Header screen titles translated
  let screenTitle = 'TaskPro';
  if (currentScreen === 'new_task') {
    screenTitle = editingTask ? t('editActionItem') : t('newActionItem');
  } else if (currentScreen === 'task_details') {
    screenTitle = 'Task Details';
  } else if (currentScreen === 'today') {
    screenTitle = t('today');
  } else if (currentScreen === 'categories') {
    screenTitle = t('categories');
  } else if (currentScreen === 'profile') {
    screenTitle = t('profile');
  }

  // Count of tasks due today
  const dueTodayCount = tasks.filter(
    (t) => t.dueDate.toLowerCase().includes('today') || t.status === 'in_progress'
  ).length;

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-on-surface text-surface font-semibold text-xs shadow-xl animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render Auth Screen as standalone without standard shell if active */}
      {currentScreen === 'auth' ? (
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : (
        <>
          {/* Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            user={user}
            title={screenTitle}
            onBack={() => {
              if (currentScreen === 'new_task' && selectedTask) {
                setCurrentScreen('task_details');
              } else {
                setCurrentScreen('feed');
              }
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full pt-16">
            {currentScreen === 'feed' && (
              <TasksFeedScreen
                tasks={tasks}
                onToggleTaskComplete={handleToggleTaskComplete}
                onToggleSubtask={handleToggleSubtask}
                onTogglePin={handleTogglePin}
                onDeleteTask={handleDeleteTask}
                onSelectTask={handleSelectTask}
                onNewTask={handleNewTask}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            )}

            {currentScreen === 'new_task' && (
              <NewTaskScreen
                onSaveTask={handleSaveTask}
                onCancel={() => {
                  if (selectedTask) {
                    setCurrentScreen('task_details');
                  } else {
                    setCurrentScreen('feed');
                  }
                }}
                editingTask={editingTask}
              />
            )}

            {currentScreen === 'task_details' && selectedTask && (
              <TaskDetailsScreen
                task={selectedTask}
                onUpdateTask={(updated) => {
                  setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                  setSelectedTask(updated);
                  showToast('Updated');
                }}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onBack={() => setCurrentScreen('feed')}
              />
            )}

            {currentScreen === 'today' && (
              <TodayScreen
                tasks={tasks}
                onToggleTaskComplete={handleToggleTaskComplete}
                onSelectTask={handleSelectTask}
                onNewTask={handleNewTask}
              />
            )}

            {currentScreen === 'categories' && (
              <CategoriesScreen
                tasks={tasks}
                onSelectCategory={(category: Category) => {
                  setCurrentScreen('feed');
                }}
                onSelectTask={handleSelectTask}
                onNewTask={handleNewTask}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                user={user}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onLogout={handleLogout}
                completedTasksCount={completedCount}
                totalTasksCount={tasks.length}
              />
            )}
          </main>

          {/* Bottom Navigation & Floating Action Button */}
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            todayCount={dueTodayCount}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
