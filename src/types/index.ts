export interface GeneratorConfig {
  readonly sourceDir: string;
  readonly outputDir: string;
  readonly outputFile: string;
}

export interface SvgFile {
  readonly path: string;
  readonly name: string;
  readonly content: string;
}

export interface TsxComponent {
  readonly name: string;
  readonly content: string;
}

export interface GenerationResult {
  readonly componentsCount: number;
  readonly memoryUsed: number;
  readonly outputPath: string;
  readonly skippedFiles: string[];
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly kind: "success";
  readonly value: T;
}

export interface Failure<E> {
  readonly kind: "failure";
  readonly error: E;
}

// CLI options type
export interface CliOptions {
  readonly source: string;
  readonly output: string;
}
