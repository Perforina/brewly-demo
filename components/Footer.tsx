import { Wordmark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-espresso text-crema">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <Wordmark />
        <p className="text-sm text-crema/80">Roasted in small batches</p>
      </div>
    </footer>
  );
}
