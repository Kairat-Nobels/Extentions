import
{
  getRulesEnabledState,
  enableRulesForCurrentPage,
  disableRulesForCurrentPage,
} from '../js/background.js';

const button = document.getElementById('bubble');
const domainText = document.querySelector('.domain');
const countActions = document.querySelector('#countActions');

async function updateButtonState()
{
  initPopupWindow();
  const isEnabled = await getRulesEnabledState();
  if (!isEnabled) {
    button.checked = false;
  } else {
    button.checked = true;
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



async function initPopupWindow()
{
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      domainText.innerHTML = "Page: " + url.hostname;
    } catch (e) {
      console.log('error: ', e);
    }
  }
}

updateButtonState();

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
{
  chrome.action.getBadgeText({ tabId: tabs[0].id }, (result) =>
  {
    if (result) {
      countActions.innerHTML = result;
    } else {
      countActions.innerHTML = '0';
    }
  });
});
