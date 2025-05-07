const outlinePath = document.querySelector( '[stroke]' ) as SVGPathElement;

window.addEventListener( 'message', event => {
  if ( event.data === 'light' )
    outlinePath.setAttribute( 'stroke', '#2a2a2a' );
  else if ( event.data === 'dark' )
    outlinePath.setAttribute( 'stroke', '#fff' );
} );
