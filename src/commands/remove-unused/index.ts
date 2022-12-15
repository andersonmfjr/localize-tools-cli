import { chalkSuccess } from "../../helpers/chalk-themes";
import { filesAreValid } from "../../helpers/files-are-valid";
import { getGlobalConfig } from "../../helpers/get-global-config";
import { removeUnusedTranslation } from "../../helpers/remove-unused-translation";

import { BaseCommand } from "../base";

export default class RemoveUnusedCommand extends BaseCommand {
  static description =
    "Remove unused translations of translations files based on source translations";

  static examples = [
    `$ cli remove-unused --config=./config.json`,
    `$ cli remove-unused --source=./messages.json --translations=./messages.pt.json`,
    `$ cli remove-unused --source=./messages.json --translations=./messages.pt.json,./messages.es.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(RemoveUnusedCommand);
    const config = getGlobalConfig(flags);

    if (filesAreValid(config)) {
      config.translations.forEach((translation) => {
        removeUnusedTranslation(config.source, translation);
      });

      console.log(
        chalkSuccess("\nUnused translations removed successfully.\n")
      );
    }
  }
}
