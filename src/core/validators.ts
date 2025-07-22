import * as fs from "fs";
import { success, failure } from "../utils/result";

import type { Result, GeneratorConfig } from "../types";

export const isEmptyString = (str: string): boolean =>
  !str || str.trim().length === 0;

export const isNonExistentDirectory = (path: string): boolean => {
  try {
    const stat = fs.statSync(path);
    return !stat.isDirectory();
  } catch {
    return true;
  }
};

export const isUnwritableDirectory = (path: string): boolean => {
  try {
    fs.accessSync(path, fs.constants.W_OK);
    return false;
  } catch {
    return true;
  }
};

export const validateSourceDir = (sourceDir: string): Result<string, Error> => {
  if (isEmptyString(sourceDir)) {
    return failure(new Error("Source directory cannot be empty"));
  }

  if (isNonExistentDirectory(sourceDir)) {
    return failure(
      new Error(
        `Source directory '${sourceDir}' does not exist or is not a directory`
      )
    );
  }

  return success(sourceDir);
};

export const validateOutputDir = (outputDir: string): Result<string, Error> => {
  if (isEmptyString(outputDir)) {
    return failure(new Error("Output directory cannot be empty"));
  }

  // Try to create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (error) {
      return failure(
        new Error(`Cannot create output directory '${outputDir}': ${error}`)
      );
    }
  }

  if (isUnwritableDirectory(outputDir)) {
    return failure(
      new Error(`Output directory '${outputDir}' is not writable`)
    );
  }

  return success(outputDir);
};

export const validateConfig = (
  sourceDir: string,
  outputDir: string
): Result<GeneratorConfig, Error> => {
  const sourceDirResult = validateSourceDir(sourceDir);
  if (sourceDirResult.kind === "failure") {
    return sourceDirResult as Result<GeneratorConfig, Error>;
  }

  const outputDirResult = validateOutputDir(outputDir);
  if (outputDirResult.kind === "failure") {
    return outputDirResult as Result<GeneratorConfig, Error>;
  }

  return success({
    sourceDir: sourceDirResult.value,
    outputDir: outputDirResult.value,
    outputFile: `${outputDirResult.value}/index.tsx`,
  });
};
