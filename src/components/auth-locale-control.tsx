import { LocaleSwitcher } from "@/components/locale-switcher";

export function AuthLocaleControl() {
  return (
    <div className="fixed top-4 right-4 z-10">
      <LocaleSwitcher />
    </div>
  );
}
