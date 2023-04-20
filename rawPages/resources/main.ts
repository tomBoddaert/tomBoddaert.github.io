document.addEventListener( 'DOMContentLoaded', onLoad );

let html: HTMLHtmlElement;
let url: URL;

function onLoad() {
  html = document.getElementsByTagName( 'html' )[ 0 ];
  url = new URL( window.location.href );

  addClickAccessibility();

  const prideParam = url.searchParams.get( 'pride' );
  if ( prideParam !== null )
    prideify();
}

function addClickAccessibility() {
  document.addEventListener( 'keyup', event => {
    if ( event.key === 'Enter' || event.key === ' ' )
      if ( document.activeElement?.getAttribute( 'onclick' ) )
        // eslint-disable-next-line no-extra-parens
        ( document.activeElement as HTMLElement ).click();
  } );
}

function prideify() {
  if ( html.classList.contains( 'pride' ) )
    return;

  html.classList.add( 'pride' );

  const title = document.querySelector( 'title' );
  if ( title )
    title.innerText = `🏳️‍🌈 ${ title.innerText }`;

  const profileImage = document.querySelector( '.profile-image' );
  if ( profileImage )
    profileImage.classList.add( 'pride' );

  const name = document.querySelector( '.Name' );
  if ( name )
    name.innerHTML = `🏳️‍🌈 ${ name.innerHTML }`;

  // Add ?pride query to internal links without no query class
  const links = document.querySelectorAll( 'a[href^="/"]:not(.noq)' );
  for ( const link of links ) {
    const dest = link.getAttribute( 'href' );
    link.setAttribute( 'href', `${ dest }?pride` );
  }
}
