import { type GenericType } from '@/types/generic.js';

export const prepareUserEnv = (userProvidedEnv: GenericType = {}): string[] => {
  const returnValue: string[] = [];
  for (const [key, value] of Object.entries(userProvidedEnv)) {
    if (typeof value == 'object') {
      try {
        returnValue.push(`${key}=${JSON.stringify(value)}`);
      } catch (error) {
        returnValue.push(`${key}=${value}`);
      }
    } else {
      try {
        returnValue.push(`${key}=${JSON.stringify(JSON.parse(value))}`);
      } catch (e) {
        returnValue.push(`${key}=${value}`);
      }
    }
  }

  return returnValue;
};
