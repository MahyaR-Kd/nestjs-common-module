import { Matches as matches } from 'class-validator';

export function Matches(
  pattern: RegExp | string,
  options?: { each?: boolean },
): PropertyDecorator {
  const machPattern =
    typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  return function (target: any, propertyKey: string | symbol): void {
    matches(
      machPattern,
      Object.assign({ message: 'validation.PATTERN' }, options),
    )(target, propertyKey);
  };
}
