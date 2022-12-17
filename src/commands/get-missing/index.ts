import {
  chalkErrorText,
  chalkInfo,
  chalkInfoText,
  chalkSuccess,
} from "../../helpers/chalk-themes";
import { filesAreValid } from "../../helpers/files-are-valid";
import { getGlobalConfig } from "../../helpers/get-global-config";
import { getMissingTranslation } from "../../helpers/get-missing-translation";
import { MissingTranslationModel } from "../../models/missing-translation";
import { BaseCommand } from "../base";

export default class GetMissingCommand extends BaseCommand {
  static description =
    "Show missing translations of translations files based on source translations";

  static examples = [
    `$ cli get-missing --config=./config.json`,
    `$ cli get-missing --source=./messages.json --translations=./messages.pt.json`,
    `$ cli get-missing --source=./messages.json --translations=./messages.pt.json,./messages.es.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(GetMissingCommand);
    const config = getGlobalConfig(flags);

    if (filesAreValid(config)) {
      const missingTranslations: MissingTranslationModel[] = [];

      config.translations.forEach((translation) => {
        missingTranslations.push(
          getMissingTranslation(config.source, translation)
        );
      });

      const isEmpty = missingTranslations.every(
        (missingTranslation) =>
          missingTranslation.missingTranslations.length === 0
      );

      if (isEmpty) {
        console.log(chalkSuccess("\n" + "No missing translations." + "\n"));
        return;
      }

      missingTranslations.forEach((missingTranslation, index) => {
        if (missingTranslation.missingTranslations.length > 0) {
          console.log(
            chalkInfo(
              `\n${index === 0 ? "\n" : ""}${
                index + 1
              }. Missing translations for ${missingTranslation.path}`
            )
          );
          console.log(
            chalkInfo("=".repeat(missingTranslation.path.length + 28))
          );

          missingTranslation.missingTranslations.forEach(({ key, value }) => {
            console.log(
              `${chalkErrorText(`"${key}"`)}: ${chalkInfoText(
                JSON.stringify(value)
              )}`
            );
          });
        }
      });
    }
  }
}
