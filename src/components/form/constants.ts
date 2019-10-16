export interface InputDefinition {
  type: string,
  inputType: string,
  pattern?: RegExp,
}

export interface InputDefinitions {
  [key: string]: InputDefinition
}

export const INPUT_TYPES: InputDefinitions = {
  text: {
    type: "text",
    inputType: "text",
  },
  number: {
    type: "number",
    inputType: "number",
  },
  zipCode: {
    type: "zip-code",
    inputType: "text",
    pattern: /^\d{5}([\-]\d{4})?$/,
  },
  date: {
    type: "date",
    inputType: "date",
  },
  email: {
    type: "email",
    inputType: "email",
    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  }
};

export interface ErrorMessage {
  message: string,
}

export const MAXLENGTH: ErrorMessage = { message: 'MAXLENGTH' };
export const REQUIRED: ErrorMessage = { message: 'REQUIRED' };
export const PATTERN: ErrorMessage = { message: 'PATTERN' };