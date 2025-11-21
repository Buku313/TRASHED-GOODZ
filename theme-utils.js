const THEME_STORAGE_KEY = 'tgs_theme_mode';

function getStoredThemeMode() {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

function getPreferredThemeMode() {
    const saved = getStoredThemeMode();
    if (saved === 'dark' || saved === 'light') {
        return saved;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

function applyThemeMode(mode, button) {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (button) {
        button.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
}

function toggleThemeMode(button) {
    const currentMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const nextMode = currentMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    applyThemeMode(nextMode, button);
}

function initThemeToggle(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.addEventListener('click', () => toggleThemeMode(button));
    applyThemeMode(getPreferredThemeMode(), button);
}

function applyStoredTheme(buttonId) {
    const button = buttonId ? document.getElementById(buttonId) : null;
    applyThemeMode(getPreferredThemeMode(), button);
}
