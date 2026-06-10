export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function formatEmpty(value: unknown, fallback = "Não informado") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}
