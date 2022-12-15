import { filesAreValid } from "../../helpers/files-are-valid";
import { getGlobalConfig } from "../../helpers/get-global-config";
import { orderTranslations } from "../../helpers/order-translation";
import { BaseCommand } from "../base";

export default class OrderCommand extends BaseCommand {
  static description =
    "Order translations of translations files based on source order";

  static examples = [
    `$ ltc order --source=./messages.pt --translations=./messages.pt.json`,
    `$ ltc order --source=./messages.pt --translations=./messages.pt.json,./messages.es.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(OrderCommand);
    const config = getGlobalConfig(flags);

    if (filesAreValid(config)) {
      config.translations.forEach((translation) => {
        orderTranslations(config.source, translation);
      });
    }
  }
}
