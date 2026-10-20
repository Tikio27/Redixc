type ImageOwnProps<T extends React.ElementType> = {
    className: string
    image: string
    alt: string
    objectCover?: string
    as?: T,
    lazyLoading?:  "eager" | "lazy" | undefined;
}

type ImageProps<T extends React.ElementType> = ImageOwnProps<T> & Omit<React.ComponentProps<T>, keyof ImageOwnProps<T>>

export const Image = <T extends React.ElementType = 'div'>({ className, image, alt, objectCover, as, fetchpriority, lazyLoading, ...rest }: ImageProps<T>) => {
    const Component = as || 'div'
    return (
        <Component className={className} {...rest}>
            <img loading={lazyLoading} fetchpriority={fetchpriority} src={image} alt={alt} className={`w-full h-full ${objectCover}`} />
        </Component>
    )
}
