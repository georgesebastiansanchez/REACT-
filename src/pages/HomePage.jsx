import Navbar from "../components/Navbar";
import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import Catalogo from "../components/Catalogo";
import CarritoSidebar from "../components/CarritoSidebar";
import About from "../components/About";
import Ubicacion from "../components/Ubicacion";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <Header />
      <LoginModal />
      <Catalogo />
      <CarritoSidebar />
      <About />
      <Ubicacion />
      <Footer />
    </>
  );
}

export default HomePage;
