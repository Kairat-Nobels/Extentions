chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { backgroundStyle, url } = request;
  const cookieName = 'color';

  if (!url) {
    console.error(chrome.runtime.lastError.message);
    return;
  }

  chrome.cookies.set(
    {
      url: url,
      name: cookieName,
      value: backgroundStyle,
    },
    function (cookie) {
      if (cookie) {
        console.log(`Cookie set: ${cookieName}=${backgroundStyle}`);
      } else {
        console.error('Failed to set cookie.');
      }
    },
  );
});
