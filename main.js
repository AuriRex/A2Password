
document.addEventListener("DOMContentLoaded", async function() { await FlashCodesAndStuff(); });

const DEF_DELAY = 1000;
// https://stackoverflow.com/a/52357953
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

function onDownClick() {
    window.scrollBy({
        top: 10000,
        left: 0,
        behavior: "instant",
    });
}

async function FlashCodesAndStuff() {
    const bgImg = document.getElementById("bg-img");
    bgImg.style = "background-image: url(\"img/GTFO_" + (Math.floor(Math.random() * 3) + 1) + ".jpg\");";

    
    const code = document.getElementById("code");
    const codePrevious = document.getElementById("code-prev");
    const codeNext = document.getElementById("code-next");

    let date = new Date();

    let week = date.getWeek();
    let year = date.getFullYear();

    let prevWeek = week - 1;
    let prevYear = year;
    if(prevWeek < 0) {
        prevWeek = 52;
        prevYear--;
    }

    let nextWeek = week + 1;
    let nextYear = year;
    if(nextWeek > 52) {
        nextWeek = 0;
        nextYear++;
    }

    for(var i = 0; i < 25; i++) {
        code.innerHTML = GenerateRandomPassword();
        codePrevious.innerHTML = GenerateRandomPassword("Prev: ");
        codeNext.innerHTML = GenerateRandomPassword("Next: ");
        await sleep(50);
    }

    document.getElementsByTagName("html")[0].style = "overflow: visible;";

    codePrevious.innerHTML = "<nobr>Prev: " + GenerateComplexPasswordForValues(prevYear, prevWeek) + "</nobr>";
    code.innerHTML = "<nobr>" + GenerateComplexPasswordForValues(year, week) + "</nobr>";
    codeNext.innerHTML = "<nobr>Next: " + GenerateComplexPasswordForValues(nextYear, nextWeek) + "</nobr>";
}

function GenerateRandomPassword(prefix = "") {
    var year = Math.floor(Math.random() * 2001);
    var week = Math.floor(Math.random() * 2001);

    return "<nobr>" + prefix + GenerateComplexPasswordForValues(year, week) + "</nobr>";
}