export interface InputDefinition {
  type: string;
  inputType: string;
  pattern?: string;
}

export const INPUT_TYPES: Readonly<Record<string, InputDefinition>> = {
  text: {
    type: 'text',
    inputType: 'text',
  },
  number: {
    type: 'number',
    inputType: 'number',
  },
  zipCode: {
    type: 'zip-code',
    inputType: 'text',
    pattern: String.raw`\d{5}(-\d{4})?`,
  },
  date: {
    type: 'date',
    inputType: 'date',
  },
  email: {
    type: 'email',
    inputType: 'email',
    pattern: String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`,
  },
};
