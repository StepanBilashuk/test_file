import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function XorValidator(field1: string, field2: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'XorValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [field1, field2],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [field1, field2] = args.constraints;
          const object = args.object as any;
          const field1Value = object[field1];
          const field2Value = object[field2];
          return (field1Value != null && field2Value == null) || (field1Value == null && field2Value != null);
        },
        defaultMessage(args: ValidationArguments) {
          return `Either ${args.constraints[0]} or ${args.constraints[1]} must be provided, but not both.`;
        },
      },
    });
  };
}
