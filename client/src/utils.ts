export const range = (start: number, end: number): number[] =>
    Array(end - start)
        .fill(undefined)
        .map((_, index) => start + index);
