import React, { useState, useEffect, useRef } from "react";

// ============================================================
//  HADIDJA SHOP — Luxury Admin Auth Page
//  Используй так в App.jsx или AdminPanel.jsx:
//  import LoginPage from "./components/LoginPage";
//  <LoginPage onLogin={(token, user) => { ... }} />
// ============================================================

export default function LoginPage({ onLogin, showToast }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassReg, setShowPassReg] = useState(false);
  const [particles, setParticles] = useState([]);

  // Login form
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Register form
  const [regForm, setRegForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Animated particles background
  useEffect(() => {
    const pts = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 12,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(pts);
  }, []);

  // ── LOGIN ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError("Введите логин и пароль");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Неверный логин или пароль");
      localStorage.setItem("hadidja_admin_token", data.token);
      localStorage.setItem("hadidja_admin_user", JSON.stringify(data.user));
      showToast?.("✨ Добро пожаловать, " + data.user.fullName + "!");
      onLogin?.(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ───────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, username, password, confirmPassword } = regForm;
    if (!fullName.trim() || !username.trim() || !password) {
      setError("Заполните все поля");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
      localStorage.setItem("hadidja_admin_token", data.token);
      localStorage.setItem("hadidja_admin_user", JSON.stringify(data.user));
      showToast?.("🎉 Аккаунт создан! Добро пожаловать, " + data.user.fullName + "!");
      onLogin?.(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setShowPass(false);
    setShowPassReg(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="lp-root">
        {/* ── Animated Background ───────────────────── */}
        <div className="lp-bg">
          <div className="lp-bg-gradient" />
          <div className="lp-bg-noise" />
          {particles.map((p) => (
            <span
              key={p.id}
              className="lp-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
          <div className="lp-orb lp-orb-1" />
          <div className="lp-orb lp-orb-2" />
          <div className="lp-orb lp-orb-3" />
        </div>

        {/* ── Card ─────────────────────────────────── */}
        <div className="lp-card">
          {/* Logo + Brand */}
          <div className="lp-brand">
            <div className="lp-logo-wrap">
              <div className="lp-logo-ring" />
              <div className="lp-logo-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="url(#lg)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="lg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#c5a880" />
                      <stop offset="1" stopColor="#ecd9c2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="lp-brand-text">
              <h1 className="lp-brand-name">HADIDJA SHOP</h1>
              <p className="lp-brand-sub">Административная панель</p>
            </div>
          </div>

          {/* Divider */}
          <div className="lp-divider">
            <span className="lp-divider-line" />
            <span className="lp-divider-diamond">◆</span>
            <span className="lp-divider-line" />
          </div>

          {/* Tab switcher */}
          <div className="lp-tabs">
            <button
              className={`lp-tab ${mode === "login" ? "lp-tab--active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Войти
            </button>
            <button
              className={`lp-tab ${mode === "register" ? "lp-tab--active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Регистрация
            </button>
            <div className={`lp-tab-slider ${mode === "register" ? "lp-tab-slider--right" : ""}`} />
          </div>

          {/* Error */}
          {error && (
            <div className="lp-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ─────────────────────────── */}
          {mode === "login" && (
            <form className="lp-form" onSubmit={handleLogin} autoComplete="on">
              <LpField
                label="Логин"
                type="text"
                placeholder="admin"
                value={loginForm.username}
                onChange={(v) => setLoginForm((f) => ({ ...f, username: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
                autoComplete="username"
              />
              <LpField
                label="Пароль"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                suffix={
                  <button type="button" className="lp-eye" onClick={() => setShowPass((v) => !v)}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                }
                autoComplete="current-password"
              />
              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : (
                  <>
                    <span>Войти в панель</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ──────────────────────── */}
          {mode === "register" && (
            <form className="lp-form" onSubmit={handleRegister} autoComplete="on">
              <LpField
                label="Полное имя"
                type="text"
                placeholder="Ваше имя"
                value={regForm.fullName}
                onChange={(v) => setRegForm((f) => ({ ...f, fullName: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />
              <LpField
                label="Логин"
                type="text"
                placeholder="только латиница, без пробелов"
                value={regForm.username}
                onChange={(v) => setRegForm((f) => ({ ...f, username: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                }
                autoComplete="username"
              />
              <LpField
                label="Пароль"
                type={showPassReg ? "text" : "password"}
                placeholder="минимум 6 символов"
                value={regForm.password}
                onChange={(v) => setRegForm((f) => ({ ...f, password: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                suffix={
                  <button type="button" className="lp-eye" onClick={() => setShowPassReg((v) => !v)}>
                    {showPassReg ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                }
                autoComplete="new-password"
              />
              <LpField
                label="Подтверждение пароля"
                type="password"
                placeholder="повторите пароль"
                value={regForm.confirmPassword}
                onChange={(v) => setRegForm((f) => ({ ...f, confirmPassword: v }))}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
                autoComplete="new-password"
              />
              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : (
                  <>
                    <span>Создать аккаунт</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="lp-footer-note">
            {mode === "login" ? (
              <>Нет аккаунта? <button className="lp-link" onClick={() => switchMode("register")}>Зарегистрироваться</button></>
            ) : (
              <>Уже есть аккаунт? <button className="lp-link" onClick={() => switchMode("login")}>Войти</button></>
            )}
          </p>

          {/* Bottom brand tag */}
          <div className="lp-bottom-tag">
            <span className="lp-bottom-line" />
            <span className="lp-bottom-text">HADIDJA · DUSHANBE · TAJIKISTAN</span>
            <span className="lp-bottom-line" />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-component: Input Field ───────────────────────────────
function LpField({ label, type, placeholder, value, onChange, icon, suffix, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`lp-field ${focused ? "lp-field--focused" : ""} ${hasValue ? "lp-field--filled" : ""}`}>
      <label className="lp-label">{label}</label>
      <div className="lp-input-wrap">
        {icon && <span className="lp-icon">{icon}</span>}
        <input
          className="lp-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
        />
        {suffix}
      </div>
      <div className="lp-field-line">
        <div className="lp-field-line-fill" />
      </div>
    </div>
  );
}

// ── All CSS scoped inside the component ─────────────────────
const CSS = `
  /* ── Root ────────────────────────────────────────────────── */
  .lp-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* ── Background ─────────────────────────────────────────── */
  .lp-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .lp-bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 20%, rgba(197,168,128,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(197,168,128,0.06) 0%, transparent 55%),
      linear-gradient(160deg, #0a0908 0%, #111009 40%, #0d0c0a 100%);
  }
  .lp-bg-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ── Orbs ───────────────────────────────────────────────── */
  .lp-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: lp-float 20s ease-in-out infinite alternate;
  }
  .lp-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(197,168,128,0.07) 0%, transparent 70%);
    top: -150px; left: -150px;
    animation-duration: 22s;
  }
  .lp-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(197,168,128,0.05) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    animation-duration: 18s; animation-delay: -5s;
  }
  .lp-orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(197,168,128,0.04) 0%, transparent 70%);
    top: 50%; left: 60%;
    animation-duration: 25s; animation-delay: -10s;
  }
  @keyframes lp-float {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, -30px) scale(1.05); }
  }

  /* ── Particles ──────────────────────────────────────────── */
  .lp-particle {
    position: absolute;
    border-radius: 50%;
    background: #c5a880;
    animation: lp-particle-float linear infinite;
  }
  @keyframes lp-particle-float {
    0%   { transform: translateY(0) rotate(0deg); opacity: var(--op, 0.2); }
    50%  { transform: translateY(-40px) rotate(180deg); opacity: calc(var(--op, 0.2) * 1.5); }
    100% { transform: translateY(0) rotate(360deg); opacity: var(--op, 0.2); }
  }

  /* ── Card ───────────────────────────────────────────────── */
  .lp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: rgba(20, 18, 15, 0.92);
    border: 1px solid rgba(197, 168, 128, 0.18);
    border-radius: 24px;
    padding: 44px 40px 36px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(197, 168, 128, 0.06),
      0 24px 64px rgba(0, 0, 0, 0.6),
      0 4px 16px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(197, 168, 128, 0.12);
    animation: lp-card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes lp-card-in {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Brand ──────────────────────────────────────────────── */
  .lp-brand {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }
  .lp-logo-wrap {
    position: relative;
    width: 56px; height: 56px;
    flex-shrink: 0;
  }
  .lp-logo-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(197, 168, 128, 0.35);
    animation: lp-spin-slow 12s linear infinite;
  }
  .lp-logo-ring::before {
    content: '';
    position: absolute;
    top: -1px; left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    background: #c5a880;
    border-radius: 50%;
  }
  @keyframes lp-spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .lp-logo-inner {
    position: absolute;
    inset: 6px;
    background: linear-gradient(135deg, #1a1710 0%, #211e18 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }
  .lp-brand-text { flex: 1; min-width: 0; }
  .lp-brand-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: transparent;
    background: linear-gradient(135deg, #c5a880 0%, #ecd9c2 50%, #b38f5f 100%);
    -webkit-background-clip: text;
    background-clip: text;
    margin: 0 0 2px;
    white-space: nowrap;
  }
  .lp-brand-sub {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: rgba(197, 168, 128, 0.55);
    text-transform: uppercase;
    margin: 0;
  }

  /* ── Divider ────────────────────────────────────────────── */
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .lp-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(197,168,128,0.25));
  }
  .lp-divider-line:last-child {
    background: linear-gradient(to left, transparent, rgba(197,168,128,0.25));
  }
  .lp-divider-diamond {
    font-size: 7px;
    color: rgba(197,168,128,0.5);
  }

  /* ── Tabs ───────────────────────────────────────────────── */
  .lp-tabs {
    display: flex;
    position: relative;
    background: rgba(197,168,128,0.06);
    border: 1px solid rgba(197,168,128,0.12);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
    gap: 0;
  }
  .lp-tab {
    flex: 1;
    padding: 10px 0;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: rgba(197,168,128,0.5);
    background: none;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: color 0.25s ease;
    font-family: inherit;
  }
  .lp-tab--active {
    color: #1a1510;
  }
  .lp-tab-slider {
    position: absolute;
    top: 4px; left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: linear-gradient(135deg, #c5a880 0%, #ecd9c2 50%, #b38f5f 100%);
    border-radius: 9px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(197,168,128,0.4);
  }
  .lp-tab-slider--right {
    transform: translateX(calc(100% + 0px));
  }

  /* ── Error ──────────────────────────────────────────────── */
  .lp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(207, 73, 73, 0.12);
    border: 1px solid rgba(207, 73, 73, 0.3);
    color: #e88;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 16px;
    animation: lp-shake 0.4s cubic-bezier(.36,.07,.19,.97);
  }
  @keyframes lp-shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(3px); }
    30%, 50%, 70% { transform: translateX(-3px); }
    40%, 60% { transform: translateX(3px); }
  }

  /* ── Form / Fields ──────────────────────────────────────── */
  .lp-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .lp-field {
    position: relative;
  }
  .lp-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(197,168,128,0.55);
    margin-bottom: 8px;
    transition: color 0.2s;
  }
  .lp-field--focused .lp-label,
  .lp-field--filled .lp-label {
    color: rgba(197,168,128,0.9);
  }
  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(197,168,128,0.15);
    border-radius: 12px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .lp-field--focused .lp-input-wrap {
    border-color: rgba(197,168,128,0.5);
    background: rgba(255,255,255,0.05);
    box-shadow: 0 0 0 3px rgba(197,168,128,0.08), inset 0 1px 0 rgba(197,168,128,0.1);
  }
  .lp-icon {
    padding: 0 0 0 14px;
    color: rgba(197,168,128,0.4);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .lp-field--focused .lp-icon { color: rgba(197,168,128,0.75); }
  .lp-input {
    flex: 1;
    padding: 13px 14px;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 400;
    color: #f5ead8;
    font-family: inherit;
    caret-color: #c5a880;
  }
  .lp-input::placeholder { color: rgba(197,168,128,0.25); }
  .lp-eye {
    padding: 0 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(197,168,128,0.4);
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .lp-eye:hover { color: rgba(197,168,128,0.8); }
  .lp-field-line {
    height: 1px;
    background: rgba(197,168,128,0.08);
    margin-top: 0;
    overflow: hidden;
  }
  .lp-field-line-fill {
    height: 100%;
    width: 0;
    background: linear-gradient(to right, #c5a880, #ecd9c2);
    transition: width 0.3s ease;
  }
  .lp-field--focused .lp-field-line-fill { width: 100%; }

  /* ── Button ─────────────────────────────────────────────── */
  .lp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 15px 24px;
    margin-top: 4px;
    background: linear-gradient(135deg, #c5a880 0%, #ecd9c2 50%, #b38f5f 100%);
    border: none;
    border-radius: 12px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #1a1510;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(197,168,128,0.35), 0 2px 8px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
  }
  .lp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .lp-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(197,168,128,0.5), 0 4px 12px rgba(0,0,0,0.3);
  }
  .lp-btn:not(:disabled):active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(197,168,128,0.3);
  }
  .lp-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* ── Spinner ────────────────────────────────────────────── */
  .lp-spinner {
    display: inline-block;
    width: 18px; height: 18px;
    border: 2px solid rgba(26,21,16,0.3);
    border-top-color: #1a1510;
    border-radius: 50%;
    animation: lp-spin 0.7s linear infinite;
  }
  @keyframes lp-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Footer ─────────────────────────────────────────────── */
  .lp-footer-note {
    text-align: center;
    font-size: 13px;
    color: rgba(197,168,128,0.4);
    margin: 20px 0 0;
  }
  .lp-link {
    background: none;
    border: none;
    color: rgba(197,168,128,0.85);
    font-size: inherit;
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-decoration-color: rgba(197,168,128,0.3);
    text-underline-offset: 3px;
    transition: color 0.2s;
  }
  .lp-link:hover { color: #ecd9c2; }

  .lp-bottom-tag {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 28px;
  }
  .lp-bottom-line {
    flex: 1;
    height: 1px;
    background: rgba(197,168,128,0.1);
  }
  .lp-bottom-text {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: rgba(197,168,128,0.25);
    white-space: nowrap;
  }

  /* ── Responsive ─────────────────────────────────────────── */
  @media (max-width: 480px) {
    .lp-card {
      padding: 36px 24px 28px;
      border-radius: 20px;
    }
    .lp-brand-name { font-size: 17px; }
  }
`;
