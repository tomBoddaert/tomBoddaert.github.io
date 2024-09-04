const [ htmlElement ] = document.getElementsByTagName( 'html' );
const fontElement = document.getElementById( 'FontStyle' ) as HTMLLinkElement;
const brainMadeLink = document.querySelector( '#BrainMade a' ) as HTMLAnchorElement;
const [ brainMadeNoScript ] = brainMadeLink.getElementsByTagName( 'noscript' );

// Switch the preload link to a stylesheet to use it
fontElement.setAttribute( 'rel', 'stylesheet' );
fontElement.removeAttribute( 'as' );

if ( brainMadeNoScript )
  // 'noscript' elements aren't always evaluated, so use HTML
  brainMadeLink.innerHTML = brainMadeNoScript.innerHTML;


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
