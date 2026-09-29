import React, { useState, useEffect } from 'react';
import { Screen, Task, UserProfile, Category } from './types/task';
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
import {
  getCurrentAccount,
  getAccountTasks,
  saveAccountTasks,
  saveAccount,
  isUserLoggedIn,
  setSessionLoggedIn,
  Account,
} from './utils/accountManager';

const THEME_STORAGE_KEY = 'taskpro_theme_v1';

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

  // User state - persistent by active account
  const [user, setUser] = useState<UserProfile>(() => {
    return getCurrentAccount();
  });

  // Tasks state - persistent per account
  const [tasks, setTasks] = useState<Task[]>(() => {
    const acc = getCurrentAccount();
    return getAccountTasks(acc.id, acc.name);
  });

  // Persistent login state - user NEVER gets kicked out
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return isUserLoggedIn();
  });

  // Save tasks for current user account
  useEffect(() => {
    if (user && user.id) {
      saveAccountTasks(user.id, tasks);
    }
  }, [tasks, user]);

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
      prev.map((taskItem) => {
        if (taskItem.id === taskId) {
          const isDone = taskItem.status === 'completed';
          const nextStatus = isDone ? 'in_progress' : 'completed';
          const completedAt = nextStatus === 'completed' ? 'Just now' : undefined;
          showToast(nextStatus === 'completed' ? '✓ ' + t('completedStatus') : 'Qayta ochildi');
          return {
            ...taskItem,
            status: nextStatus,
            completedAt,
            isOverdue: nextStatus === 'completed' ? false : taskItem.isOverdue,
          };
        }
        return taskItem;
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
    showToast('Qadalgan holat yangilandi');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setCurrentScreen('feed');
    }
    showToast('Vazifa o‘chirildi');
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
    showToast('✓ Saqlandi');
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

  // Fix overdue / remove error
  const handleFixOverdueTask = (taskId?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (!taskId || t.id === taskId) {
          return {
            ...t,
            isOverdue: false,
            dueDate: 'Bugun, 18:00',
          };
        }
        return t;
      })
    );

    if (selectedTask && (!taskId || selectedTask.id === taskId)) {
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              isOverdue: false,
              dueDate: 'Bugun, 18:00',
            }
          : null
      );
    }

    showToast('✓ ' + (t('fixedOverdueToast') || 'Muddat yangilandi va xatolik yo‘qotildi!'));
  };

  // Login / Signup success handler
  const handleLoginSuccess = (newUser: UserProfile, initialTasks?: Task[]) => {
    setUser(newUser);
    if (initialTasks && initialTasks.length > 0) {
      setTasks(initialTasks);
    } else if (newUser.id) {
      setTasks(getAccountTasks(newUser.id, newUser.name));
    }
    setIsLoggedIn(true);
    setSessionLoggedIn(true);
    setCurrentScreen('feed');
    showToast(`Salom, ${newUser.name.split(' ')[0]}!`);
  };

  // Update User Profile
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    const acc: Account = {
      id: updated.id || user.id || `user-${Date.now()}`,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar,
      avatarColor: updated.avatarColor,
      appsConnected: updated.appsConnected,
      createdAt: Date.now(),
    };
    saveAccount(acc);

    // Synchronize tasks assignees to match updated name and avatar
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        assignees: t.assignees?.map((a) =>
          a.name === user.name
            ? { ...a, name: updated.name, avatar: updated.avatar }
            : a
        ),
      }))
    );

    showToast('✓ ' + (t('profileUpdated') || 'Profil muvaffaqiyatli saqlandi!'));
  };

  // Switch between existing accounts
  const handleSwitchAccount = (targetAccount: Account) => {
    setUser(targetAccount);
    localStorage.setItem('taskpro_current_account_id', targetAccount.id);
    const accTasks = getAccountTasks(targetAccount.id, targetAccount.name);
    setTasks(accTasks);
    showToast(`Hisobga ulandi: ${targetAccount.name}`);
  };

  const handleLogout = () => {
    setSessionLoggedIn(false);
    setIsLoggedIn(false);
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
    (t) => t.dueDate.toLowerCase().includes('today') || t.dueDate.toLowerCase().includes('bugun') || t.status === 'in_progress'
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

      {/* Render Auth Screen as standalone without standard shell if user explicitly logged out or chose switch */}
      {!isLoggedIn || currentScreen === 'auth' ? (
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onCancel={
            isLoggedIn
              ? () => {
                  setCurrentScreen('feed');
                }
              : undefined
          }
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
            tasks={tasks}
            onFixOverdueTask={handleFixOverdueTask}
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
                user={user}
                onToggleTaskComplete={handleToggleTaskComplete}
                onToggleSubtask={handleToggleSubtask}
                onTogglePin={handleTogglePin}
                onDeleteTask={handleDeleteTask}
                onSelectTask={handleSelectTask}
                onNewTask={handleNewTask}
                onFixOverdueTask={handleFixOverdueTask}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            )}

            {currentScreen === 'new_task' && (
              <NewTaskScreen
                onSaveTask={handleSaveTask}
                user={user}
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
                user={user}
                onUpdateTask={(updated) => {
                  setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                  setSelectedTask(updated);
                  showToast('Yangilandi');
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
                onSelectCategory={(_category: Category) => {
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
                onUpdateUser={handleUpdateUser}
                onSwitchAccount={handleSwitchAccount}
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
