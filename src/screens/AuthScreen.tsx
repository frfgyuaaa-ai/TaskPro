import React, { useState } from 'react';
import { TASKPRO_LOGO, SARAH_AVATAR } from '../data/initialTasks';
import { UserProfile } from '../types/task';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.morgan@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Alex Morgan');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: mode === 'signup' ? (fullName || 'Alex Morgan') : 'Sarah Connor',
        email: email || 'alex.morgan@company.com',
        avatar: SARAH_AVATAR,
        role: 'Lead Product Designer',
        appsConnected: 3,
      });
    }, 400);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: `${provider} User (Sarah Connor)`,
        email: email || 'sarah.connor@taskpro.io',
        avatar: SARAH_AVATAR,
        role: 'Lead Product Designer',
        appsConnected: 3,
      });
    }, 400);
  };

  return (
    <div className="flex flex-col relative w-full min-h-screen bg-surface overflow-hidden px-4 py-6 justify-center items-center">
      {/* Background ambient lighting blobs */}
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Top Control Bar with Language Selector and Theme Toggle */}
        <div className="w-full flex items-center justify-between mb-6">
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
        <div className="w-full flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest shadow-md flex items-center justify-center p-2 border border-surface-container-high/40">
              <img
                alt="TaskPro Checkmark Logo"
                className="w-12 h-12 rounded-xl object-contain"
                src={TASKPRO_LOGO}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
            </div>
          </div>

          <span className="font-headline text-base text-primary tracking-tight font-bold mb-1">
            TaskPro
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-2">
            {t('authTitle')}
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
            {mode === 'signin' ? t('authSubtitleSignIn') : t('authSubtitleSignUp')}
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high/60 rounded-2xl shadow-xl p-5 mb-5">
          {/* Segmented Switch */}
          <div className="w-full bg-surface-container p-1 rounded-xl flex items-center mb-4">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>{t('signInTab')}</span>
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>{t('createAccountTab')}</span>
            </button>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface" htmlFor="fullNameInput">
                  {t('fullName')}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
                    badge
                  </span>
                  <input
                    className="w-full h-10 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline border border-surface-container-high/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    id="fullNameInput"
                    placeholder="Alex Morgan"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="emailInput">
                {t('emailAddress')}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  className="w-full h-10 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline border border-surface-container-high/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="emailInput"
                  inputMode="email"
                  placeholder="alex.morgan@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface" htmlFor="passwordInput">
                  {t('password')}
                </label>
                {mode === 'signup' && (
                  <span className="text-[10px] text-on-surface-variant">{t('minChars')}</span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  className="w-full h-10 pl-10 pr-10 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline border border-surface-container-high/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="passwordInput"
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                    type="checkbox"
                  />
                  <span className="text-xs text-on-surface-variant">{t('rememberMe')}</span>
                </label>
                <button
                  className="text-xs font-semibold text-primary hover:underline"
                  type="button"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            <button
              className="w-full h-11 mt-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? t('signInCTA') : t('createAccountCTA')}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full h-px bg-surface-container-high" />
            <span className="absolute px-3 bg-surface-container-lowest text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              {t('orContinueWith')}
            </span>
          </div>

          {/* Social Auth */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSocialAuth('Google')}
              className="w-full h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-surface-container-high/40 transition-all flex items-center justify-center gap-2.5 shadow-xs active:scale-[0.99]"
              type="button"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>{t('continueWithGoogle')}</span>
            </button>

            <button
              onClick={() => handleSocialAuth('Apple')}
              className="w-full h-10 rounded-xl bg-inverse-surface text-inverse-on-surface hover:opacity-95 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-xs active:scale-[0.99]"
              type="button"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.8 1.1-1.92.98-3.04-.95.04-2.09.64-2.76 1.43-.59.68-1.11 1.78-.97 2.86 1.05.08 2.13-.53 2.75-1.25z" />
              </svg>
              <span>{t('continueWithApple')}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="w-full flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span>{mode === 'signin' ? t('dontHaveAccount') : t('alreadyHaveAccount')}</span>
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary font-bold hover:underline"
              type="button"
            >
              {mode === 'signin' ? t('signUpFree') : t('signInHere')}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/80 mt-1">
            <a className="hover:text-on-surface transition-colors" href="#privacy">
              {t('privacyPolicy')}
            </a>
            <span>•</span>
            <a className="hover:text-on-surface transition-colors" href="#terms">
              {t('termsOfService')}
            </a>
            <span>•</span>
            <a className="hover:text-on-surface transition-colors" href="#security">
              {t('security')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
