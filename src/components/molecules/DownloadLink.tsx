type DownloadLink = {
    className: string
    url: string
    fileName: string
    text: string
}

export const DownloadLink = ({ className, url, fileName, text }: DownloadLink) => {
    return (
    <a className={className} href={url} download={fileName}>
      {text}
    </a>
  );
}
