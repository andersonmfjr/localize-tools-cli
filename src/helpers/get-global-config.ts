import * as fs from "node:fs";
import { exit } from "node:process";
import { chalkError } from "./chalk-themes";
import { configIsValid as configIsValidHelper } from "./config-is-valid";

export function getGlobalConfig(flags: Record<string, any>): {
  source: string;
  translations: string[];
} {
  const hasConfig = flags.config || (flags.source && flags.translations);

  if (hasConfig) {
    const configIsValid = configIsValidHelper(
      flags.config || {
        source: flags.source,
        translations: flags.translations?.split(","),
      }
    );

    if (configIsValid) {
      const config = flags.config
        ? JSON.parse(fs.readFileSync(flags.config, "utf8"))
        : {
            source: flags.source,
            translations: flags.translations?.split(","),
          };

      return config;
    }

    console.log(
      chalkError("Config is invalid. For more information view help section")
    );
    exit();
  } else {
    console.log(
      chalkError("Please pass flags. For more information view help section")
    );
    exit();
  }
}
