import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Preference = "light" | "dark" | "system";
const storageKey = "finflow-theme";
const query = "(prefers-color-scheme: dark)";

function storedPreference(): Preference {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* Preference remains usable when browser storage is blocked. */
  }
  return "system";
}

function applyTheme(preference: Preference) {
  const dark = preference === "dark" || (preference === "system" && matchMedia(query).matches);
  const theme = dark ? "dark" : "light";
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = theme;
  root.style.backgroundColor = dark ? "#09090b" : "#fafafa";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#09090b" : "#fafafa");
  window.dispatchEvent(new Event("finflow-theme-change"));
}

function snapshot() {
  return `${document.documentElement.dataset.theme || "light"}:${document.documentElement.dataset.themePreference || "system"}`;
}
function subscribe(notify: () => void) {
  const media = matchMedia(query);
  const onSystem = () => {
    if (document.documentElement.dataset.themePreference === "system") applyTheme("system");
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) applyTheme(storedPreference());
  };
  window.addEventListener("finflow-theme-change", notify);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystem);
  if (
    document.documentElement.dataset.themePreference === "system" &&
    document.documentElement.dataset.theme !== (media.matches ? "dark" : "light")
  ) {
    applyTheme("system");
  }
  return () => {
    window.removeEventListener("finflow-theme-change", notify);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystem);
  };
}

export function ThemeToggle() {
  const [theme, preference] = useSyncExternalStore(subscribe, snapshot, () => "light:system").split(
    ":",
  );
  const setPreference = (next: Preference) => {
    try {
      if (next === "system") localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, next);
    } catch {
      /* Keep the current session functional without persistence. */
    }
    applyTheme(next);
  };
  return (
    <fieldset className="ff-theme-control" aria-label="Aparência">
      <button
        type="button"
        className="ff-icon-button"
        aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
        title={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
        onClick={() => setPreference(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button
        type="button"
        className="ff-system-button"
        aria-label="Usar tema do sistema"
        title="Usar tema do sistema"
        aria-pressed={preference === "system"}
        onClick={() => setPreference("system")}
      >
        <Monitor size={14} />
      </button>
    </fieldset>
  );
}
