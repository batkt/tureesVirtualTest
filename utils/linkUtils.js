 

/**
 * Extract URLs from text content
 * @param {string} text  
 * @returns {Array}  
 */
export const extractUrls = (text) => {
  if (!text || typeof text !== "string") return [];

  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    urls.push({
      url: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return urls;
};

/**
 *  
 * @param {string} string  
 * @returns {boolean}  
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Replace URLs in text with link previews
 * @param {string} text  
 * @param {Function} renderLinkPreview 
 * @returns {Array}  
 */
export const replaceUrlsWithPreviews = (text, renderLinkPreview) => {
  if (!text || typeof text !== "string") return [text];

  const urls = extractUrls(text);
  if (urls.length === 0) return [text];

  const segments = [];
  let lastIndex = 0;

  urls.forEach((urlObj, index) => {
    if (urlObj.start > lastIndex) {
      segments.push(text.slice(lastIndex, urlObj.start));
    }

    segments.push(renderLinkPreview(urlObj.url, index));

    lastIndex = urlObj.end;
  });

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
};

/**
 * Get domain from URL
 * @param {string} url  
 * @returns {string}  
 */
export const getDomainFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return url;
  }
};

/**
 * Truncate URL for display
 * @param {string} url  
 * @param {number} maxLength  
 * @returns {string}  
 */
export const truncateUrl = (url, maxLength = 50) => {
  if (!url || url.length <= maxLength) return url;

  const domain = getDomainFromUrl(url);
  if (domain.length >= maxLength) return domain;

  return `${domain}...`;
};

