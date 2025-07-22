import * as fs from "fs";
import * as path from "path";
import { success, failure, tryCatch } from "../utils/result";

import type { SvgFile, Result } from "../types";

const isNotSvgFile = (filePath: string): boolean =>
  path.extname(filePath).toLowerCase() !== ".svg";

const isNotAccessibleFile = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return false;
  } catch {
    return true;
  }
};

const isEmptyFile = (content: string): boolean => content.trim().length === 0;

const isInvalidSvgContent = (content: string): boolean =>
  !content.includes("<svg") || !content.includes("</svg>");

// Directory walker
const walkDirectorySync = (dirPath: string): string[] => {
  const result: string[] = [];

  const walk = (currentPath: string): void => {
    try {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (!isNotSvgFile(itemPath) && !isNotAccessibleFile(itemPath)) {
          result.push(itemPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.warn(`⚠️  Cannot read directory: ${currentPath}`);
    }
  };

  walk(dirPath);
  return result;
};

// Find all valid SVG files
export const findSvgFiles = (sourceDir: string): Result<string[], Error> =>
  tryCatch(() => walkDirectorySync(sourceDir));

// Read and validate SVG file
export const readSvgFile = (filePath: string): Result<SvgFile, Error> => {
  if (isNotAccessibleFile(filePath)) {
    return failure(new Error(`Cannot read file: ${filePath}`));
  }

  return tryCatch(() => {
    const content = fs.readFileSync(filePath, "utf8");
    const name = path.basename(filePath);

    // Early returns for invalid content
    if (isEmptyFile(content)) {
      throw new Error(`File is empty: ${filePath}`);
    }

    if (isInvalidSvgContent(content)) {
      throw new Error(`File does not contain valid SVG content: ${filePath}`);
    }

    return { path: filePath, name, content };
  });
};

export const writeFile = (
  filePath: string,
  content: string
): Result<void, Error> =>
  tryCatch(() => fs.writeFileSync(filePath, content, "utf8"));

export const appendFile = (
  filePath: string,
  content: string
): Result<void, Error> =>
  tryCatch(() => fs.appendFileSync(filePath, content, "utf8"));
