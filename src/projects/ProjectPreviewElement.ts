const template = document.getElementById(
  'ProjectPreviewTemplate',
) as HTMLTemplateElement;

export class ProjectPreviewElement extends HTMLElement {
  static observedAttributes = ['data-id'] as const;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set #id(value: string) {
    this.shadowRoot?.children[0].setAttribute('href', `/projects/${value}`);
  }

  attributeChangedCallback(
    name: typeof ProjectPreviewElement.observedAttributes[number],
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    switch (name) {
      case 'data-id':
        if (newValue !== null) {
          this.#id = newValue;
        }
        break;

      default:
        exaustiveGuard(name);
    }
  }
}

customElements.define('tb-project-preview', ProjectPreviewElement);

function exaustiveGuard(value: never): never {
  throw new Error(`got unexpected value (${JSON.stringify(value)})`);
}
