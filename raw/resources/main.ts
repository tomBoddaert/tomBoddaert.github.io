const [ htmlElement ] = document.getElementsByTagName( 'html' );
const fontElement = document.getElementById( 'FontStyle' ) as HTMLLinkElement;
const profileImage = document.getElementById( 'ProfileImage' ) as HTMLObjectElement;
const brainMadeLink = document.querySelector( '#BrainMade a' ) as HTMLAnchorElement;
const [ brainMadeNoScript ] = brainMadeLink.getElementsByTagName( 'noscript' );
const themeSelector = document.getElementById( 'ThemeSelector') as HTMLLinkElement;
const lightSelector = document.getElementById( 'ThemeSelectorLight' ) as unknown as SVGGElement;
const darkSelector = document.getElementById( 'ThemeSelectorDark' ) as unknown as SVGGElement;

// Switch The preload link to a stylesheet to use it
fontElement.setAttribute( 'rel', 'stylesheet' );
fontElement.removeAttribute( 'as' );

if ( brainMadeNoScript )
  // 'noscript' elements aren't always evaluated
  brainMadeLink.innerHTML = brainMadeNoScript.innerHTML;


function setTheme( light: boolean ) {
  if ( light )
    sessionStorage.setItem( 'light', 'true' );
  else
    sessionStorage.removeItem( 'light' );

  htmlElement.classList[ light ? 'add' : 'remove' ]( 'light' );
  lightSelector.classList[ light ? 'add' : 'remove' ]( 'off' );
  darkSelector.classList[ light ? 'remove' : 'add' ]( 'off' );
  themeSelector.setAttribute( 'aria-pressed', light.toString() );
  profileImage.contentWindow?.postMessage( light ? 'light' : 'dark' );
}

setTheme( sessionStorage.getItem( 'light' ) !== null );

profileImage.addEventListener( 'load', () => {
  const light = htmlElement.classList.contains( 'light' );
  profileImage.contentWindow?.postMessage( light ? 'light' : 'dark' );
} );

themeSelector.addEventListener( 'click', () =>
  setTheme( !htmlElement.classList.contains( 'light' ) )
);
