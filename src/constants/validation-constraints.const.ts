export class ValidationConstraints {
  static readonly maxIntegerValue = 2147483646;
  static readonly pageLimit = 50;
  static readonly otpCodeLength = 6;
  static readonly minSortFieldLength = 2;
  static readonly maxSortFieldLength = 32;
  static readonly shebaNumberLength = 26;
  static readonly ticketMessageMinLength = 50;
  static readonly ticketMessageMaxLength = 500;
  static readonly trackingCodeLength = 8;
  static readonly phonePattern = /^(?![1-9]).{11}$/;
  static readonly faxPattern = /^\+?[0-9]{6,}$/;
  static readonly postalCodeLength = 10;
}
