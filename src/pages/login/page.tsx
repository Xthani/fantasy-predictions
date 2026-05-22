import { useMemo, useState, type FormEvent } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/authContext';
import type { LoginInput, SignupInput } from '@/features/auth/model/auth.types';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

type AuthMode = 'login' | 'signup';

type LoginFormState = LoginInput;

type SignupFormState = SignupInput;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialLoginForm: LoginFormState = {
  emailOrLogin: '',
  password: '',
};

const initialSignupForm: SignupFormState = {
  email: '',
  login: '',
  password: '',
  displayName: '',
};

/** Google Identity Services accept width in pixels only (not CSS %). */
const getGoogleButtonWidth = (): number => {
  if (typeof window === 'undefined') return 400;
  return Math.min(400, Math.max(280, Math.floor(window.innerWidth - 48)));
};

const getRedirectPath = (state: unknown): string => {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = (state as { from: unknown }).from;
    if (typeof from === 'string') return from;
  }

  return '/';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    status,
    error,
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    clearAuthError,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [signupForm, setSignupForm] = useState<SignupFormState>(initialSignupForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const redirectPath = useMemo(() => getRedirectPath(location.state), [location.state]);
  const isLoading = status === 'loading';
  const googleClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID;
  const googleButtonWidth = getGoogleButtonWidth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const clearErrors = () => {
    setFormError(null);
    setGoogleError(null);
    clearAuthError();
  };

  const validateLogin = (): string | null => {
    if (!loginForm.emailOrLogin.trim()) return 'Укажи email или логин.';
    if (!loginForm.password) return 'Введи пароль.';
    return null;
  };

  const validateSignup = (): string | null => {
    if (!signupForm.email.trim()) return 'Укажи email.';
    if (!emailPattern.test(signupForm.email.trim())) return 'Email выглядит некорректно.';
    if (!signupForm.login.trim()) return 'Придумай логин.';
    if (!signupForm.displayName.trim()) return 'Укажи имя для отображения.';
    if (!signupForm.password) return 'Введи пароль.';
    if (signupForm.password.length < 8) return 'Пароль должен быть не короче 8 символов.';
    return null;
  };

  const handleGoogleCredential = async (credential?: string) => {
    clearErrors();

    if (!credential) {
      setGoogleError('Google не вернул idToken. Попробуй ещё раз.');
      return;
    }

    try {
      await signInWithGoogle(credential);
      navigate(redirectPath, { replace: true });
    } catch {
      setGoogleError('Backend отклонил Google token. Попробуй ещё раз.');
    }
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const validationError = validateLogin();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await signInWithEmailPassword({
        emailOrLogin: loginForm.emailOrLogin.trim(),
        password: loginForm.password,
      });
      navigate(redirectPath, { replace: true });
    } catch {
      setFormError('Не удалось войти. Проверь данные и попробуй ещё раз.');
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const validationError = validateSignup();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await signUpWithEmailPassword({
        email: signupForm.email.trim(),
        login: signupForm.login.trim(),
        password: signupForm.password,
        displayName: signupForm.displayName.trim(),
      });
      navigate(redirectPath, { replace: true });
    } catch {
      setFormError('Не удалось создать аккаунт. Проверь данные и попробуй ещё раз.');
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearErrors();
  };

  const visibleError = formError ?? googleError ?? error;

  return (
    <Screen
      eyebrow="Fantasy Predictions"
      title="Войти"
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

      <div className={styles.actions}>
        <div className={styles.googleButtonWrap} aria-busy={isLoading}>
          {googleClientId ? (
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                void handleGoogleCredential(credentialResponse.credential)
              }
              onError={() => setGoogleError('Вход через Google был отменён или не завершился.')}
              width={googleButtonWidth}
              text="continue_with"
              useOneTap={false}
            />
          ) : (
            <Button fullWidth disabled>
              Продолжить с Google
            </Button>
          )}
        </div>

        {!googleClientId ? (
          <p className={styles.hint}>
            Добавь VITE_GOOGLE_WEB_CLIENT_ID в env, чтобы включить Google Sign-In.
          </p>
        ) : null}

        <div className={styles.divider}>или</div>

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
              className={mode === 'signup' ? styles.modeTabActive : styles.modeTab}
              type="button"
              onClick={() => switchMode('signup')}
              disabled={isLoading}
            >
              Регистрация
            </button>
          </div>

          {mode === 'login' ? (
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <label className={styles.fieldLabel}>
                Email или логин
                <input
                  className={styles.field}
                  value={loginForm.emailOrLogin}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, emailOrLogin: event.target.value }))
                  }
                  type="text"
                  autoComplete="username"
                  placeholder="player@mail.com"
                  disabled={isLoading}
                />
              </label>
              <label className={styles.fieldLabel}>
                Пароль
                <input
                  className={styles.field}
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  type="password"
                  autoComplete="current-password"
                  placeholder="Пароль"
                  disabled={isLoading}
                />
              </label>
              <Button variant="secondary" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? 'Входим...' : 'Войти'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => switchMode('signup')}
                disabled={isLoading}
              >
                Создать аккаунт
              </Button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleSignupSubmit}>
              <label className={styles.fieldLabel}>
                Email
                <input
                  className={styles.field}
                  value={signupForm.email}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, email: event.target.value }))
                  }
                  type="email"
                  autoComplete="email"
                  placeholder="player@mail.com"
                  disabled={isLoading}
                />
              </label>
              <label className={styles.fieldLabel}>
                Логин
                <input
                  className={styles.field}
                  value={signupForm.login}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, login: event.target.value }))
                  }
                  type="text"
                  autoComplete="username"
                  placeholder="fantasy_player"
                  disabled={isLoading}
                />
              </label>
              <label className={styles.fieldLabel}>
                Имя
                <input
                  className={styles.field}
                  value={signupForm.displayName}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, displayName: event.target.value }))
                  }
                  type="text"
                  autoComplete="name"
                  placeholder="Игрок"
                  disabled={isLoading}
                />
              </label>
              <label className={styles.fieldLabel}>
                Пароль
                <input
                  className={styles.field}
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, password: event.target.value }))
                  }
                  type="password"
                  autoComplete="new-password"
                  placeholder="Минимум 8 символов"
                  disabled={isLoading}
                />
              </label>
              <Button variant="secondary" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? 'Создаём...' : 'Создать аккаунт'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => switchMode('login')}
                disabled={isLoading}
              >
                У меня уже есть аккаунт
              </Button>
            </form>
          )}
        </div>

        {visibleError ? <p className={styles.error}>{visibleError}</p> : null}
      </div>
    </Screen>
  );
};
