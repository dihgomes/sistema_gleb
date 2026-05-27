const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
let inactivityTimer: number | null = null;

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export function startInactivityMonitor(onTimeout: () => void) {
  stopInactivityMonitor();

  const resetTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
      console.warn('Sessão expirada por inatividade');
      onTimeout();
    }, INACTIVITY_TIMEOUT);
  };

  ACTIVITY_EVENTS.forEach(event => {
    window.addEventListener(event, resetTimer, { passive: true });
  });

  resetTimer();
}

export function stopInactivityMonitor() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }

  ACTIVITY_EVENTS.forEach(event => {
    window.removeEventListener(event, () => {});
  });
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  localStorage.removeItem('showLoginToast');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('admin');
  sessionStorage.removeItem('showLoginToast');
}

export function validateToken(): boolean {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    console.warn('Token expirado');
    clearAuthData();
    return false;
  }

  return true;
}
