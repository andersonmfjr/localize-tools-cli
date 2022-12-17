import detectIndent from "detect-indent";
import * as fs from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";
import { chalkError } from "./chalk-themes";

export function addTranslation(
  translationPath: string,
  translations: Record<string, string>
) {
  try {
    const localePath = path.join(cwd(), translationPath);

    const localeRawData = fs.readFileSync(localePath, "utf8");
    const localeJson = JSON.parse(localeRawData);
    const localeTranslations = {
      ...localeJson.translations,
      ...translations,
    };

    localeJson.translations = localeTranslations;

    const indent = detectIndent(localeRawData).indent || "  ";
    const parsedData = JSON.stringify(localeJson, null, indent);
    const endOfFileMatches = localeRawData.match(/\r?\n$/)?.[0];
    const endOfFile = endOfFileMatches ? endOfFileMatches : "";

    fs.writeFileSync(localePath, parsedData + endOfFile);
  } catch (error) {
    console.log(chalkError("\n" + error + "\n"));
    exit();
  }
}
