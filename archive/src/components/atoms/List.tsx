type ListProps = {
    className?: string
    children: React.ReactNode | string
}

export const List = ({ className, children, ...rest }: ListProps) => {
    return (
        <>
            <div className={className} {...rest}>{children}</div>
        </>
    )
}