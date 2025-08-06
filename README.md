# SVGJSX CLI

> Open Source Command Line Interface to generate JSX Icon Components from SVGs.

[![npm version](https://img.shields.io/npm/v/@usefui/svgjsx.svg)](https://npmjs.com/package/@usefui/svgjsx)

## Quick Start

```bash
# Generate JSX components from SVGs
pnpx @usefui/svgjsx generate

# With custom directories
pnpx @usefui/svgjsx --source ./assets/icons --output ./src/components/icons

```

## Examples

This example shows basic usage of the SVGJSX CLI.

### Setup

1. Add SVG files to the `svg/` directory
2. Run generation script: `pnpx @usefui/svgjsx generate`
3. Import and use components from `src/icons/`

### Usage

```jsx
import { Icon } from "./src/icons";

function App() {
  return (
    <Icon>
      <Icon.MyIcon />
    </Icon>
  );
}
```

## License

MIT © [Nicolas Nunes](https://github.com/foundation-ui/svgjsx)
