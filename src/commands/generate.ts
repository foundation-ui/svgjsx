import {
  findSvgFiles,
  readSvgFile,
  writeFile,
  appendFile,
} from "../core/file-operations";
import {
  createTsxComponent,
  generateExportList,
  generateHeader,
} from "../core/transformers";

import { success, failure, chain, tap, isSuccess } from "../utils/result";

import type {
  GeneratorConfig,
  GenerationResult,
  Result,
  SvgFile,
  TsxComponent,
} from "../types";

const logComponent = (component: TsxComponent, outputPath: string): void => {
  console.log(`✅ Added ${component.name} to ${outputPath}`);
};

const logSkippedFile = (filename: string, reason?: string): void => {
  const message = reason ? `${reason}` : "Invalid component name";
  console.warn(`⚠️  Skipped ${filename}: ${message}`);
};

const getMemoryUsage = (): number =>
  Math.round(process.memoryUsage().heapUsed / 1024);

const processSvgFile =
  (config: GeneratorConfig) =>
  (svgPath: string): Result<TsxComponent | null, Error> => {
    return chain<SvgFile, TsxComponent | null, Error>((svgFile) => {
      const component = createTsxComponent(svgFile);

      if (!component) {
        logSkippedFile(svgFile.name);
        return success(null);
      }

      // Append component to file
      const appendResult = appendFile(config.outputFile, component.content);
      if (!isSuccess(appendResult)) {
        return appendResult;
      }

      logComponent(component, config.outputFile);
      return success(component);
    })(readSvgFile(svgPath));
  };

export const generateIcons = (
  config: GeneratorConfig
): Result<GenerationResult, Error> => {
  console.log(`📂 Source: ${config.sourceDir}`);
  console.log(`📁 Output: ${config.outputFile}`);

  // Initialize output file
  const initResult = writeFile(config.outputFile, generateHeader());
  if (!isSuccess(initResult)) {
    return initResult;
  }

  // Find and process all SVG files
  return chain<string[], GenerationResult, Error>((svgFiles) => {
    if (svgFiles.length === 0) {
      console.log(`ℹ️  No SVG files found in '${config.sourceDir}'`);
      return success({
        componentsCount: 0,
        memoryUsed: getMemoryUsage(),
        outputPath: config.outputFile,
        skippedFiles: [],
      });
    }

    console.log(`📋 Found ${svgFiles.length} SVG files`);

    // Process each file
    let successCount = 0;
    const skippedFiles: string[] = [];
    const componentNames: string[] = [];

    for (let i = 0; i < svgFiles.length; i++) {
      const svgPath = svgFiles[i];
      if (!svgPath) {
        return failure(
          new Error(`Cannot process file with index ${i} in ${svgFiles}`)
        );
      }

      const result = processSvgFile(config)(svgPath);
      if (isSuccess(result)) {
        if (result.value !== null) {
          successCount++;
          componentNames.push(result.value.name);
        } else {
          skippedFiles.push(svgPath);
        }
      } else {
        console.error(
          `❌ Error processing ${svgPath}: ${result.error.message}`
        );
        skippedFiles.push(svgPath);
      }
    }

    const exportList = generateExportList(componentNames);
    if (exportList && componentNames.length > 0) {
      appendFile(config.outputFile, exportList);
    }

    return success({
      componentsCount: successCount,
      memoryUsed: getMemoryUsage(),
      outputPath: config.outputFile,
      skippedFiles,
    });
  })(findSvgFiles(config.sourceDir));
};

// Log completion message
export const displayCompletion = (result: GenerationResult): void => {
  console.log("\n🎉 Generation completed!");
  console.log(`📦 Generated ${result.componentsCount} components`);
  console.log(`💽 Memory used: ${result.memoryUsed} KB`);
  console.log(`📁 Output: ${result.outputPath}`);

  if (result.skippedFiles.length > 0) {
    console.log(`⚠️  Skipped ${result.skippedFiles.length} files`);
  }
};

// Log Error and Exit process
export const handleError = (error: Error): never => {
  console.error(`${error.message}`);
  process.exit(1);
};
