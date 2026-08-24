import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

// Dégradés de secours : à remplacer par de vraies photos du salon
// (Frontend/src/components/home/Hero.tsx).
const slides = [
  "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
  "linear-gradient(135deg, #111827 0%, #1e3a8a 100%)",
  "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #111827 100%)",
];

const trustPoints = [
  { value: "1500+", label: "Clientes satisfaites" },
  { value: "10+", label: "Experts beauté" },
  { value: "5★", label: "Note moyenne" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-(--black)"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.04 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 h-full w-full"
          style={{ backgroundImage: slides[current] }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-(--black)/55" />
      <div className="absolute inset-0 bg-linear-to-r from-(--black)/85 via-(--black)/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-(--black)/80 via-transparent to-(--black)/10" />

      <div className="relative z-10 flex w-full flex-1 items-center px-6 pt-28 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl text-(--white)"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-(--champagne) sm:text-sm">
              <Sparkles size={17} />
              Institut de beauté premium
            </p>

            <h1 className="font-title text-6xl font-bold tracking-[0.1em] sm:text-7xl lg:text-9xl">
              SALONPRO
            </h1>

            <p className="mt-4 text-xs uppercase tracking-[0.65em] text-(--champagne) sm:text-sm">
              Institute
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl rounded-3xl border border-(--white)/15 bg-(--black)/25 p-6 backdrop-blur-md sm:p-10"
          >
            <h2 className="font-title text-3xl leading-tight sm:text-5xl">
              Révélez votre beauté naturelle
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-(--white)/75 sm:text-base">
              Une expérience beauté haut de gamme dédiée à la coiffure, au
              maquillage, aux soins et au bien-être dans un environnement
              élégant et personnalisé.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#services"
                className="flex items-center justify-center gap-3 rounded-full bg-(--champagne) px-8 py-4 text-sm font-semibold text-(--black) transition hover:bg-(--gold)"
              >
                Découvrir nos prestations
                <ArrowRight size={18} />
              </a>

              <a
                href="#contact"
                className="flex items-center justify-center gap-3 rounded-full border border-(--white)/30 px-8 py-4 text-sm font-semibold text-(--white) transition hover:bg-(--white)/10"
              >
                <CalendarDays size={18} />
                Réserver
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 flex w-full flex-wrap gap-x-10 gap-y-4 border-t border-(--white)/10 px-6 py-6 sm:px-10 lg:px-20"
      >
        {trustPoints.map((point) => (
          <div key={point.label} className="flex items-baseline gap-2">
            <span className="font-title text-xl font-bold text-(--champagne) sm:text-2xl">
              {point.value}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-(--white)/60">
              {point.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Indicateurs */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:right-10 lg:right-20 lg:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Image ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "h-8 w-2 bg-(--champagne)"
                : "w-2 bg-(--white)/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
