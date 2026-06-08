export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type RsData<T> = {
  resultCode?: string;
  msg?: string;
  data: T;
};

export function unwrapRsData<T>(responseBody: unknown): T {
  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "data" in responseBody
  ) {
    return (responseBody as RsData<T>).data;
  }

  return responseBody as T;
}
