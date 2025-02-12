const styleElement = document.getElementById( 'ProjectStyle' ) as HTMLLinkElement;
const headerElement = document.getElementById( 'Header' ) as HTMLHeadingElement;
const observerElement = document.getElementById( 'Observer' ) as HTMLHRElement;
const scriptMarker = '<!-- script -->';

styleElement.setAttribute( 'rel', 'stylesheet' );
styleElement.removeAttribute( 'as' );

const projectNames = (
  await fetch( '/projects/index' )
    .then( response => response.text() )
).split( /\s/ )
  .filter( entry => entry.length !== 0 );

const url = new URL( window.location.href );
const selectedProject = url.hash;
if ( selectedProject === '' )
  activateObserver();
else {
  headerElement.innerText = 'Project';
  await loadProject( selectedProject.slice( 1 ) );
}

async function loadProject( projectName: string ) {
  const response = await fetch( `/projects/${ projectName }` );
  let project: string;
  if ( response.ok )
    project = await response.text();
  else {
    const explanation = response.status === 404 ? ' - project not found ' : ' ';
    project = `Error${ explanation }(${ response.status })`;
  }

  const projectElement = document.createElement( 'section' );
  projectElement.insertAdjacentHTML( 'afterbegin', project );

  observerElement.insertAdjacentElement( 'beforebegin', projectElement );

  if ( project.includes( scriptMarker ) )
    import( `/projects/resources/${ projectName }.js` )
      .then( script => {
        script.run?.call( projectElement );
      } );

  projectElement.setAttribute( 'data-project-name', projectName );
}

function activateObserver() {
  let nextProjectIndex = 0;

  const observer = new IntersectionObserver( async observation => {
    if ( observation.length === 0 || !observation[ 0 ]?.isIntersecting )
      return;

    observer.unobserve( observerElement );

    const projectName = projectNames[ nextProjectIndex++ ];
    if ( !projectName )
      return;

    if ( nextProjectIndex !== 1 ) {
      const line = document.createElement( 'hr' );
      observerElement.insertAdjacentElement( 'beforebegin', line );
    }

    await loadProject( projectName );

    observer.observe( observerElement );
  } );
  observer.observe( observerElement );
}

