// Utility functions for handling links and URLs in notifications

/**
 * Extract URLs from text content
 * @param {string} text - The text content to search for URLs
 * @returns {Array} Array of URL objects with url, start, and end positions
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
 * Check if a string is a valid URL
 * @param {string} string - String to validate
 * @returns {boolean} True if valid URL
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
 * @param {string} text - Text content containing URLs
 * @param {Function} renderLinkPreview - Function to render link preview component
 * @returns {Array} Array of text segments and link preview components
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
 * @param {string} url - URL to extract domain from
 * @returns {string} Domain name
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
 * @param {string} url - URL to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated URL
 */
export const truncateUrl = (url, maxLength = 50) => {
  if (!url || url.length <= maxLength) return url;

  const domain = getDomainFromUrl(url);
  if (domain.length >= maxLength) return domain;

  return `${domain}...`;
};
