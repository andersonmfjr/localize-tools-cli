import { chalkSuccess } from "../../helpers/chalk-themes";
import { filesAreValid } from "../../helpers/files-are-valid";
import { getGlobalConfig } from "../../helpers/get-global-config";
import { orderTranslation } from "../../helpers/order-translation";
import { BaseCommand } from "../base";

export default class OrderCommand extends BaseCommand {
  static description =
    "Order translations of translations files based on source order";

  static examples = [
    `$ cli order --config=./config.json`,
    `$ cli order --source=./messages.json --translations=./messages.pt.json`,
    `$ cli order --source=./messages.json --translations=./messages.pt.json,./messages.es.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(OrderCommand);
    const config = getGlobalConfig(flags);

    if (filesAreValid(config)) {
      config.translations.forEach((translation) => {
        orderTranslation(config.source, translation);
      });

      console.log(chalkSuccess("\nTranslations ordered successfully.\n"));
    }
  }
}
