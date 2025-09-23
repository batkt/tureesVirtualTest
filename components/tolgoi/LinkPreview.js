import React, { useState, useEffect } from "react";

const LinkPreview = ({ url, className = "", height = 800 }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!url || !isValidUrl(url)) return;

    setLoading(true);
    setError(null);
    setPreview(null);

    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    const basicPreview = {
      title: domain,
      description: url,
      url: url,
      image: null,
      domain: domain,
    };

    fetchLinkPreview(url)
      .then((data) => {
        setPreview(data || basicPreview);
        setError(null);
      })
      .catch((err) => {
        setPreview(basicPreview);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const extractYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchYouTubeData = async (videoId) => {
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oEmbedUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube data");
      }

      const data = await response.json();
      return {
        title: data.title,
        description: `Watch "${data.title}" on YouTube`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        image: data.thumbnail_url,
        domain: "youtube.com",
        author: data.author_name,
        type: "video",
        videoId: videoId,
      };
    } catch (error) {
      return {
        title: "YouTube Video",
        description: "Watch this video on YouTube",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        domain: "youtube.com",
        type: "video",
        videoId: videoId,
      };
    }
  };

  const fetchLinkPreview = async (url) => {
    try {
      const urlObj = new URL(url);

      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
          return await fetchYouTubeData(videoId);
        }
      }

      let title = urlObj.hostname;
      let description = `Visit ${urlObj.hostname}`;

      if (urlObj.hostname.includes("github.com")) {
        title = "GitHub Repository";
        description = "View repository on GitHub";
      } else if (urlObj.hostname.includes("google.com")) {
        title = "Google Search";
        description = "Search on Google";
      } else if (urlObj.hostname.includes("facebook.com")) {
        title = "Facebook Post";
        description = "View on Facebook";
      } else if (
        urlObj.hostname.includes("twitter.com") ||
        urlObj.hostname.includes("x.com")
      ) {
        title = "Twitter Post";
        description = "View on Twitter/X";
      } else if (urlObj.hostname.includes("linkedin.com")) {
        title = "LinkedIn Post";
        description = "View on LinkedIn";
      }

      return {
        title,
        description,
        url: url,
        image: null,
        domain: urlObj.hostname,
        type: "link",
      };
    } catch (error) {
      throw new Error("Failed to fetch link preview");
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (preview?.type === "video" && preview?.videoId) {
      setIsPlaying(true);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleStopPlaying = () => {
    setIsPlaying(false);
  };

  if (!url || !isValidUrl(url)) {
    return null;
  }

  if (loading) {
    return (
      <div className={`link-preview-loading ${className}`}>
        <div className="w-full rounded border p-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <span className="text-sm text-gray-500">Loading preview...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`link-preview-error ${className}`}>
        <div className="w-full rounded border p-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">🔗</span>
            <span className="text-sm text-gray-500">Preview unavailable</span>
          </div>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className={`link-preview-loading ${className}`}>
        <div className="w-full rounded border p-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <span className="text-sm text-gray-500">Loading preview...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`link-preview ${className}`}>
      <div className="w-full overflow-hidden rounded border">
        {preview.type === "video" && preview.videoId ? (
          <div className="relative">
            {isPlaying ? (
              <div className="relative">
                <iframe
                  width="100%"
                  height={height}
                  src={`https://www.youtube.com/embed/${preview.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={preview.title || "YouTube Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                  style={{ height: `${height}px` }}
                />
                <button
                  onClick={handleStopPlaying}
                  className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1 text-white transition-all duration-200 hover:bg-opacity-70"
                  title="Stop playing"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h12v12H6z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative cursor-pointer" onClick={handleClick}>
                <img
                  src={preview.image}
                  alt={preview.title || "Video preview"}
                  className="w-full object-cover"
                  style={{ height: `${height}px` }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-all duration-200 hover:bg-opacity-30">
                  <div className="rounded-full bg-red-600 p-3 shadow-lg">
                    <svg
                      className="ml-1 h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="p-3">
              <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {preview.title || "Video"}
              </h4>
            </div>
          </div>
        ) : (
          <div
            className="flex cursor-pointer items-start space-x-3 p-3 transition-shadow duration-200 hover:shadow-md"
            onClick={handleClick}
          >
            {preview.image && (
              <div className="flex-shrink-0">
                <img
                  src={preview.image}
                  alt={preview.title || "Link preview"}
                  className="h-16 w-16 rounded object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {preview.title || "Link"}
                  </h4>
                  {preview.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                      {preview.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-1">
                    <span className="text-xs text-gray-400">🔗</span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {preview.domain || "Unknown domain"}
                    </span>
                  </div>
                </div>
                <span className="ml-2 flex-shrink-0 text-xs text-gray-400">
                  ↗
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkPreview;
