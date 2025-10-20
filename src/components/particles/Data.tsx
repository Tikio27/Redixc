export const NavLinks = [
    {
        name: "Inicio",
        url: "/"
    },
    {
        name: "Sobre Nosotros",
        url: "/about"
    },
    {
        name: "Legal",
        url: "/legal"
    }
];

export const HeroAboutTexts = [
    {
        Heading: "En Redixc, conectamos más que internet: conectamos oportunidades",
        Paragraph: "",
        Button: "¡Conoce más sobre nosotros!"
    }
]

export const HeroLegalTexts = [
    {
        Heading: "En Redixc, creemos que la claridad legal es parte de nuestro servicio.",
        Paragraph: "Aquí encontrarás toda la información relevante para que navegues con seguridad. ¿Preguntas? Contacta a nuestro equipo: info@redixc.net",
        Button: "Consulta nuestros documentos"
    }
]

export const HeroTexts = [
    {
        Heading: "REDIXC La fibra que te conecta al mundo",
        Paragraph: "En REDIXC, llevamos la conexión a otro nivel para que trabajes, estudies, disfrutes y te entretengas.",
        Button: "¡Descubre el poder de una conexión real y déjate sorprender!"
    }
    // {
    //     Heading: "New Heights of Fitness!",
    //     Paragraph: "Push your limits and achieve greatness at our gym! Join our supportive community and embark on a journey of self-improvement and empowerment!",
    //     Button: "Sign Up Today!"
    // },
    // {
    //     Heading: "Fitness is Fun with Us!",
    //     Paragraph: "At our gym, fitness is not just a routine; it's an enjoyable adventure! Join us in this fitness expedition, where fun and results go hand in hand!",
    //     Button: "Enroll Now!"
    // }
]


export const AboutTexts = {
    firstText: "Redixc",
    secondText: "Bienvenido",
    caption: "Con Redixc disfruta Internet rápido, confiable y con cobertura local en Santiago Ixcuintla, Nayarit y sus localidades",
    paragraph1: "Navega, trabaja, o disfruta de tus series, películas y juegos. Sabemos lo importante que es estar conectado al mundo, REDIXC está para hacerlo simple.",
}

export const AboutSectionTexts = {
    firstText: "La fibra que te conecta al mundo",
    secondText: "REDIXC",
    caption: "En Redixc creemos en un internet que conecta oportunidades. Llevamos el internet para que estudies, trabajes o disfrutes de tu entretenimiento.",
    mision: "Misión: Ofrecer conexiones estables y rápidas, con tecnología de punta y atención personalizada.",
    vision: "Visión: Ser líderes en cobertura de fibra óptica, llevando inclusión digital a cada rincón.",
    values: "Valores: Transparencia, soporte personalizado y mejora continua. ¡Tu satisfacción es nuestra métrica!"
}

export const OfferTexts = {
    firstText: "Lo que hacemos",
    secondText: "Toda nuestra oferta",
    list: [
        {
            listCaption: "¡Adiós al buffering!",
            text: "Llevamos conexión de alta velocidad a tu hogar o negocio",
        },
        {
            listCaption: "El mundo en tus manos",
            text: "Te conectamos con el mundo de forma estable, rápida y sin cortes.",
        }
        , {
            listCaption: "EXTRAS QUE MARCAN LA DIFERENCIA",
            text: "Instalación rápida y sin líos, soporte técnico (de humanos, no robots), sin letra pequeña tramposa",
        }
    ],
}

export const LegalTexts = {
    firstText: "Transparencia que construye confianza",
    secondText: "En Redixc, creemos que la claridad legal es parte de nuestro servicio. Aquí encontrarás toda la información relevante para que navegues con seguridad. ¿Preguntas? Contacta a nuestro equipo: info@redixc.net",
    list: [
        {
            listCaption: "Carta de los derechos minimos de los usuarios",
            text: "Establece los derechos esenciales que garantizamos a todos nuestros usuarios, conforme a la legislación. Aquí encontrarás información transparente sobre lo que puedes esperar de nuestro servicio.",
            link: "/docs/CartadeDerechosMinimosUsuarios.pdf",
            fileName: "Carta de los derechos minimos de los usuarios.pdf"
        },
        {
            listCaption: "Titulo de Consesión",
            text: "Redixc opera bajo los permisos y licencias otorgados por las autoridades competentes, garantizando un servicio regulado y confiable.",
            link: "/docs/TituloDeConcesion.pdf",
            fileName: "Titulo de Consesion.pdf"
        },
        {
            listCaption: "Contrato de Adhesión aprobado por Profeco",
            text: "Registro de contrato de adhesión de telecomunicaciones",
            link: "/docs/Contrato_Adhesion_aprobado_por_Profeco.pdf",
            fileName: "Contrato de Adhesion aprobado por PROFECO.pdf"
        },
        {
            listCaption: "Contrato de Adhesión del Servicio de Internet",
            text: "Contrato de prestación del servicio de internet fijo",
            link: "/docs/Contrato_Adhesion_Servicio_de_Internet.pdf",
            fileName: "Contrato de Adhesion del Servicio de Internet.pdf"
        }
    ],
}

