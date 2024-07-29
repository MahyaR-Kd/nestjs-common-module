export enum SharedMessages {
  // Generic errors
  INTERNAL_SERVER_ERROR = 'Internal Server Error.',
  NOT_IMPLEMENTED = 'This feature has not been implemented yet.',
  RECURSIVE_CHILD = 'Some children IDs are invalid, the parent product can not be used in children, it is recursive.',
  SUCCESSFUL = 'Operation completed successfully.',
  IS_UNiQUE = 'Field must be unique.',
  FIELD_REQUIRE = 'Field cannot be empty.',
  ALREADY_EXISTS = 'Operation already exists',

  // Create (POST) specific errors
  CREATE_FAILED = 'Failed to create: {0}.',
  CREATE_DENIED = 'Permission denied to create: {0}.',

  // Read (GET) specific errors
  FETCH_FAILED = 'Failed to fetch: {0}.',
  RESOURCE_NOT_FOUND = 'The requested {0} was not found.',
  DUPLICATED_SKU = 'The SKU is reserved.',
  DUPLICATED_CODE = 'The Code is reserved.',
  INVALID_COMPOSITE_SUB_ITEMS = 'Composite sub items are invalid.',
  INVALID_GROUPED_SUB_ITEMS = 'Sub items are invalid.',

  // Update (PUT/PATCH) specific errors
  UPDATE_FAILED = 'Failed to update: {0}.',
  UPDATE_DENIED = 'Permission denied to update: {0}.',

  // Upsert (PUT/PATCH) specific errors
  UPSERT_FAILED = 'Failed to upsert: {0}.',
  UPSERT_DENIED = 'Permission denied to upsert: {0}.',

  // Delete (DELETE) specific errors
  DELETE_FAILED = 'Failed to delete: {0}.',
  DELETE_DENIED = 'Permission denied to delete: {0}.',

  // Validation errors
  SORT_VALIDATION_FAILED = 'Sort parameter validation failed {0}.',
  PARAMETER_VALIDATION_FAILED = 'Parameter validation failed {0}.',

  // Authentication and Authorization errors
  UNAUTHORIZED = 'Authorization is required to access this {0}.',
  FORBIDDEN = 'Access to this {0} is forbidden.',

  FILTER_OPERATION_NOT_ACCEPTABLE = 'filter operator not acceptable',
  FILTER_VALIDATION_FAILED = 'filter validation failed {0}.',
}
