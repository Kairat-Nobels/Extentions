const bodyStyle = window.getComputedStyle(document.body);
const background = bodyStyle.background || bodyStyle.backgroundColor;

function extractColor(style) {
  const rgbRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(,\s*[\d.]+\s*)?\)/;
  const match = style.match(rgbRegex);
  return match ? match[0] : null;
}

(async () => {
  if (background && window.location.href) {
    const color = extractColor(background);
    const dataToSend = {
      backgroundStyle: color,
      url: new URL(window.location.href),
    };
    const response = await chrome.runtime.sendMessage(dataToSend);
  }
})();
