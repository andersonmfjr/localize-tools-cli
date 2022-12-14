import * as fs from "node:fs";
import { IsCorrectModel } from "../models/is-correct.model";

export function configIsCorrect(path: string): IsCorrectModel {
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
      errors.push(`Cannot parse config of ${path}`);
    }

    const hasAllKeys = ["source", "translations"].every((key) =>
      keys.includes(key)
    );

    if (hasAllKeys) {
      const source = JSON.parse(file).source;
      const translations = JSON.parse(file).translations;

      if (typeof source !== "string") {
        errors.push("Source config is not string");
      }

      if (typeof translations !== "string") {
        errors.push("Translations config is not string");
      }
    } else {
      errors.push(`${path} is invalid. Source or translations are missing.`);
    }
  } else {
    errors.push(`${path} not exists`);
  }

  return {
    hasErrors: errors.length > 0,
    errorsMessages: errors,
  };
}
