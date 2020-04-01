# env-config-prompt
Environment Configuration Prompter.

This module loads environment config and handles manual config prompting

## install
```npm install env-config-prompt```

## base configuration file
Create a base configuration json object file. This object can contain any depth.
- non object values will be handled as default values
- ```null``` values will be handled as a required user input
- use an empty string ```""``` for a an empty non required input
- base configuration file example:
  
```json
{
    "server": {
        "port": 3000,
        "interface": "127.0.0.1"
    },
    "version": "0.0.0",
    "author": "",
    "git-repo": null
}
```
 - here the server config will be prompter property by property
 - the version (, port and interface) are default valued properties
 - the author property is an empty non required property
 - the git-repo property is required

## usage
In order to load the configuration file, one might load the module as a method and call for it while in its script as shown here

```javascript

const config_loader = require('env-config-prompt')

let config = config_loader()

```

### option parameters
 - ```force_reset``` force reset the config file (default is ```false```)
 - ```conf_file``` file name for final config file (default is ```'config.json'```)
 - ```base_conf_file``` file name for the base config file (default is ```'base_config.json'```)
 - ```config_title``` first config console title (default is ```'FIRST CONFIGURATION'```)
 - ```use_config_title``` use a first time config title (default is ```true```)

### LICENSE

[MIT LICENSE](LICENCSE)