import detectIndent from "detect-indent";
import * as fs from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";
import { chalkError } from "./chalk-themes";

export function removeUnusedTranslation(source: string, translation: string) {
  try {
    const dir = cwd();
    const sourcePath = path.join(dir, source);
    const translationPath = path.join(dir, translation);

    const sourceLocaleRawData = fs.readFileSync(sourcePath, "utf8");
    const sourceLocaleJson = JSON.parse(sourceLocaleRawData);
    const sourceTranslations = sourceLocaleJson.translations;
    const sourceTranslationsKeys = Object.keys(sourceTranslations);

    const localeRawData = fs.readFileSync(translationPath, "utf8");
    const localeJson = JSON.parse(localeRawData);
    const localeTranslations = localeJson.translations;
    const localeTranslationsKeys = Object.keys(localeTranslations);

    const unusedIds = localeTranslationsKeys.filter(
      (key) => !sourceTranslationsKeys.includes(key)
    );

    const newTranslations: Record<string, string> = {};
    for (const [key, value] of Object.entries(localeTranslations)) {
      if (!unusedIds.includes(key)) {
        newTranslations[key] = value as string;
      }
    }

    localeJson.translations = newTranslations;

    const indent = detectIndent(localeRawData).indent || "  ";
    const parsedData = JSON.stringify(localeJson, null, indent);
    const endOfFileMatches = localeRawData.match(/\r?\n$/)?.[0];
    const endOfFile = endOfFileMatches ? endOfFileMatches : "";

    fs.writeFileSync(translationPath, parsedData + endOfFile);
  } catch (error) {
    console.log(chalkError(error));
    exit();
  }
}
