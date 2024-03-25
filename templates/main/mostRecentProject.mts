// TypeScript does not seem to have a HTMLSectionElement
const projectElement = document.getElementById( 'LatestProject' ) as HTMLDivElement;
const scriptMarker = '<!-- script -->';

const [ projectName ] = (
  await fetch( '/projects/index' )
    .then( response => response.text() )
).split( /\s.*/ );

const project = await fetch( `/projects/${ projectName }` )
  .then( response => response.text() );

projectElement.insertAdjacentHTML( 'afterbegin', project );

if ( project.includes( scriptMarker ) )
  import( `/projects/resources/${ projectName }.js` )
    .then( script => {
      script.run?.call( projectElement );
    } );

projectElement.setAttribute( 'data-project-name', projectName );
