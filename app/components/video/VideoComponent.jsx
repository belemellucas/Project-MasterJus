function VideoComponent({ infoSite }) {
  const extractYouTubeID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const videoId =
    infoSite && infoSite.length > 0
      ? extractYouTubeID(infoSite[0].linkVideo)
      : null;
  const title =
    infoSite && infoSite.length > 0 ? infoSite[0].tituloVideo : "Título";
  const description =
    infoSite && infoSite.length > 0 ? infoSite[0].descVideo : "Descrição";

  return (
    <div className="flex flex-col md:flex-row w-full bg-blue-900 h-auto md:h-[450px]">
       <div className="pt-4 flex-1 p-6 flex flex-col justify-center text-white h-auto md:h-[400px]">
    <h1 className="text-3xl font-bold mb-4 break-words md:break-words md:max-w-xl">{title}</h1>
    <p className="text-lg break-words md:break-words md:max-w-xl">{description}</p>
  </div>

      <div className="pt-6 flex-1 h-auto md:h-[400px]">
        <div className="relative w-full h-64 md:h-[400px]">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="youtube video"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <p className="text-white text-center">Loading Video...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoComponent;
