import About from "../organs/About"
import Contact from "../organs/Contact"
import HeroSection from "../organs/HeroSection"
import Membership from "../organs/Membership"
// import Offers from "../organs/Offers"



const Home = () => {
    return (
        <>
            <HeroSection />
            <About />
            {/* <Offers /> */}
            <Membership />
            {/* <Calculator /> */}
            {/* <Testimonials /> */}
            {/* <Blogs /> */}
            <Contact />
        </>
    )
}

export default Home