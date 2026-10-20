import { useCallback, useRef } from "react";
import { Image } from "../atoms/Image"
import HeroImg1 from "../../assets/redixc/cyberpunk-justice.webp"
// import HeroImg2 from "../../assets/hero/2.webp"
// import HeroImg3 from "../../assets/hero/4.webp"
import { HeroLegalTexts } from "../particles/Data";
import Slider from "react-slick";
import { Text } from "../atoms/Text";
import { Slide, Zoom } from "react-awesome-reveal";
import { ArrowCircleDownIcon } from "@phosphor-icons/react";


const HeroLegal = () => {

    const sliderRef = useRef<Slider | null>();

    // Function for next button
    // const next = () => {
    //     if (sliderRef.current) {
    //         sliderRef.current.slickNext();

    //     }
    // };
    // // function for previous button
    // const previous = () => {
    //     if (sliderRef.current) {
    //         sliderRef.current.slickPrev();
    //     }

    // };

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        cssEase: "linear",
    };

    const renderProfileImg = useCallback((element: number) => {
        switch (element) {
            case 0:
                return HeroImg1;
            // case 1:
            //     return HeroImg2;
            // case 2:
            //     return HeroImg3;
            default:
                return "";
        }
    }, [])
    return (
        <section className="w-full h-auto bg-gradient-to-r from-red-500 to-amber-500 relative overflow-x-hidden">
            <Slider ref={(slider) => (sliderRef.current = slider)} {...settings} className="h-full">
                {
                    HeroLegalTexts.map((hero, index) => (
                        <main className="w-full lg:h-screen h-screen relative bg-zinc-900 overflow-x-hidden" key={index}>
                            <link rel="preload" fetchpriority="high" as="image" href={renderProfileImg(index)} type="image/webp"></link>
                            <Zoom className="h-full">
                                <Image lazyLoading="eager" fetchpriority="high" className="md:w-[100%] w-full h-full opacity-25" alt="HeroImg1" objectCover="object-cover" image={renderProfileImg(index)} />
                            </Zoom>

                            <div className="md:w-[50%] w-full md:h-full h-1/2 absolute md:top-0 top-1/3 right-0 left-0 m-auto bg-transparent flex flex-col md:justify-center justify-start lg:gap-8 md:gap-4 gap-2 lg:px-20 md:px-6 px-4 overflow-x-hidden">
                                <Text as="h1" className="text-3xl md:mt-10 mt-10 text-zinc-100 font-extrabold text-center">
                                    <Slide direction="right">
                                        {hero.Heading}
                                    </Slide>
                                </Text>
                                <Text as="span" className="lg:text-lg text-base text-zinc-100 my-4 text-center">
                                    <Slide direction="left">
                                        {hero.Paragraph}
                                    </Slide>
                                </Text>
                                <div className="flex items-center gap-8 w-full">
                                    <Slide direction="up" className="w-full">
                                        <Text className="w-full flex justify-center gap-3 items-center px-10 font-medium text-white py-2.5 bg-gradient-to-r whitespace-nowrap from-red-500 to-amber-500">
                                            {hero.Button} <ArrowCircleDownIcon size={32} />
                                        </Text>
                                    </Slide>
                                    {/* <Slide direction="up">
                                        <a href="/" className="flex items-center gap-2 text-red-500 hover:text-amber-500 group">
                                            <YoutubeLogo size={20} color="currentColor" weight="fill" />
                                            <Text as="span" className="text-zinc-100 group-hover:text-amber-500 uppercase text-xs">Watch reviews</Text>
                                        </a>
                                    </Slide> */}
                                </div>
                            </div>
                        </main>

                    ))
                }
            </Slider>
            {/* <div className="flex justify-end lg:justify-start items-center gap-4 absolute lg:bottom-10 md:bottom-5 md:right-10 right-4 bottom-4">
                <Button onClick={previous} type="button" className="w-8 h-8 border rounded-full border-amber-500 flex items-center justify-center text-amber-500 hover:text-red-500 hover:border-red-500">
                    <ArrowCircleLeft size={20} color="currentColor" weight="light" />
                </Button>
                <Button onClick={next} type="button" className="w-8 h-8 border rounded-full border-amber-500 flex items-center justify-center text-amber-500 hover:text-red-500 hover:border-red-500">
                    <ArrowCircleRight size={20} color="currentColor" weight="light" />
                </Button>
            </div> */}

            {/* <StickyIcons /> */}

        </section>
    )
}

export default HeroLegal