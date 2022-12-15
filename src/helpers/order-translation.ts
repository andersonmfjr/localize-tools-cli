import detectIndent from "detect-indent";
import * as fs from "node:fs";
import { chalkError } from "./chalk-themes";

export function orderTranslations(source: string, translation: string) {
  try {
    const defaultLocaleRawData = fs.readFileSync(source, "utf8");
    const defaultLocaleJson = JSON.parse(defaultLocaleRawData);
    const defaultTranslations = defaultLocaleJson.translations;
    const defaultTranslationsKeys = Object.keys(defaultTranslations);

    const localeRawData = fs.readFileSync(translation, "utf8");
    const localeJson = JSON.parse(localeRawData);
    const localeTranslations = localeJson.translations;

    const newTranslations: Record<string, string> = {};

    defaultTranslationsKeys.forEach((key) => {
      if (localeTranslations[key]) {
        newTranslations[key] = localeTranslations[key];
      }
    });

    localeJson.translations = newTranslations;

    const indent = detectIndent(localeRawData).indent || "  ";
    const parsedData = JSON.stringify(localeJson, null, indent);
    const endOfFileMatches = localeRawData.match(/\r?\n$/)?.[0];
    const endOfFile = endOfFileMatches ? endOfFileMatches : "";

    fs.writeFileSync(translation, parsedData + endOfFile);
  } catch (err) {
    console.log(chalkError(err));
  }
}
