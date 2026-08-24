import { motion } from "framer-motion";
import { Camera, MapPin, Phone, ArrowRight } from "lucide-react";

const details = [
  {
    icon: MapPin,
    title: "Adresse",
    text: "Votre adresse, votre ville",
  },
  {
    icon: Phone,
    title: "Téléphone",
    text: "+00 0 00 00 00 00",
  },
  {
    icon: Camera,
    title: "Instagram",
    text: "@flowdesk",
  },
];

const Contact = () => (
  <section
    id="contact"
    className="relative w-full overflow-hidden bg-(--surface) px-6 py-24 sm:px-10 lg:px-20"
  >
    <div className="mx-auto flex max-w-7xl flex-col">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center overflow-hidden rounded-[40px] border border-(--champagne) bg-(--white)/70 px-6 py-14 text-center shadow-(--shadow-md) backdrop-blur-xl sm:px-12"
      >
        {/* DECORATION */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-(--champagne)/30 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--brown)">
            Contact
          </p>

          <h2 className="mt-5 font-title text-3xl font-bold text-(--black) sm:text-5xl">
            Visitez Flowdesk
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-(--muted) sm:text-base">
            Découvrez une expérience soignée, dans un environnement pensé
            pour votre confort et votre confiance.
          </p>

          {/* INFORMATIONS */}
          <div className="mt-12 flex w-full flex-col gap-5 sm:flex-row">
            {details.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="flex-1 rounded-3xl border border-(--border) bg-(--white) p-6 text-left shadow-(--shadow-sm)"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--surface) text-(--brown)">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-(--brown)">
                    {item.title}
                  </p>

                  <p className="mt-3 font-semibold text-(--black)">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.a
            href="/app"
            whileHover={{ scale: 1.05 }}
            className="group mt-12 flex items-center gap-3 rounded-full bg-(--black) px-10 py-4 text-sm font-semibold text-(--cream) transition hover:bg-(--brown-dark)"
          >
            Prendre rendez-vous
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </motion.a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Contact;
