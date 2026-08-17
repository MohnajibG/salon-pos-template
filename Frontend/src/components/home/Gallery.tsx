import { motion } from "framer-motion";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=90",
    title: "Espace beauté",
  },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90",
    title: "Coiffure & soins",
  },
  {
    src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=90",
    title: "Mise en beauté",
  },
  {
    src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=90",
    title: "Moment détente",
  },
  {
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=90",
    title: "Expertise beauté",
  },
  {
    src: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=90",
    title: "Soin personnalisé",
  },
];

const Gallery = () => (
  <section
    id="gallery"
    className="w-full overflow-hidden bg-(--black) px-6 py-24 text-(--white) sm:px-10 lg:px-20"
  >
    <div className="mx-auto flex max-w-7xl flex-col">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--champagne)">
          Galerie
        </p>

        <h2 className="mt-5 max-w-3xl font-title text-3xl font-bold sm:text-5xl">
          Découvrez notre univers beauté
        </h2>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-(--white)/60 sm:text-base">
          Un aperçu de notre institut, de nos espaces et de nos créations
          réalisées avec passion par notre équipe.
        </p>
      </motion.div>

      {/* GALERIE */}
      <div className="mt-14 flex flex-wrap gap-6">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative w-full overflow-hidden rounded-3xl border border-(--white)/10 bg-(--white)/5 p-2 backdrop-blur-md sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="relative overflow-hidden rounded-[22px]">
              <img
                src={image.src}
                alt={image.title}
                className="h-90 w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-(--black)/80 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 translate-y-5 p-6 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold tracking-wide text-(--white)">
                  {image.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
