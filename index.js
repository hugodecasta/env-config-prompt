// -------------------------------------------------------------------- EXPORTS

const fs = require('fs')
const rl = require('readline-sync')

// -------------------------------------------------------------------- METHODS

// ------------------- FILES

function load(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

function save(filename, config) {
    return fs.writeFileSync(filename, JSON.stringify(config, null, 4),)
}

// ------------------- PROMPT

function prompt_config(base_config, path=[]) {

    if (typeof base_config != 'object' || base_config == null) {

        base_config = base_config == '' ? undefined : base_config

        let base_config_str = base_config == null ? '' : '('+base_config+')'
        let value = null

        while (value === null) {
            value = rl.question(path.join('.') + ' ' + base_config_str + ': ')
            value = value == '' ? base_config : value
        }

        return value
    }

    let config = {}

    for (let prop in base_config) {

        path.push(prop)

        let value = prompt_config(base_config[prop], path)
        if (value != undefined) {
            config[prop] = value
        }

        path.pop()

    }

    return config

}

// -------------------------------------------------------------------- CORE

function load_config(
    force_reset=false, 
    conf_file='config.json', 
    base_conf_file='base_config.json', 
    config_title='FIRST CONFIGURATION', 
    use_config_title=true) {

    if (!fs.existsSync(conf_file) || force_reset) {
    
        if (use_config_title) {
            console.log('\n' + config_title + '\n')
        }
    
        let base_config = load(base_conf_file)
        let config = prompt_config(base_config)
        save(conf_file, config)
    
    }

    return load(conf_file)
}

// -------------------------------------------------------------------- EXPORTS

module.exports = load_config