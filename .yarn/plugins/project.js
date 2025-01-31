const path = require('node:path')
const fs = require('fs/promises')
module.exports = {
  name: `plugin-project`,
  factory: require => {
    const {BaseCommand} = require(`@yarnpkg/cli`);
    const { Manifest } = require('@yarnpkg/core');
    class HelloWorldCommand extends BaseCommand {
      static paths = [[`project`]];
      static deps = [];

      async execute() {
        const { raw: { name, version, author, description, dependencies } } = await Manifest.find(this.context.cwd);
        const formattedDependencies =
          Object.entries(dependencies).map(([name, version]) => `${name}: ${version}`);
        this.context.stdout.write(
          JSON.stringify({ name, version, author, description, dependencies: formattedDependencies })
        );
      }
    }

    return {
      commands: [
        HelloWorldCommand,
      ],
    }
  }
};
