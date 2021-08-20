var app: HTMLElement | null = document.getElementById('App');

function sidebarToggle() {
    if ( !app?.classList.contains('sidebar-open') ) {
        app?.classList.add('sidebar-open');
        localStorage.setItem( 'sidebar-open', 'true' );
    } else {
        app?.classList.remove('sidebar-open');
        localStorage.removeItem('sidebar-open');
    }
}