import { Command, Flags } from "@oclif/core";

export abstract class BaseCommand extends Command {
  static globalFlags = {
    config: Flags.string({
      char: "c",
      description: "Configuration file path. Relative to current directory.",
    }),
    source: Flags.string({
      char: "s",
      description:
        "Source language file path (generated by ng extract-i18n). Relative to current directory. Optional if configuration file is passed.",
    }),
    translations: Flags.string({
      char: "t",
      description:
        "Paths of translations files, separated by comma (,). Relative to current directory. Optional if configuration file is passed.",
    }),
  };
}
