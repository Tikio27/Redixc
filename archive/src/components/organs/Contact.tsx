import { Image } from "../atoms/Image"
import ContactImg from "../../assets/redixc/1.webp"
import { Text } from "../atoms/Text"
import { ContactTexts } from "../particles/Data"
import { Button } from "../atoms/Button"
import { WhatsappLogoIcon } from "@phosphor-icons/react"


const Contact = () => {

    const handleClick = () => {
        window.open('https://wa.me/523111447676?text=¡Hola%20Redixc!%20Estoy%20interesado%20en%20su%20servicio%20de%20internet.%20¿Podrían%20asesorarme%20sobre%20el%20plan%20ideal%20para%20mí?%20', '_blank', 'noopener,noreferrer');
    };

    return (
        <section className="w-full md:h-[400px] h-[500px] relative">
            <Image lazyLoading="lazy" fetchpriority="low" alt="Contact Image" className="w-full h-full" objectCover="object-cover object-top" image={ContactImg} />
            <div className="w-full px-4 h-full absolute top-0 left-0 bg-zinc-900/70 flex flex-col justify-center items-center gap-2">
                <Text as="p" className="tracking-widest text-amber-500 uppercase md:text-sm text-xs font-medium">
                    {ContactTexts.firstText}
                </Text>
                <Text as="h1" className="lg:text-5xl md:text-4xl text-3xl text-zinc-100">
                    {ContactTexts.phone}
                </Text>
                <Text as="p" className="text-zinc-100 md:w-1/2 w-4/5 text-center text-lg my-6">
                    {ContactTexts.paragraph}
                </Text>
                <Button onClick={handleClick} className="p-5 md:w-auto w-full rounded flex justify-items-center gap-2 items-center font-medium text-white py-2.5 bg-gradient-to-r from-red-500 to-amber-500" type="button">
                    <WhatsappLogoIcon size={32} />
                    <Text className="font-medium text-white whitespace-wrap">
                        {ContactTexts.button}
                    </Text>
                </Button>
            </div>
        </section>
    )
}

export default Contact