export const MembershipPlans = {
    firstText: "Nuestros Planes de Internet",
    secondText: "En Redixc no hay un plan único para todos, porque sabemos que cada hogar y negocio tiene necesidades diferentes. ¡Elige el tuyo!",
    thirdText: "BENEFICIOS COMUNES A TODOS LOS PLANES",
    benefits: ["Sin contratos forzosos (Mes a mes)", "Soporte: Atendido por técnicos locales (no chatbots).", "Sin trampas: Precios fijos, sin aumentos sorpresa."],
    cards: [
        {
            amount: 300,
            duration: "mes",
            description: "Para estar conectado al mundo y no perderte nada.",
            caption: 'BÁSICO',
            speed: "30 Mbps / 20 Mbps",
            benefits: ["Ideal para navegar, redes sociales", "Correos electrónicos"]
        },
        {
            amount: 350,
            duration: "mes",
            caption: 'ESENCIAL',
            speed: "35 Mbps / 25 Mbps",
            description: "Ideal para familias pequeñas que usan internet todos los días.",
            benefits: ["Videollamadas ocasionales",  "Streaming en calidad estándar"],
        },
        {
            amount: 400,
            duration: "mes",
            description: "Navegación rápida y fluida para toda la familia.",
            caption: 'PLUS',
            speed: "50 Mbps / 40 Mbps",
            benefits: ["Disfruta de tus plataformas de video favoritas", "Videollamadas para trabajo o familia"]
        },
        {
            amount: 500,
            duration: "month",
            description: "Para hogares activos con varios dispositivos.",
            caption: 'PREMIUM',
            speed: "80 Mbps / 50 Mbps",
            benefits: ["Juegos online", "Descargas mas rápidas"]
        },
        {
            amount: 600,
            duration: "month",
            description: "Conéctate con más velocidad, más dispositivos y más comodidad.",
            caption: 'ULTRA',
            speed: "100 Mbps / 80 Mbps",
            benefits: ["Streaming en 4K", "Gaming y trabajo remoto avanzado"]
        },
        {
            amount: 800,
            duration: "month",
            description: "Potencia total, ideal para usuarios exigentes.",
            caption: 'MAX',
            speed: "150 Mbps / 100 Mbps",
            benefits: ["Máximo rendimiento y velocidad", "Streaming y gaming simultáneo"]
        }
    ]
}

export const ContactTexts = {
    firstText: "¡Llámanos Hoy!",
    phone: "+52 311-144-7676",
    paragraph: "¿Necesitas ayuda para elegir el plan perfecto? ¿O prefieres que un experto te asesore sin compromiso?",
    button: "La mejor conexión empieza con una buena conversación"
}

export const TestimonialTexts = {
    firstText: "our testimonials",
    secondText: "What Clients Say",
    feedBacks: [
        {
            text: "I've been a member for six months, and the gym's supportive community and knowledgeable trainers have helped me surpass my fitness goals!",
            person: "Darrell Murray",
            type: "Client"
        },
        {
            text: "The Yoga classes have transformed my life; I feel more centered, strong, and peaceful every time I step on the mat.",
            person: "Derrick Rodriquez",
            type: "Client"
        },
        {
            text: "Attending the Special Class has been a game-changer! It's intense, but the results are incredible. Highly recommended!",
            person: "Collins Thompson",
            type: "Client"
        }
    ],
}

export const BlogTexts = {
    firstText: "Get informed",
    secondText: "Our Latest News",
    blogNews: [
        {
            caption: "Yoga",
            title: "Do your self realizations quickly fade",
            paragraph: "Discover the transformative power of yoga as we explore its numerous physical and mental benefits. From increased flexibility and strength to reduced stress and enhanced mindfulness, our yoga classes cater to practitioners of all levels. Join us on the mat and experience the harmony of mind, body, and soul.",
            time: "1m",
            author: "Ralph Cruz",
            comments: "21"
        },
        {
            caption: "Trainers & Equipment",
            title: "Little Things Do make a difference",
            paragraph: "At our gym, we take pride in our exceptional team of expert trainers who are passionate about guiding you on your fitness journey. With their knowledge and personalized approach, you'll receive the support you need to achieve your fitness goals effectively. Additionally, we offer state-of-the-art equipment that's designed to elevate your workouts and provide a holistic fitness experience like no other.",
            time: "15m",
            author: "Bruce Charles",
            comments: "45"
        },
        {
            caption: "Procrastination",
            title: "The Time is Now",
            paragraph: "Procrastination can be a common obstacle on the path to achieving our goals. In this blog, we delve into effective strategies to overcome procrastination and increase productivity. From time management techniques to staying motivated, we're here to help you take charge of your goals and embrace a more focused and fulfilling life. It's time to seize the day and make your dreams a reality!",
            time: "19m",
            author: "Steve Wagner",
            comments: "55"
        }
    ]
}

export const FooterTexts = {
    underLogoText: 'En Redixc no solo te ofrecemos fibra óptica; somos tu aliado para conectarte al mundo digital. "La fibra que te conecta al mundo" es solo el comienzo.',
    quickLinks: {
        caption: "Mapa del sitio",
        links: [
            {
                name: "Inicio",
                url: "/"
            },
            {
                name: "Sobre Nosotros",
                url: "/about"
            },
            {
                name: "Legal",
                url: "/legal"
            }
        ]
    },
    contacts: {
        caption: "Contacto",
        names: [
            {
                name: "Rafael Mejía Amaral #55, EL Botadero, Santiago Ixcuintla, Nayarit, C.P. 63575",
            },
            {
                name: "info@redixc.net",
            },
            {
                name: "+52 311-144-7676",
            }
        ]
    },
    copyright: "Redixc – Internet de fibra óptica en Santiago Ixcuintla, Nayarit y localidades cercanas como El Botadero, Pueblo Nuevo, El Carrizo y Villa Juarez. Conexión rápida, estable y con soporte local. © 2025 Redixc.net"
}