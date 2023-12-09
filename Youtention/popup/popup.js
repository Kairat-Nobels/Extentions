import
{
  getRulesEnabledState,
  enableRulesForCurrentPage,
  disableRulesForCurrentPage,
} from '../js/background.js';

const wrapperPopup = document.querySelector('.wrapper');
const button = document.getElementById('btn-on');
const text = document.querySelector('.text-content');
const power = document.querySelector('#power');
const domain = document.querySelector('.domain');

async function updateButtonState()
{
  fetchDomain();
  const isEnabled = await getRulesEnabledState();
  if (!isEnabled) {
    text.innerHTML = 'Turned off. To turn on press the button';
    wrapperPopup.classList.add('disabled');
    power.src = '../images/logo-off.png';
    chrome.action.setIcon({
      path: {
        16: '../images/logo-off_16.png',
        48: '../images/logo-off_32.png',
        128: '../images/logo-off_64.png',
      },
    });
  } else {
    text.innerHTML = 'Enabled! To turn off press the button';
    wrapperPopup.classList.remove('disabled');
    power.src = '../images/logo.png';
    chrome.action.setIcon({
      path: {
        16: '../images/logo_16.png',
        48: '../images/logo_32.png',
        128: '../images/logo_64.png',
      },
    });
  }
}

button.addEventListener('click', async () =>
{
  const isEnabled = await getRulesEnabledState();
  if (isEnabled) {
    await disableRulesForCurrentPage();
  } else {
    await enableRulesForCurrentPage();
  }

  updateButtonState();
});

async function fetchDomain()
{
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      if (url.hostname) domain.innerText = "Your page: " + url.hostname;
    } catch { }
  }
}

const countActions = document.querySelector('.count')
updateButtonState();

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
{
  chrome.action.getBadgeText({ tabId: tabs[0].id }, (result) =>
  {
    if (result) {
      countActions.textContent = result;
    } else {
      countActions.textContent = '0';
    }
  });
});