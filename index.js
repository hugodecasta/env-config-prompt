// -------------------------------------------------------------------- EXPORTS

const fs = require('fs')
const detail_handler = require('./detail_sys')

// -------------------------------------------------------------------- METHODS

// ------------------- FILES

function load(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

function save(filename, config) {
    return fs.writeFileSync(filename, JSON.stringify(config, null, 4),)
}

// ------------------- BASE CONFIG HANDLER

function handles_input(config, path=[]) {
    config = create_detail(config)
    let detail =config['@detail']
    let input_type = detail.input_type

    return detail_map[input_type](detail, path)
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
        let config = detail_handler(base_config)
        save(conf_file, config)
    
    }

    return load(conf_file)
}

// -------------------------------------------------------------------- EXPORTS

module.exports = load_config
load_config(true)