import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    text: "Une expérience exceptionnelle dans un environnement soigné et agréable.",
  },
  {
    name: "Lina K.",
    text: "Le meilleur service que j'ai testé. Un accueil précis et très professionnel.",
  },
  {
    name: "Nadia R.",
    text: "Un résultat impeccable à chaque visite. Une vraie expérience de qualité.",
  },
];

const Testimonials = () => (
  <section className="relative w-full overflow-hidden bg-(--black) px-6 py-24 text-(--white) sm:px-10 lg:px-20">
    <div className="mx-auto max-w-7xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs font-semibold uppercase tracking-[0.4em] text-(--champagne)"
      >
        Témoignages
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-5 font-title text-3xl font-bold sm:text-5xl"
      >
        L'expérience SalonPro appréciée par nos clients
      </motion.h2>

      <div className="mt-14 flex flex-col gap-8 md:flex-row">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -8 }}
            className="rounded-3xl border border-(--white)/15 bg-(--white)/10 p-8 text-left backdrop-blur-xl transition md:flex-1"
          >
            <Quote size={35} className="text-(--champagne)" strokeWidth={1.5} />

            <div className="mt-6 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill="currentColor"
                  className="text-(--champagne)"
                />
              ))}
            </div>

            <p className="mt-6 text-sm leading-7 text-(--white)/70">
              "{review.text}"
            </p>

            <h4 className="mt-7 font-semibold tracking-wide text-(--white)">
              {review.name}
            </h4>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
