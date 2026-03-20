export const createNodeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `branch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
