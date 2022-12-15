import { fileIsValid } from "./file-is-valid";

export function filesAreValid(config: {
  source: string;
  translations: string[];
}): boolean {
  const paths = [config.source, ...config.translations];

  let filesAreValid = true;
  for (const path of paths) {
    const isValid = fileIsValid(path).isValid;
    if (!isValid) {
      filesAreValid = false;
      break;
    }
  }

  return filesAreValid;
}
