import { motion } from "framer-motion";
import { Sparkles, Users, Award } from "lucide-react";
import ImagePlaceholder from "../ui/ImagePlaceholder";

const stats = [
  { value: "1500+", label: "Clients satisfaits", icon: Users },
  { value: "10+", label: "Membres de l'équipe", icon: Sparkles },
  { value: "5★", label: "Note moyenne", icon: Award },
];

const About = () => (
  <section
    id="about"
    className="w-full overflow-hidden bg-(--surface) px-6 py-24 sm:px-10 lg:px-20"
  >
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 lg:flex-row lg:items-center">
      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full lg:w-1/2"
      >
        <div className="relative rounded-4xl border border-(--border) bg-(--white) p-3 shadow-(--shadow-md)">
          <ImagePlaceholder className="h-105 w-full rounded-[26px] sm:h-130" />

          <div className="absolute inset-3 rounded-[26px] bg-linear-to-t from-(--black)/30 to-transparent" />
        </div>

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="absolute -bottom-8 left-6 rounded-3xl border border-(--border) bg-(--white) px-8 py-5 shadow-(--shadow-md)"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Expérience
          </p>

          <p className="mt-2 font-title text-xl font-bold text-(--black)">
            Depuis 2024
          </p>
        </motion.div>
      </motion.div>

      {/* TEXTE */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex w-full flex-col lg:w-1/2"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--brown)">
          À propos de SalonPro
        </p>

        <h2 className="mt-5 font-title text-3xl font-bold leading-tight text-(--black) sm:text-5xl">
          Un savoir-faire construit avec précision, exigence et passion
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-(--muted)">
          SalonPro est plus qu'un commerce. C'est un espace pensé où
          expertise, attention personnalisée et outils modernes se
          rencontrent pour créer une expérience exceptionnelle.
        </p>

        {/* STATS */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                whileHover={{ y: -8 }}
                className="flex-1 rounded-3xl border border-(--border) bg-(--white) p-5 shadow-(--shadow-sm) transition"
              >
                <Icon size={22} className="text-(--brown)" strokeWidth={1.5} />

                <h3 className="mt-4 font-title text-3xl font-bold text-(--black)">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-(--muted)">{item.label}</p>
              </motion.div>
            );
          })}
        </div>

        <a
          href="#services"
          className="mt-10 w-fit rounded-full bg-(--black) px-10 py-4 text-sm font-semibold text-(--cream) transition hover:bg-(--brown-dark)"
        >
          Découvrir nos services
        </a>
      </motion.div>
    </div>
  </section>
);

export default About;
