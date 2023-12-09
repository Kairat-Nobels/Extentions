let intervalId

const addClock = (dataS) =>
{
    let div = document.querySelector('#SpamBanner')
    if (!div) {
        div = document.createElement('div')
        div.setAttribute('id', 'SpamBanner')
    }

    div.style = `
        width: 150px;
        position: fixed;
        bottom: 30px;
        left: 20px;
        cursor: pointer;
        z-index: 9999;
        color: #fff;
        border-radius: 10px;
        background-color: #000;
        font-size: 12px;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
    `
    const body = document.querySelector('body')
    body.appendChild(div)


    const data = document.createElement('a')
    data.href = dataS.url;
    data.target = '_blank';
    data.style = `text-decoration: none;`
    const img = document.createElement('img')
    img.src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLufM6w6SuJtsgqNilEa7lYohzLjrjBvZQQCmhtNHlJBVXhHCwFLlbc8BB3q7dgQwmkf8fSTUgaEqxdTAd-ES3YueNinms54ShRSITGaIiiQp6j03b9U3m7eTngdW0m8OYt6Oj69QhbcybOnqjiGbT80tcUHPXfC7umrVg7178Qmj9_ov-iN0L8tHiAJc/s320/Group%2023.png'
    img.style = `
            width: 90px;
        `
    const text = document.createElement('h4')
    text.style = `margin: 10px 0px 0px 0px; color: #f2f2f2; text-align: center; font-size: 14px;`
    text.textContent = dataS.text
    data.innerHTML = `<div style="display: flex; padding: 10px; border-radius: 10px; flex-direction: column; align-items: center;">${img.outerHTML}${text.outerHTML}</div>`
    div.appendChild(data)
}

const removeClock = () =>
{
    clearInterval(intervalId)
    const content = document.querySelector('#SpamBanner')
    if (content) {
        content.parentNode.removeChild(content)
    }
}


chrome.storage.onChanged.addListener((changes, namespace) =>
{
    if (changes?.data) {
        if (changes.data.active) {
            addClock(data)
        } else {
            removeClock()
        }
    }
});

chrome.storage.sync.get(['data'], (result) =>
{
    const data = result.data || '';
    if (data) {
        data.active ? addClock(data) : removeClock()
    } else {
        removeClock();
    }

});
