import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <Logo size="sm" />
        <p className="text-xs text-ivory/40">
          © {new Date().getFullYear()} Hirely AI. All rights reserved.
        </p>
      </div>
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-center border-t border-white/5 pt-4">
        <p className="text-xs text-ivory/40">
          This website is built by{" "}
          <a
            href="https://pantrix-flax.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold hover:underline"
          >
            Pantrix
          </a>
        </p>
      </div>
    </footer>
  );
}
