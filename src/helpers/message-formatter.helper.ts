export class MessageFormatter {
  /**
   * Function to replace a message from the SharedMessages enum with custom arguments.
   * @param message The message of the SharedMessages enum.
   * @param args Custom arguments to replace placeholders in the message.
   * @returns The formatted message.
   */
  static replace(message: string, ...args: any[]): string {
    // Check if the message exists in the enum
    if (!message) {
      throw new Error(`Message with key ${message} does not exist.`);
    }

    // Replace placeholders in the message with provided arguments
    if (args.length !== 0) {
      args.forEach((arg, index) => {
        const placeholder = `{${index}}`;
        if (arg !== undefined && arg !== null) {
          message = message.replace(placeholder, String(arg));
        } else {
          message = message.replace(placeholder, '');
        }
      });
    } else {
      message = message.replace(' {0} ', ' ');
    }

    return message;
  }
}
