# env-config-prompt
Environment Configuration Prompter.

This module loads environment config and handles manual config prompting

### install
```npm install env-config-prompt```

### base configuration file

Create a base configuration json object file. This object can contain any depth.

#### detail system
The base config file have to be encoded using an internal "detail" format. Here is an example of a detail object using all detail input types.

```json
{
    "@detail": {
        "input_type": "object",

        "port": {
            "@detail": {
                "input_type": "value",
                "type": "number",
                "required": true,
                "def": 3000
            }
        },

        "only local": {
            "@detail": {
                "input_type": "option",
                "options": {
                    "true": true,
                    "false": false
                }
            }
        },

        "cron_system": {
            "@detail": {
                "input_type": "object",

                "enabled": {
                    "@detail": {
                        "input_type": "option",
                        "options": {
                            "true": true,
                            "false": false
                        },
                        "skip_next_if": false
                    }
                },

                "timer": {
                    "@detail": {
                        "input_type": "option",
                        "reset_after_input": true,
                        "options": {
                            "minute": {
                                "by_minute": {
                                    "@detail": {
                                        "input_type": "value",
                                        "type": "number",
                                        "required": true,
                                        "def": 5
                                    }
                                }
                            },
                            "hour": {
                                "by_hours": {
                                    "@detail": {
                                        "input_type": "value",
                                        "type": "number",
                                        "required": true,
                                        "def": 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

The above example will result in the following prompt sequence and its respective config file:

```
port (3000) : 8080
only local (true/false): false
cron_system.enabled (true/false): true
cron_system.timer (minute/hour): hour
cron_system.timer.by_hours (1) : 2
```
```json
{
    "port": 8080,
    "only local": false,
    "cron_system": {
        "enabled": true,
        "timer": {
            "by_hours": 2
        }
    }
}
```
or
```
port (3000) : 
only local (true/false): true
cron_system.enabled (true/false): false
```
```json
{
    "port": 3000,
    "only local": true,
    "cron_system": {
        "enabled": false
    }
}
```

#### template
In order to facilitate the creation of the base config file, some syntax sugar has been added. Here is the above base config using the template:

```json

{
    "port": 3000,

    "only local": true,

    "cron_system": {

        "enabled": {
            "@detail": {
                "input_type": "option",
                "options": {
                    "true": true,
                    "false": false
                },
                "skip_next_if": false
            }
        },

        "timer": {
            "@detail": {
                "input_type": "option",
                "reset_after_input": true,
                "options": {
                    "minute": {"by_minute": 5},
                    "hour": {"by_hours": 5}
                    
                }
            }
        }
    }
}
```

### usage
In order to load the configuration file, one might load the module as a method and call for it while in its script as shown here

```javascript

const config_loader = require('env-config-prompt')

let config = config_loader()

```

#### option parameters
 - ```force_reset``` force reset the config file (default is ```false```)
 - ```conf_file``` file name for final config file (default is ```'config.json'```)
 - ```base_conf_file``` file name for the base config file (default is ```'base_config.json'```)
 - ```config_title``` first config console title (default is ```'FIRST CONFIGURATION'```)
 - ```use_config_title``` use a first time config title (default is ```true```)

### advices

 - add the ```config.json``` (or whatever custom filename yo want to use for the config) in your .gitignore file

### LICENSE

[MIT LICENSE](LICENCSE)