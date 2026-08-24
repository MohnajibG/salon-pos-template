import { motion } from "framer-motion";
import { Award, HeartHandshake, Sparkles, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Expertise professionnelle",
    text: "Une équipe passionnée et expérimentée, engagée pour un résultat impeccable.",
  },
  {
    icon: Sparkles,
    title: "Produits & prestations de qualité",
    text: "Nous sélectionnons ce qui se fait de mieux pour garantir des résultats fiables et durables.",
  },
  {
    icon: ShieldCheck,
    title: "Rigueur & sécurité",
    text: "Un environnement propre et rigoureux pour une expérience sereine et en toute confiance.",
  },
  {
    icon: HeartHandshake,
    title: "Service personnalisé",
    text: "Chaque prestation est adaptée à vos attentes, vos envies et vos besoins.",
  },
];

const WhyChooseUs = () => (
  <section className="relative w-full overflow-hidden bg-(--white) px-6 py-24 sm:px-10 lg:px-20">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-center gap-14 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:flex-1"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--brown)">
            Pourquoi nous choisir
          </p>

          <h2 className="mt-5 font-title text-3xl font-bold leading-tight text-(--black) sm:text-5xl">
            Une expérience pensée dans les moindres détails
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-(--muted) sm:text-base">
            Chez Flowdesk, chaque détail compte. Notre objectif est
            de créer une expérience unique et personnalisée pour chaque
            client.
          </p>

          <div className="mt-8 h-px w-24 bg-(--champagne)" />
        </motion.div>

        <div className="flex w-full flex-wrap gap-6 lg:flex-1">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="w-full rounded-3xl border border-(--border) bg-(--surface) p-7 shadow-(--shadow-sm) sm:w-[calc(50%-12px)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-(--champagne) bg-(--white) text-(--brown)">
                  <Icon size={26} strokeWidth={1.5} />
                </div>

                <h3 className="mt-6 font-title text-xl font-bold text-(--black)">
                  {reason.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-(--muted)">
                  {reason.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
