import type { Order } from "@/types/order";

type BackendOrderResponse = {
  data?: unknown;
  order?: unknown;
  result?: unknown;
};

function isOrder(value: unknown): value is Order {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

export function extractOrder(response: unknown): Order | null {
  if (isOrder(response)) {
    return response;
  }

  if (typeof response !== "object" || response === null) {
    return null;
  }

  const backendResponse = response as BackendOrderResponse;
  const candidates = [
    backendResponse.data,
    backendResponse.order,
    backendResponse.result,
  ];

  for (const candidate of candidates) {
    if (isOrder(candidate)) {
      return candidate;
    }
  }

  return null;
}
