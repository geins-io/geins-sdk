export function parseJsonContent(content: string): any {
  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
}
