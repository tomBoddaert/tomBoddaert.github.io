const template = document.getElementById(
  'ProjectTemplate',
) as HTMLTemplateElement;

export class ProjectElement extends HTMLElement {
  static observedAttributes = ['data-id', 'data-script'] as const;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set #id(value: string) {
    const anchor = this.shadowRoot?.querySelector('a');
    anchor!.setAttribute('href', `/projects/${value}`);
  }

  get #id(): string {
    const id = this.getAttribute('data-id');
    if (id === null) {
      throw new Error("tb-project has no 'data-id' attribute");
    }
    return id;
  }

  #runScript() {
    import(`./collection/${this.#id}.ts`)
      .then((script) => script.run?.call(this));
  }

  attributeChangedCallback(
    name: typeof ProjectElement.observedAttributes[number],
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    switch (name) {
      case 'data-id':
        if (newValue !== null) {
          this.#id = newValue;
        }
        break;

      case 'data-script':
        if (newValue !== null) {
          this.#runScript();
        }
        break;

      default:
        exaustiveGuard(name);
    }
  }
}

customElements.define('tb-project', ProjectElement);

function exaustiveGuard(value: never): never {
  throw new Error(`got unexpected value (${JSON.stringify(value)})`);
}
