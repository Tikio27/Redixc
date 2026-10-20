import { FacebookLogoIcon, InstagramLogoIcon, TwitterLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react";

const StickyIcons = () => {
    return (
        <aside className="fixed lg:bottom-0 bottom-1/2 left-0  flex flex-col gap-5 items-center bg-gradient-to-t z-40 from-red-500 to-amber-500 rounded-e-lg py-3 px-2 ">
            <a href="/" className="text-zinc-100 hover:text-zinc-900">
                <FacebookLogoIcon size={15} color="currentColor" weight="fill" />
            </a>
            <a href="/" className="text-zinc-100 hover:text-zinc-900">
                <TwitterLogoIcon size={15} color="currentColor" weight="fill" />
            </a>
            <a href="/" className="text-zinc-100 hover:text-zinc-900">
                <YoutubeLogoIcon size={15} color="currentColor" weight="fill" />
            </a>
            <a href="/" className="text-zinc-100 hover:text-zinc-900">
                <InstagramLogoIcon size={15} color="currentColor" weight="fill" />
            </a>
        </aside>
    )
}

export default StickyIcons