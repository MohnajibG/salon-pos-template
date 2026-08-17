import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Accueil", href: "#home" },
  { name: "À propos", href: "#about" },
  { name: "Prestations", href: "#services" },
  { name: "Galerie", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-(--border) bg-(--white)/90 py-3 shadow-(--shadow-sm) backdrop-blur-xl"
          : "bg-(--white)/60 py-5 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-20">
        {/* LOGO */}
        <a href="#home" className="flex items-center gap-3 select-none">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--black) font-title text-lg font-bold text-(--champagne)">
            AK
          </span>

          <span className="flex flex-col leading-none">
            <span className="font-title text-xl tracking-[0.15em] text-(--black) sm:text-2xl">
              SALONPRO
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-(--brown)">
              Institute
            </span>
          </span>
        </a>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative text-xs font-semibold uppercase tracking-[0.18em] text-(--muted) transition hover:text-(--black)"
            >
              {item.name}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-(--gold) transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <a
            href="/app"
            className="group flex  items-center gap-2 rounded-full bg-(--creem) px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-(--white) transition hover:bg-(--gold) hover:text-(--black)"
          >
            APP
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </a>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--border) bg-(--white) text-(--black) lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mt-3 overflow-hidden rounded-3xl border border-(--border) bg-(--white) shadow-(--shadow-md) lg:hidden"
          >
            <div className="flex flex-col items-center gap-6 px-8 py-10">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.2em] text-(--black)"
                >
                  {item.name}
                </a>
              ))}

              <a
                href="/app"
                onClick={() => setOpen(false)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-fullpy-4 text-sm font-semibold uppercase tracking-[0.15em] text-(--cream) transition hover:bg-(--gold) hover:text-(--black)"
              >
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
