import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const navLinks = [
  { label: "À propos", href: "#about" },
  { label: "Prestations", href: "#services" },
  { label: "Galerie", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socials = [{ icon: FaInstagram, href: "#", label: "Instagram" }];

const Footer = () => (
  <footer className="border-t border-white/10 bg-(--black) text-(--white)">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-16 sm:px-10 lg:px-20 lg:py-20">
      <div className="flex flex-col gap-12 md:flex-row">
        {/* IDENTITÉ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-5 md:flex-1"
        >
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--champagne) font-title text-lg font-bold text-(--black)">
              AK
            </span>

            <span className="flex flex-col leading-none">
              <span className="font-title text-2xl tracking-[0.15em] text-(--champagne)">
                SALONPRO
              </span>
              <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-white/50">
                Institute
              </span>
            </span>
          </a>

          <p className="max-w-xs text-sm leading-7 text-white/60">
            Un espace dédié à la beauté, au bien-être et à l'élégance, où
            chaque prestation est pensée pour révéler votre personnalité.
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-(--champagne) hover:text-(--champagne)"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* NAVIGATION */}
        <div className="md:flex-1">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-(--champagne)">
            Navigation
          </h3>

          <div className="flex flex-col gap-3 text-sm text-white/70">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex w-fit items-center gap-2 transition hover:text-(--champagne)"
              >
                {item.label}
                <ArrowUpRight
                  size={14}
                  className="opacity-0 transition group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="md:flex-1">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-(--champagne)">
            Contact
          </h3>

          <div className="flex flex-col gap-4 text-sm text-white/70">
            <p className="flex items-center gap-3">
              <MapPin size={17} className="shrink-0 text-(--champagne)" />
              Boumerdes, Algérie
            </p>

            <a
              href="tel:+21324000000"
              className="flex items-center gap-3 transition hover:text-(--champagne)"
            >
              <Phone size={17} className="shrink-0 text-(--champagne)" />
              +213 24 00 00 00 00
            </a>

            <p className="flex items-center gap-3">
              <FaInstagram size={17} className="shrink-0 text-(--champagne)" />
              @salonpro
            </p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          © 2026 SalonPro — Tous droits réservés
        </p>

        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Conçu avec soin en Algérie
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
