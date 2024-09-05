// ==UserScript==
// @name         Local Timezone
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  Uses local timezone on Scratch forums instead of Scratch Time
// @author       098765432154321
// @match        *://scratch.mit.edu/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scratch.mit.edu
// @grant        none
// @run-at       document-body
// @downloadURL  https://raw.githubusercontent.com/Real098765432154321/ScratchLocalTimezone/master/main.user.js
// @updateURL    https://raw.githubusercontent.com/Real098765432154321/ScratchLocalTimezone/master/main.user.js
// @history      2024-09-05 Add to homepage & subforum pages, (hopefully) fix bug with last day of a month not showing Yesterday, changed description
// @history      2024-08-29 Initial
// ==/UserScript==

const path = location.href.split("/").slice(4)

const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const now = new Date();
const offset = 144e5 - now.getTimezoneOffset() * 6e4;
const utc = new Date(now - offset);

function addZero(num) { return num > 9 ? num : "0" + num };
function fix(el) {
    const text = el.innerText;
    const split = text.split(" ")
    const args = [];
    if (["T", "Y"].includes(text[0])) {
        args[0] = utc.getFullYear();
        args[1] = utc.getMonth();
        args[2] = utc.getDate();
    } else {
        args[0] = split[2];
        args[1] = months.indexOf(split[0]);
        args[2] = +split[1].slice(0, -1);
    };
    args.push(...split[split.length - 1].split(":").map(e => +e));
    const date = new Date(new Date(...args) - -(offset - (text[0] == "Y") * 864e5));
    el.innerText = (["Today", "Yesterday"][Math.floor((now - date) / 864e5)] || (months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear())) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds())
};

document.querySelectorAll((path[0] != "topic" ? ".tcr" : ".box-head") + "> a").forEach(fix);
