// Custom implementation without external dependencies
export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((value, index, self) => value && self.indexOf(value) === index)
    .join(' ');
}
