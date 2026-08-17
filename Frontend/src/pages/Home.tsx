import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Services from "../components/home/Services";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Gallery from "../components/home/Gallery";
import Testimonials from "../components/home/Testimonials";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
};

export default Home;
