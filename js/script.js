const fromtext = document.querySelector(".from-text"),
    totext = document.querySelector(".to-text"),
    selectTag = document.querySelectorAll("select"),
    exchangeBtn = document.querySelector(".exchange"),
    translateBtn = document.querySelector("button"),
    icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // selecting english by default as from language and hindi as to language
        let selected;
        if (id == 0 && country_code == "en-GB") selected = "selected";
        else if (id == 1 && country_code == "hi-IN") selected = "selected";
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adding options tag inside select tag
    }
});

exchangeBtn.addEventListener("click", () => {
    let tempText = fromtext.value;
    tempLang = selectTag[0].value;
    fromtext.value = totext.value;
    selectTag[0].value = selectTag[1].value;
    totext.value = tempText;
    selectTag[1].value = tempLang;
})

translateBtn.addEventListener("click", () => {
    let text = fromtext.value,
        translateFrom = selectTag[0].value, // getting from select tag value
        translateTo = selectTag[1].value; // getting to select tag value
    if (!text) return;
    totext.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    // fetching api response and returning it with parsing into js obj and in another then method receving that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        totext.value = data.responseData.translatedText;
        totext.setAttribute("placeholder", "Translation");
    });
})

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromtext.value);
            } else {
                navigator.clipboard.writeText(totext.value);
            }
        }
        else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromtext.value);
                utterance.lang = selectTag[0].value; // setting utterance language to fromselect tag value
            }
            else {
                utterance = new SpeechSynthesisUtterance(totext.value);
                utterance.lang = selectTag[1].value; // setting uttrance language to toselect tag value
            }
            speechSynthesis.speak(utterance); // speak the passed utterance
        }
    })
})
