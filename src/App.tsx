import { LandingPage } from "./components/landing/LandingPage";

function accountUrl(): string | undefined {
  try {
    const value = import.meta.env.VITE_APP_URL;
    if (!value) return undefined;
    const url = new URL(value);
    return url.protocol === "https:" ||
      (url.protocol === "http:" && url.hostname === "localhost")
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export default function App() {
  return <LandingPage accountHref={accountUrl()} />;
}
