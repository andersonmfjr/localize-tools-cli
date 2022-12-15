import * as fs from "node:fs";
import path from "node:path";
import { exit, cwd } from "node:process";
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
      const configPath = path.join(cwd(), flags.config);
      const config = flags.config
        ? JSON.parse(fs.readFileSync(configPath, "utf8"))
        : {
            source: flags.source,
            translations: flags.translations?.split(","),
          };

      return config;
    }

    console.log(
      chalkError(
        "\nConfig is invalid. For more information view help section.\n"
      )
    );
    exit();
  } else {
    console.log(
      chalkError(
        "\nPlease pass flags to config. For more information view help section.\n"
      )
    );
    exit();
  }
}
