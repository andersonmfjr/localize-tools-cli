import * as fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import { IsValidModel } from "../models/is-valid.model";
import { chalkError } from "./chalk-themes";

export function fileIsValid(filePath: string): IsValidModel {
  const errors = [];

  if (!filePath.endsWith(".json")) {
    errors.push(`${path} is not a json.`);
  }

  const configPath = path.join(cwd(), filePath);

  const exists = fs.existsSync(configPath);

  if (exists) {
    const file = fs.readFileSync(configPath, "utf8");
    let keys: string[] = [];
    try {
      keys = Object.keys(JSON.parse(file));
    } catch {
      errors.push(`Cannot parse translations of ${configPath}.`);
    }

    const hasAllKeys = ["locale", "translations"].every((key) =>
      keys.includes(key)
    );

    if (!hasAllKeys) {
      errors.push(
        `${configPath} is invalid. Locale or translations are missing.`
      );
    }

    if (keys.includes("translations")) {
      const translations = JSON.parse(file).translations;
      if (typeof translations !== "object") {
        errors.push(`Translations of ${configPath} is not an object.`);
      }
    }
  } else {
    errors.push(`${configPath} not exists.`);
  }

  errors.forEach((error) => {
    console.log(chalkError("\n" + error + "\n"));
  });

  return {
    isValid: errors.length === 0,
    errorsMessages: errors,
  };
}
