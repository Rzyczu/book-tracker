export type JsonValue = string | number | boolean | null | Json | Json[];
export interface Json { [key: string]: JsonValue; }
