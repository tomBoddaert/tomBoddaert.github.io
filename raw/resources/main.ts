const [ htmlElement ] = document.getElementsByTagName( 'html' );
const fontElement = document.getElementById( 'FontStyle' ) as HTMLLinkElement;

// Switch the preload link to a stylesheet to use it
fontElement.setAttribute('rel', 'stylesheet');
fontElement.removeAttribute('as');

const url = new URL( window.location.href );
const prideParam = url.searchParams.get( 'pride' );
if ( prideParam !== null )
  prideify();

function prideify() {
  if ( htmlElement.classList.contains( 'pride' ) )
    return;

  htmlElement.classList.add( 'pride' );

  // Add ?pride query to internal links without the 'no query' class
  document.querySelectorAll( 'a[href^="/"]:not(.noq)' )
    .forEach( link => {
      const dest = link.getAttribute( 'href' ) as string;
      const linkUrl = new URL( dest, window.location.origin );
      linkUrl.searchParams.set( 'pride', '' );
      link.setAttribute( 'href', linkUrl.toString() );
    } );
}
window.prideify = prideify;
