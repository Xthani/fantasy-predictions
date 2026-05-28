import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

type AuthMode = 'login' | 'register';

const loginPattern = /^[a-zA-Z0-9_]{3,32}$/;

const getRedirectPath = (state: unknown): string => {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = (state as { from: unknown }).from;
    if (typeof from === 'string' && from !== '/login') return from;
  }

  return '/';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error, login, register, clearAuthError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const redirectPath = getRedirectPath(location.state);
  const isLoading = status === 'loading';

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const clearErrors = () => {
    setFormError(null);
    clearAuthError();
  };

  const validate = (): string | null => {
    if (!loginPattern.test(loginValue.trim())) {
      return 'Логин: 3–32 символа, латиница, цифры и _.';
    }
    if (password.length < 8) {
      return 'Пароль должен быть не короче 8 символов.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const credentials = {
      login: loginValue.trim(),
      password,
    };

    try {
      if (mode === 'login') {
        await login(credentials);
      } else {
        await register({
          ...credentials,
          displayName: displayName.trim() || undefined,
        });
      }
      navigate(redirectPath, { replace: true });
    } catch {
      setFormError(null);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearErrors();
  };

  const visibleError = formError ?? error;

  return (
    <Screen
      eyebrow="Fantasy Predictions"
      title={mode === 'login' ? 'Войти' : 'Регистрация'}
      subtitle="Прогнозы на футбол — без ставок и казино"
      footer={
        <p className={styles.legal}>
          Продолжая, ты принимаешь правила игры. Реальные деньги не используются.
        </p>
      }
    >
      <div className={styles.logoWrap}>
        <div className={styles.logo} aria-hidden>
          ⚽
        </div>
      </div>

      <div className={styles.authBlock}>
        <div className={styles.modeTabs} aria-label="Способ входа">
          <button
            className={mode === 'login' ? styles.modeTabActive : styles.modeTab}
            type="button"
            onClick={() => switchMode('login')}
            disabled={isLoading}
          >
            Вход
          </button>
          <button
            className={mode === 'register' ? styles.modeTabActive : styles.modeTab}
            type="button"
            onClick={() => switchMode('register')}
            disabled={isLoading}
          >
            Регистрация
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel}>
            Логин
            <input
              className={styles.field}
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              type="text"
              autoComplete="username"
              placeholder="fantasy_player"
              disabled={isLoading}
            />
          </label>

          {mode === 'register' ? (
            <label className={styles.fieldLabel}>
              Имя (необязательно)
              <input
                className={styles.field}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Игрок"
                disabled={isLoading}
              />
            </label>
          ) : null}

          <label className={styles.fieldLabel}>
            Пароль
            <input
              className={styles.field}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Минимум 8 символов"
              disabled={isLoading}
            />
          </label>

          <Button variant="secondary" fullWidth type="submit" disabled={isLoading}>
            {isLoading ? 'Загрузка…' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        {visibleError ? <p className={styles.error}>{visibleError}</p> : null}
      </div>
    </Screen>
  );
};
