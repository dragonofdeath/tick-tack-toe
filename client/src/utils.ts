export const range = (start: number, end: number): number[] =>
    Array(end - start)
        .fill(undefined)
        .map((_, index) => start + index);

// Under example of https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
export const post = async (url: string, data: any = {}): Promise<any> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`);
    }
    return response.json();
};
