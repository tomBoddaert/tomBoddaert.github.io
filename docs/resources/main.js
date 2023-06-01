const [html] = document.getElementsByTagName('html');
const url = new URL(window.location.href);
const prideParam = url.searchParams.get('pride');
if (prideParam !== null)
    prideify();
function prideify() {
    if (html.classList.contains('pride'))
        return;
    html.classList.add('pride');
    // Add ?pride query to internal links without the 'no query' class
    document.querySelectorAll('a[href^="/"]:not(.noq)')
        .forEach(link => {
        const dest = link.getAttribute('href');
        const linkUrl = new URL(dest, window.location.origin);
        linkUrl.searchParams.set('pride', '');
        link.setAttribute('href', linkUrl.toString());
    });
}
window.prideify = prideify;
