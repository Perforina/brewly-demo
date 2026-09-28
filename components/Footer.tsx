import { Wordmark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <Wordmark className="text-xl" />
        <p className="text-sm text-muted">Roasted in small batches</p>
      </div>
    </footer>
  );
}
