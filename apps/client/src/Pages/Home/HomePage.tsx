import AboutUs from "../../components/HomePage/AboutUs/AboutUs";
import Footer from "../../components/HomePage/Footer/Footer";
import LatestProducts from "../../components/HomePage/LatestProducts/LatestProducts";
import Navbar from "../../components/HomePage/Navbar/Navbar";
import Newsletter from "../../components/HomePage/Newsletter/Newsletter";
import ProductShowcase from "../../components/HomePage/ProductShowcase/ProductShowcase";
import HomeSwiper from "../../components/HomePage/Swiper/HomeSwiper";
import Testimonials from "../../components/HomePage/Testimonials/Testimonials";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <HomeSwiper />
            <ProductShowcase />
            <LatestProducts />
            <Newsletter />
            <Testimonials />
            <AboutUs />
            <Footer />
        </>
    );
}