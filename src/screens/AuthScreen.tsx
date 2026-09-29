import React, { useState } from 'react';
import { TASKPRO_LOGO } from '../data/initialTasks';
import { UserProfile, Task } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { UserAvatar } from '../components/UserAvatar';
import { registerAccount, loginAccount, getStoredAccounts, Account } from '../utils/accountManager';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile, initialTasks?: Task[]) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const existingAccounts = getStoredAccounts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Iltimos, elektron pochta manzilingizni kiriting");
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage("Iltimos, ismingizni kiriting");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup') {
        const { account, tasks } = registerAccount(fullName, cleanEmail, password);
        onLoginSuccess(account, tasks);
      } else {
        const { account, tasks } = loginAccount(cleanEmail, password, fullName || cleanEmail.split('@')[0]);
        onLoginSuccess(account, tasks);
      }
    }, 350);
  };

  const handleSelectExisting = (acc: Account) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const { account, tasks } = loginAccount(acc.email, acc.password, acc.name);
      onLoginSuccess(account, tasks);
    }, 250);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const generatedName = fullName.trim() || `${provider} Foydalanuvchisi`;
      const generatedEmail = email.trim() || `user.${Date.now().toString().slice(-4)}@${provider.toLowerCase()}.com`;
      const { account, tasks } = registerAccount(generatedName, generatedEmail);
      onLoginSuccess(account, tasks);
    }, 350);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const { account, tasks } = registerAccount('Anvar Qodirov', 'anvar.qodirov@taskpro.uz');
      onLoginSuccess(account, tasks);
    }, 250);
  };

  return (
    <div className="flex flex-col relative w-full min-h-screen bg-surface overflow-hidden px-4 py-6 justify-center items-center">
      {/* Background ambient lighting blobs */}
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Top Control Bar with Language Selector and Theme Toggle */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/60 backdrop-blur-md shadow-xs border border-surface-container-high/40">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {t('liveSyncBadge')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="pill" />

            <button
              aria-label="Toggle theme appearance"
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-xs border border-surface-container-high/40 text-on-surface hover:bg-surface-container transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="text-xs font-semibold text-on-surface">
                {isDarkMode ? t('darkView').split(' ')[0] : t('lightView').split(' ')[0]}
              </span>
            </button>
          </div>
        </div>

        {/* Brand Hero */}
        <div className="w-full flex flex-col items-center text-center mb-5">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest shadow-md flex items-center justify-center p-2 border border-surface-container-high/40">
              <img
                alt="TaskPro Checkmark Logo"
                className="w-10 h-10 rounded-xl object-contain"
                src={TASKPRO_LOGO}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
            </div>
          </div>

          <span className="font-headline text-sm text-primary tracking-tight font-bold mb-0.5">
            TaskPro
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-1">
            {t('authTitle')}
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
            {mode === 'signin' ? t('authSubtitleSignIn') : t('authSubtitleSignUp')}
          </p>
        </div>

        {/* Existing Accounts Quick Picker (if any exist) */}
        {existingAccounts.length > 0 && mode === 'signin' && (
          <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high/60 rounded-2xl p-3 shadow-md mb-3">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2 px-1">
              Saqlangan hisoblar:
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {existingAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSelectExisting(acc)}
                  className="w-full p-2 rounded-xl hover:bg-surface-container flex items-center gap-2.5 text-left transition-all group"
                >
                  <UserAvatar
                    name={acc.name}
                    avatar={acc.avatar}
                    avatarColor={acc.avatarColor}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant truncate">{acc.email}</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auth Glass Card */}
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high/60 rounded-2xl shadow-xl p-5 mb-4">
          {/* Segmented Switch */}
          <div className="w-full bg-surface-container p-1 rounded-xl flex items-center mb-4">
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>{t('createAccountTab')}</span>
            </button>
            <button
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>{t('signInTab')}</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-error-container/60 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Anvar Qodirov"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anvar@company.uz"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Permanent Session Note */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                />
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {t('rememberMe')}
                </span>
              </label>
              <span className="text-[10px] text-secondary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                Doimiy saqlanadi
              </span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sozlanmoqda...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {mode === 'signup' ? 'arrow_forward' : 'login'}
                  </span>
                  <span>{mode === 'signup' ? t('createAccountCTA') : t('signInCTA')}</span>
                </>
              )}
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-container-high/70" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-outline">
              <span className="bg-surface-container-lowest px-2">{t('orContinueWith')}</span>
            </div>
          </div>

          {/* Social Auth Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleSocialAuth('Google')}
              type="button"
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 border border-surface-container-high/60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={() => handleSocialAuth('Apple')}
              type="button"
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 border border-surface-container-high/60"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.82 1.11-1.95.99-3.08-1 .04-2.18.68-2.87 1.49-.6.69-1.13 1.83-1 2.94 1.11.08 2.22-.53 2.88-1.35z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Quick Demo Button */}
          <button
            onClick={handleQuickDemo}
            type="button"
            className="w-full py-2 px-3 rounded-xl bg-secondary-container/40 hover:bg-secondary-container/70 text-on-secondary-container text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Tezkor sinab ko‘rish (1 marta bosish)</span>
          </button>
        </div>

        {/* Back button if opened from existing screen */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface py-1 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Vazifalarga qaytish</span>
          </button>
        )}
      </div>
    </div>
  );
};
