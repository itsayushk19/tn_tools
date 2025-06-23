export function formatTweetContent(content) {
  const mentionRegex = /@\w+/g;
  const hashtagRegex = /#\w+/g;
  const linkRegex = /https?:\/\/[^\s]+/g;

  const formattedContent = content
    .replace(mentionRegex, m => `<span class="tweet-mention">${m}</span>`)
    .replace(hashtagRegex, h => `<span class="tweet-hashtag">${h}</span>`)
    .replace(linkRegex, l => `<span class="tweet-link">${l}</span>`);

  return { __html: formattedContent };
}

export function formatTime(date) {
  const now = new Date();
  const diff = Math.abs(now - new Date(date));
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  const opts = { day: "numeric", month: "short" };
  return new Date(date).toLocaleDateString("en-US", opts).replace(".", "");
}

export function formatNumber(count) {
  if (count < 1e3) return `${count}`;
  if (count < 1e6) return `${Math.floor(count / 1e3)}k`;
  if (count < 1e9) return `${Math.floor(count / 1e6)}M`;
  if (count < 1e12) return `${Math.floor(count / 1e9)}B`;
  return `${Math.floor(count / 1e12)}T`;
}
