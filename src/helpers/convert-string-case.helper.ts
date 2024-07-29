export class ConvertStringCaseHelper {
  static pascalToKebab(str: string): string {
    return str
      .replace(/([A-Z])([A-Z])/g, '$1-$2')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
