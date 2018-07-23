export enum StatusCode {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted"
}

export function safeParseInt(input: number | string, radix = 10): number {

  return typeof input === "number" ? input : parseInt(input, radix);
}

export function safeParseJSON<T>(
  input: string | T, defaultValue = {}): T {

  try {
    const result = typeof input === "string" ? JSON.parse(input) : input;

    return result || defaultValue;
  } catch (e) {

    return <T> defaultValue;
  }
}

export function isUUID(input: string): boolean {
  const regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regexp.test(input);
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return new Buffer(buffer).toString("base64");
}
