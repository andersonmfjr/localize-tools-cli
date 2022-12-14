import * as fs from "node:fs";
import { IsCorrectModel } from "../models/is-correct.model";

export function fileIsCorrect(path: string): IsCorrectModel {
  const errors = [];

  if (!path.endsWith(".json")) {
    errors.push(`${path} is not a json`);
  }

  const exists = fs.existsSync(path);

  if (exists) {
    const file = fs.readFileSync(path, "utf8");
    let keys: string[] = [];
    try {
      keys = Object.keys(JSON.parse(file));
    } catch {
      errors.push(`Cannot parse translations of ${path}`);
    }

    const hasAllKeys = ["locale", "translations"].every((key) =>
      keys.includes(key)
    );

    if (!hasAllKeys) {
      errors.push(`${path} is invalid. Locale or translations are missing.`);
    }
  } else {
    errors.push(`${path} not exists`);
  }

  return {
    hasErrors: errors.length > 0,
    errorsMessages: errors,
  };
}
