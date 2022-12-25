# Localize Tools CLI

The Locale Tools CLI is a command line interface tool that you use to get a better development experience (DX) when working with the @angular/localize package in Angular apps directly from a command shell.

It is useful for small and medium teams of developers that don't have specialized translators.

## Current features

Currently the package **only works with the JSON file format**. You could read more about translation file formats in the [Angular documentation](https://angular.io/guide/i18n-common-translation-files#change-the-source-language-file-format).

The current utilities/commands are:

- Order translations based on source translations order
- Remove unused translations based on source translations
- Show missing translations based on source translations
- Add missing translations on each translations files

## Installing Localize Tools CLI

Install the CLI using the `npm` package manager, inside your Angular project:

```bash
npm install --save-dev localize-tools-cli
```

## Basic workflow

Invoke the tool on the command line through the `npx localize-tools` executable.
Enter the following to list commands or options for a given command with a short description.

```bash
npx localize-tools-cli help
npx localize-tools-cli order --help
```

### Configuration

To run the available commands, you must pass two mandatory settings:

1. Path of messages file (relative to the current working directory), generated by the command `ng extract-i18n --output-path`. Read more [here](https://angular.io/guide/i18n-common-translation-files#extract-the-source-language-file).
2. Paths of translations files (relative to the current working directory). Read more [here](https://angular.io/guide/i18n-common-translation-files#create-a-translation-file-for-each-language).

You can do this in two ways:

```bash
# First
npx localize-tools-cli order -c=./ltcconfig.json

# Second
npx localize-tools-cli order -s=./messages.json --translations=./messages.pt.json,./messages.es.json
```

For the first way, the configuration file must have the following pattern:

```json
{
  "source": "./src/locale/messages.json",
  "translations": [
    "./src/locale/messages.pt.json"
  ]
}
```

### Recommended setup

We recommend that you add the following commands to your `package.json` (inside the `scripts` section):

```json
{
  "scripts": {
    "i18n:generate": "ng extract-i18n --output-path src/locale --format json",
    "i18n:order": "npx localize-tools-cli order -c=./ltcconfig.json",
    "i18n:remove-unused": "npx localize-tools-cli remove-unused -c=./ltcconfig.json",
    "i18n:organize": "npm run i18n:remove-unused && npm run i18n:order",
    "i18n:get-missing": "npx localize-tools-cli get-missing -c=./ltcconfig.json"
  }
}
```

Whenever you finish a feature, you can execute the commands like this:

```bash
npm run i18n:generate # extract translations
npm run i18n:remove-unused # remove unused translations
npm run i18n:get-missing # or npm run i18n:get-missing -- --add to add missing keys directly to files
```

At this point, you should have the missing translations printed in your terminal or added in your translations files.
After translating, you can run the following command to organize the files:

```bash
npm run i18n:organize
```

This flow will help you to keep your files organized, without useless and orderly translations.
