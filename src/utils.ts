export interface ErrorWithStatus extends Error {
  status?: number;
  messages?: string[];
}

export const removeEmptyOrNull = (obj: any) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );

  return obj;
};
