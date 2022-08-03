"use strict";
document.addEventListener('DOMContentLoaded', onLoad);
let html;
let url;
function onLoad() {
    html = document.getElementsByTagName('html')[0];
    url = new URL(window.location.href);
    const prideParam = url.searchParams.get('pride');
    if (prideParam !== null)
        prideify();
}
function prideify() {
    if (html.classList.contains('pride'))
        return;
    html.classList.add('pride');
    const title = document.querySelector("title");
    if (title)
        title.innerText = '🏳️‍🌈 ' + title.innerText;
    const profileImage = document.querySelector('.profile-image');
    if (profileImage)
        profileImage.classList.add('pride');
    const name = document.querySelector('.Name');
    if (name)
        name.innerHTML = '🏳️‍🌈 ' + name.innerHTML;
    const links = document.querySelectorAll('a[href^="/"]');
    for (let link of links) {
        const dest = link.getAttribute('href');
        link.setAttribute('href', dest + '?pride');
    }
}
