import { DownloadSimpleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { DownloadLink } from "./DownloadLink";

type PlanesRedixcProps = {
    name: string,
    speed: {
      download: string,
      upload: string
    },
    price: number,
    description: string,
    characteristics: string[],
    document: {
      link: string,
      text: string
    }
};
export const PlanCard = ({
  name,
  speed,
  price,
  description,
  characteristics,
  document,
  ...rest
}: PlanesRedixcProps) => {
  const handleClick = () => {
      const message = `¡Hola Redixc! 😊\nEstoy interesado en el servicio de Internet Redixc.\nMe gustaría contratar el plan *${name} / $${price}* de *${speed}*.\n¿Podrían confirmarme la cobertura y cómo iniciar el contrato?`;
      // Codificamos el mensaje
      const encoded = encodeURIComponent(message);

      // Detecta si el usuario está en móvil o escritorio
      const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

      // URL correcta según el dispositivo
      const baseUrl = isMobile
        ? `https://api.whatsapp.com/send?phone=523111447676&text=${encoded}`
        : `https://web.whatsapp.com/send?phone=523111447676&text=${encoded}`;

      // Abre WhatsApp
      window.open(baseUrl, "_blank");
      // window.open(`https://wa.me/523111447676?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className=" h-full flex flex-col justify-between rounded-xl border border-zinc-500 bg-white/5 p-6 transition-transform hover:-translate-y-2 hover:shadow-lg hover:shadow-black/40" {...rest}>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">{name}</h2>
          <div className="flex gap-2">
            <p className="text-base font-bold text-amber-500 flex items-center gap-1"><DownloadSimpleIcon size={20} />{speed.download}</p>
            <span className="text-xl font-bold text-amber-500">/</span>
            <p className="text-base font-bold text-amber-500 flex items-center gap-1"><UploadSimpleIcon size={20} />{speed.upload}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-500">${price}*</p>
          <p className="text-sm text-gray-400">mensual</p>
        </div>
      </div>

      <ul className="mb-4 space-y-2 text-gray-400">
        {characteristics.map((item, i) => (
          <li key={i} className="flex items-center">
            <span className="mr-2 text-amber-500">✔</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <span className="mr-2 text-amber-500">✔</span>
        <DownloadLink className="hover:underline text-gray-400" url={document.link} fileName={document.text} text="Consultar formato simple IFT"/>
      </div>
      

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">{description}</span>
        <button onClick={handleClick} className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-[#0a0f1a] transition-colors hover:bg-amber-700">
          Contratar
        </button>
      </div>
    </div>
  );
};
