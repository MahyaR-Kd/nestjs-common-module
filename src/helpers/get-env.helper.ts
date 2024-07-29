export function env(key, defaultValue: any = null) {
  return process?.env?.[key] ?? defaultValue;
}
