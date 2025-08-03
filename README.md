# SVGJSX CLI

> Open Source Command Line Interface to generate JSX Icon Components from SVGs.

## Installation

```bash
# Using npm
npm install -g svgjsx

# Using pnpm
pnpm add -g svgjsx

# Using yarn
yarn global add svgjsx
```

## Quick Start

```bash
# Generate JSX components from SVGs
svgjsx generate

# With custom directories
svgjsx generate --source ./assets/icons --output ./src/components/icons

# Watch mode for development
svgjsx generate --watch --verbose
```

## Examples

This example shows basic usage of the SVGJSX CLI.

### Setup

1. Install dependencies: `npm install`
2. Add SVG files to the `svg/` directory
3. Run generation: `npm run generate-icons`
4. Import and use components from `src/icons/`

### Usage

```jsx
import { Icon } from "./src/icons";

function App() {
  return (
    <Icon>
      <Icon.MyIcon className="w-6 h-6" />
    </Icon>
  );
}
```

## License

MIT © [Nicolas Nunes](https://github.com/foundation-ui/cli)
