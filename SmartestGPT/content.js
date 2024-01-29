function countWordsAndSave()
{
    const bodyText = document.body.innerText;
    const openAiCount = (bodyText.match(/OpenAI/gi) || []).length;
    const gptCount = (bodyText.match(/GPT/gi) || []).length;
    chrome.storage.local.set({ openAiCount, gptCount });
}

countWordsAndSave();