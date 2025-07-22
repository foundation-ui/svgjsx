#!/usr/bin/env node

import { Command } from "commander";

import {
  generateIcons,
  displayCompletion,
  handleError,
} from "./commands/generate";
import { validateConfig } from "./core/validators";
import { isSuccess } from "./utils/result";

import type { CliOptions } from "./types";

const handleGenerate = (options: CliOptions): void => {
  console.log("🔧 Validating configuration...");

  const configResult = validateConfig(options.source, options.output);

  if (!isSuccess(configResult)) handleError(configResult.error);
  if (isSuccess(configResult)) {
    const generationResult = generateIcons(configResult.value);

    if (!isSuccess(generationResult)) handleError(generationResult.error);
    if (isSuccess(generationResult)) displayCompletion(generationResult.value);
  }
};

// CLI factory
const createCli = (): Command => {
  const program = new Command();

  program
    .name("svgjsx")
    .description("Generate JSX Icon Components from SVGs")
    .version("1.0.0")
    .addHelpText(
      "after",
      `
Examples:
  $ svgjsx generate                           # Use default directories
  $ svgjsx generate -s ./svg -o ./components  # Custom directories
  $ svgjsx generate --help                    # Show detailed help
    `
    );

  program
    .command("generate")
    .description("Generate TSX components from SVG files")
    .option(
      "-s, --source <dir>",
      "Source directory containing SVG files",
      "./svg"
    )
    .option(
      "-o, --output <dir>",
      "Output directory for generated TSX files",
      "./icons"
    )
    .action(handleGenerate);

  // Version command
  program
    .command("version")
    .description("Show version information")
    .action(() => {
      console.log(`svgjsx v${program.version()}`);
      console.log("Built with ❤️  using functional programming principles");
    });

  return program;
};

// Main entry point
const main = (): void => {
  const program = createCli();

  // Error handling
  program.exitOverride();

  try {
    program.parse();

    // Show help if no arguments provided
    if (!process.argv.slice(2).length) {
      program.outputHelp();
      console.log('\n💡 Tip: Try "svgjsx generate" to get started!');
    }
  } catch (error: any) {
    if (error.code !== "commander.helpDisplayed") handleError(error);
  }
};

if (require.main === module) main();

export { handleGenerate, createCli };
