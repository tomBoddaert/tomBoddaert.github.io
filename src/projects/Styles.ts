for (const id of ['ProjectFontStyle', 'ProjectStyle']) {
  const element = document.getElementById(id);
  element?.setAttribute('rel', 'stylesheet');
  element?.removeAttribute('as');
}
