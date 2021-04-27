# Context Element

Context Element is an extension of [Lit Element v2.3.1](https://lit-element.polymer-project.org/guide) that adds support for context
control and handles Scss-in-JS (powered by [Goober](https://github.com/cristianbote/goober)).

## Installation

This package is only available on Github.

`yarn add Meiuca/context-element`

or

`yarn add https://github.com/Meiuca/context-element.git`

## Getting Started

This library uses decorators and loose class properties, which are not supported by browsers.
So it will be necessary to use compilers like Babel or import via `@meiuca/context-element/build/src/index.js`.

If you are willing to use Babel, add this snippet to your `.babelrc`:

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

### What Is Context?

Context is a way of represent style variables (such as border-radius, background-color, etc.) so that they are dynamic and easy to
change at runtime. In this way, it is possible to generate and control visual changes more easily.

### Building a Context Element

The process is very similar to the [standard Lit Element construction process](https://lit-element.polymer-project.org/guide/templates#define-and-render-a-template).

#### Body

```js
// index.js
import { ContextElement, html } from '@meiuca/context-element';
import style from './style.js';

export class MyInput extends ContextElement {
  static get properties() {
    return {
      label: { type: String },
      type: { type: String },
      placeholder: { type: String },
      required: { type: Boolean },
    };
  }

  static get styleGetter() {
    return style;
  }

  constructor() {
    super();

    this.label = '';
    this.type = 'text';
    this.placeholder = '';
    this.required = false;
  }

  render() {
    return html`
      <label class="my-Input-st1-label ${this.styleId}">
        <span>${this.label}</span>
        <input
          class="my-Input-st1"
          type="${this.type}"
          placeholder="${this.placeholder}"
          ?required=${this.required}
        />
      </label>
    `;
  }
}

customElements.define('my-input', MyInput);
```

Note that `this.styleId` was created by Context Element and contains the id created by Goober.

#### Style

```js
// style.js
import { createGooberGetter as css } from '@meiuca/context-element';
import { inputContext } from './contexts.js';

export default css`
  /* default context: ${inputContext} */

  &.my-Input-st1-label {
    display: flex;
    flex-direction: column;

    span {
      color: ${({ label }) => label.color};
      font-size: ${({ label }) => label.fontSize};
      font-weight: ${({ label }) => label.fontWeight};
      font-family: ${({ label }) => label.fontFamily};
      margin-bottom: ${({ label }) => label.margin};
      line-height: ${({ label }) => label.lineHeight};
    }

    input {
      border-style: ${context => context.borderStyle};
      border-width: ${context => context.borderWidth};

      border-color: ${context => context.borderColor};
      padding: ${context => context.padding};
      background-color: transparent;
      outline: none;

      ::placeholder {
        color: ${({ placeholder }) => placeholder.color};
        font-size: ${({ placeholder }) => placeholder.fontSize};
        font-weight: ${({ placeholder }) => placeholder.fontWeight};
        font-family: ${({ placeholder }) => placeholder.fontFamily};
        line-height: ${({ placeholder }) => placeholder.lineHeight};
      }
    }
  }
`;
```

Context Element also exports the `createLitGetter`, which generates a compatible getter without using Goober.

### How does it work?

`contextElementMixin` accepts a single (or an array of) [StyleGetter](./src/css.d.ts#L9) and returns a non-instantiated class.
This class is an extension of LitElement class with some extra functionality. See [ContextElement](./src/context-element.d.ts#L7).

`createGooberGetter` is a template string tag that uses the [CreateStyleGetterProps](./src/css.d.ts#L33) interface,
thus, the first interpolation must be used to inject the default context, and the other interpolations must use callbacks to obtain it;
in this way, context values ​​can be changed at runtime (via `setContext`).

The Context Element creates two global objects: `DSRegistry` and `DSContext`.

> `DSRegistry` is an array where all instances of Context Element register itself, thus being able to be easily accessed by other entities,
> such as [updateRegisteredComponents](./src/context.d.ts#L9) function.
>
> `DSContext` is a map that can contain the contexts of the components. Initially it is an empty instance,
> but it is used by `setContext` to store contexts that will override their respective default. The override is made with the merge strategy.

When updated, the ContextElement will try to get their context from `DSContext` and will merge it with the default context.
Then will pass it on to the callbacks.

Note that, at first, the component's context pointer (`this.contextId`) will be the same as the component tag name (`this.localName`),
but can be changed manually (requires manual update) or by changing the public property [context](./src/context-element.d.ts#L15)

#### setContext

This function has 4 overloads.

```js
setContext('https://url.to.global.context/'); // `https://url.to.global.context/` will return `{"my-button": {"color": "#ddd"}}`

setContext({ 'my-button': { color: '#ddd' } });

setContext('my-button', { color: '#ddd' });

setContext('my-button', 'https://url.to.component.context/'); // `https://url.to.component.context/` will return `{"color": "#ddd"}`
```

So let's say MyButton (`customElements.define('my-button', MyButton)`) has, as a default context, `{color: "blue", fontSize: "20px"}`;
after being instantiated, its context will be `{color: "#ddd", fontSize: "20px"}`. If `this.contextId` is changed at some point,
the instance will lose the previous reference and, if the new pointer does not exist in `DSContext`, the default context will take over.

## Contributing

Any contribution is welcome, as long as you follow the rules of prettier, eslint, commitlint,
tests and [git branch](https://danielkummer.github.io/git-flow-cheatsheet)

### Prettier

all files must be formatted using prettier, whose behavior is determined by [.prettierrc](./.prettierrc)

### Eslint

extends [@open-wc/eslint-config](https://open-wc.org/guides/tools/linting-and-formatting/#linting-config). See [.eslintrc](./.eslintrc)

### Commitlint

extends [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
and adds the following scopes (see [commitlint.config.js](./commitlint.config.js)):

- eslint: any eslint config or dependency change

- prettier: any prettier config or dependency change

- babel: any babel config or dependency change

- commitlint: any commitlint config or dependency change

- snowpack: ´´

- web-test-runner: ´´

- husky: ´´

- husky-controller: ´´

- server: any change to the `server.js` file

- vscode: any change to the `.vscode` folder

- `('./src/*.js', 'src#')`: any change to any js file inside `src` folder; prefixed by `src#`. Example: `src#context.js`

- `('./test/*.js', 'test#')`: any change to any js file inside `test` folder; prefixed by `test#`

- package-json: any change to the `package.json` file that do not affect any of the previous scopes

Before committing, please make sure that husky is properly installed, Especially if you are a [mac user](https://stackoverflow.com/questions/8598639/why-is-my-git-pre-commit-hook-not-executable-by-default).
