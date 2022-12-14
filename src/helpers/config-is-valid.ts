import * as fs from "node:fs";
import { IsValidModel } from "../models/is-valid.model";

export function configIsValid(
  config: string | Record<string, any>
): IsValidModel {
  const errors = [];

  if (typeof config === "string") {
    if (!config.endsWith(".json")) {
      errors.push(`${config} is not a json`);
    }

    const exists = fs.existsSync(config);

    if (exists) {
      const file = fs.readFileSync(config, "utf8");

      let keys: string[] = [];
      try {
        keys = Object.keys(JSON.parse(file));
        const keysErrors = verifyKeys(keys, JSON.parse(file));
        errors.push(...keysErrors);
      } catch {
        errors.push(`Cannot parse config of ${config}`);
      }
    } else {
      errors.push(`${config} not exists`);
    }
  }

  if (typeof config === "object") {
    const keysErrors = verifyKeys(Object.keys(config), config);
    errors.push(...keysErrors);
  }

  return {
    isValid: errors.length === 0,
    errorsMessages: errors,
  };
}

function verifyKeys(keys: string[], config: Record<string, any>): string[] {
  const errors = [];

  const hasAllKeys = ["source", "translations"].every((key) =>
    keys.includes(key)
  );

  if (hasAllKeys) {
    const source = config.source;
    const translations = config.translations;

    if (typeof source !== "string") {
      errors.push("Source config is not string");
    }

    if (!Array.isArray(translations)) {
      errors.push("Translations config is not array");
      // eslint-disable-next-line no-warning-comments
      // TODO: Verify items
    }
  } else {
    errors.push(`${config} is invalid. Source or translations are missing.`);
  }

  return errors;
}
