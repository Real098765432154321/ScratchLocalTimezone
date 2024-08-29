// ==UserScript==
// @name         Local Timezone
// @namespace    http://tampermonkey.net/
// @version      2024-08-29
// @description  Uses local timezone on Scratch forum posts instead of Scratch Time
// @author       098765432154321
// @match        *://scratch.mit.edu/discuss/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scratch.mit.edu
// @grant        none
// @run-at       document-body
// @downloadURL  https://raw.githubusercontent.com/Real098765432154321/ScratchLocalTimezone/master/main.user.js
// @updateURL    https://raw.githubusercontent.com/Real098765432154321/ScratchLocalTimezone/master/main.user.js
// ==/UserScript==

const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const now = new Date();
const offset = 144e5 - now.getTimezoneOffset() * 6e4;
const utc = new Date(now - offset);

function addZero(num) { return num > 9 ? num : "0" + num }

document.querySelectorAll(".box-head > a").forEach(time => {
    const text = time.innerText;
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
    time.innerText = (["Today", "Yesterday"][now.getDate() - date.getDate()] || (months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear())) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
});