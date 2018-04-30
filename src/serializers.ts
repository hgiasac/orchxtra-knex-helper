
export interface ITimestampInput {
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export interface ITimestampOutput {
  createdAt: string;
  updatedAt: string;
}

export function toDateISOString(input: string | Date): string {
  return (typeof input === "string" ? new Date(input) : input).toISOString();
}

export function serializeTimestamp(input: ITimestampInput): ITimestampOutput {
  return {
    createdAt: toDateISOString(input.createdAt),
    updatedAt: toDateISOString(input.updatedAt),
  };
}
