import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export class EnvValidator {
  private readonly extendedClasses: any[];

  constructor(extendedClasses: any[]) {
    this.extendedClasses = extendedClasses;
  }

  validate(
      configuration: Record<string, unknown>,
  ) {
    let errors = [];
    let transformedConfiguration: any = {};

    this.extendedClasses.forEach((schema) => {
      const finalConfig: object = plainToClass(schema, configuration, {
        enableImplicitConversion: true,
      });

      const error = validateSync(finalConfig, { skipMissingProperties: false });

      if (error.length > 0)
        errors.push(error);
      else
        transformedConfiguration = {
          ...transformedConfiguration,
          ...finalConfig,
        }
    });


    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    // Combine the validated configurations back into the original config object
    return {
      ...configuration,
      ...transformedConfiguration,
    };
  }
}
