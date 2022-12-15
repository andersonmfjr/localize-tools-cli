import * as fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import { IsValidModel } from "../models/is-valid.model";
import { chalkError } from "./chalk-themes";

export function configIsValid(
  config: string | Record<string, any>
): IsValidModel {
  const errors = [];

  let configPath = "";

  if (typeof config === "string") {
    if (!config.endsWith(".json")) {
      errors.push(`${config} is not a json`);
    }

    configPath = path.join(cwd(), config);

    const exists = fs.existsSync(configPath);

    if (exists) {
      const file = fs.readFileSync(configPath, "utf8");

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

  errors.forEach((error) => {
    console.log(chalkError("\n" + error + "\n"));
  });

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
      errors.push("Translations config is not array.");
    } else {
      const isAllStrings = translations.every(
        (translation) => typeof translation === "string"
      );

      if (!isAllStrings) {
        errors.push("Some items in the translations array are not strings.");
      }
    }
  } else {
    errors.push(`${config} is invalid. Source or translations are missing.`);
  }

  return errors;
}
