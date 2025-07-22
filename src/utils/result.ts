import type { Result, Success, Failure } from "../types";

// Result constructors
export const success = <T>(value: T): Success<T> => ({
  kind: "success",
  value,
});

export const failure = <E>(error: E): Failure<E> => ({
  kind: "failure",
  error,
});

// Type guards
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
  result.kind === "success";

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> =>
  result.kind === "failure";

// Map over success values
export const map =
  <T, U, E>(fn: (value: T) => U) =>
  (result: Result<T, E>): Result<U, E> =>
    isSuccess(result) ? success(fn(result.value)) : result;

// Monad Chain operations that can fail
export const chain =
  <T, U, E>(fn: (value: T) => Result<U, E>) =>
  (result: Result<T, E>): Result<U, E> =>
    isSuccess(result) ? fn(result.value) : result;

// Safe execution wrapper
export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
  try {
    return success(fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

// Side effect execution (only on success)
export const tap =
  <T, E>(fn: (value: T) => void) =>
  (result: Result<T, E>): Result<T, E> => {
    if (isSuccess(result)) fn(result.value);
    return result;
  };

// Combine multiple results - all must succeed
export const all = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const values: T[] = [];

  for (const result of results) {
    if (isFailure(result)) return result;
    values.push(result.value);
  }

  return success(values);
};
