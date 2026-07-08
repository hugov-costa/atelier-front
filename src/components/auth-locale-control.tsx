import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthLocaleControl() {
  return (
    <div className="fixed top-4 right-4 z-10 flex items-center gap-1">
      <LocaleSwitcher />
      <ThemeToggle />
    </div>
  );
}
