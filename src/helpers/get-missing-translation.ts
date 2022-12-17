import * as fs from "node:fs";
import { cwd, exit } from "node:process";
import path from "node:path";
import { chalkError } from "./chalk-themes";
import { MissingTranslationModel } from "../models/missing-translation";

export function getMissingTranslation(source: string, translation: string) {
  try {
    const dir = cwd();
    const sourcePath = path.join(dir, source);
    const translationPath = path.join(dir, translation);

    const defaultLocaleRawData = fs.readFileSync(sourcePath, "utf8");
    const defaultLocaleJson = JSON.parse(defaultLocaleRawData);
    const defaultTranslations = defaultLocaleJson.translations;

    const missingData: MissingTranslationModel = {
      path: translation,
      missingTranslations: [],
    };

    const localeRawData = fs.readFileSync(translationPath, "utf8");
    const localeJson = JSON.parse(localeRawData);
    const localeTranslations = localeJson.translations;

    const missingKeys = compareObjects(defaultTranslations, localeTranslations);

    missingKeys.forEach((missingKey: string) => {
      missingData.missingTranslations.push({
        key: missingKey,
        value: defaultTranslations[missingKey],
      });
    });

    return missingData;
  } catch (error) {
    console.log(chalkError("\n" + error + "\n"));
    exit();
  }
}

function compareObjects(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): string[] {
  const missingKeys = [];

  for (const prop in obj1) {
    if (obj2[prop]) {
      if (typeof obj1[prop] === "object" && typeof obj2[prop] === "object") {
        compareObjects(obj1[prop], obj2[prop]);
      }
    } else {
      if (typeof obj1[prop] === "object") {
        compareObjects(obj1[prop], {});
      }
      missingKeys.push(prop);
    }
  }

  return missingKeys;
}
