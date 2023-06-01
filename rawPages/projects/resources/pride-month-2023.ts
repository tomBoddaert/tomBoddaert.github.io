export function run() {
  const link = document.getElementById( 'pride-month-2023-Prideify' ) as HTMLAnchorElement;

  link.addEventListener( 'click', () => {
    const url = new URL( window.location.href );
    url.searchParams.set( 'pride', '' );
    history.replaceState( {}, '', url );
    window.prideify();
  } );
}
