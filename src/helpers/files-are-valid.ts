import { exit } from "node:process";
import { chalkError } from "./chalk-themes";
import { fileIsValid } from "./file-is-valid";

export function filesAreValid(config: {
  source: string;
  translations: string[];
}): boolean {
  const keys = Object.keys(config || {});

  const hasAllKeys = ["source", "translations"].every((key) =>
    keys.includes(key)
  );

  if (!config || !hasAllKeys) {
    console.log(
      chalkError("Please add config. For more information view help section")
    );
    exit();
  }

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
