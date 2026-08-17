import { motion } from "framer-motion";
import { Scissors, Sparkles, Brush } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Hair Studio",
    desc: "Coiffure, brushing, coloration et créations personnalisées pour révéler votre style.",
  },
  {
    icon: Sparkles,
    title: "Nail Bar",
    desc: "Manucure élégante, soins premium et créations raffinées adaptées à votre personnalité.",
  },
  {
    icon: Brush,
    title: "Makeup",
    desc: "Maquillage naturel, soirée et mariage avec des finitions professionnelles.",
  },
];

const Services = () => (
  <section
    id="services"
    className="relative w-full overflow-hidden bg-(--surface) px-6 py-24 sm:px-10 lg:px-20"
  >
    <div className="mx-auto max-w-7xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs font-semibold uppercase tracking-[0.4em] text-(--brown)"
      >
        Nos prestations
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-5 font-title text-3xl font-bold text-(--black) sm:text-5xl"
      >
        Des soins pensés pour révéler votre beauté
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-(--muted) sm:text-base"
      >
        Une expérience beauté premium combinant expertise, élégance et
        attention personnalisée.
      </motion.p>

      <div className="mt-14 flex flex-wrap gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group w-full rounded-3xl border border-(--border) bg-(--white) p-8 text-center shadow-(--shadow-sm) transition sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.333px)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-(--champagne) bg-(--surface) text-(--brown) transition group-hover:bg-(--champagne) group-hover:text-(--black)">
                <Icon size={30} strokeWidth={1.5} />
              </div>

              <h3 className="mt-7 font-title text-2xl font-bold text-(--black)">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-(--muted)">
                {service.desc}
              </p>

              <a
                href="#contact"
                className="mt-7 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-(--brown) transition group-hover:text-(--black)"
              >
                Découvrir
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
