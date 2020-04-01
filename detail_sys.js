// -------------------------------------------------------------------- IMPORTS

const rl = require('readline-sync')

// -------------------------------------------------------------------- INFO MAP

// DETAIL SYSTEM
// -- GLOBAL
// -- -- input_type
// -- -- skip_next_if (skip next prop if value is...)
// -- value
// -- -- type
// -- -- required
// -- -- def
// -- option
// -- -- option
// -- -- reset_after_input

// -------------------------------------------------------------------- DETAIL TYPE MAP

const detail_map = {

    // ------------------- OBJECT HANDLER
    
    'object': function(detail, path) {

        delete detail.input_type

        let config = {}

        for(let prop in detail) {

            path.push(prop)

            let value = handles_input(detail[prop], path)
            if(value != undefined) {
                config[prop] = value
            }

            path.pop(prop)

            if(need_to_skip_next(detail[prop], value)) {
                break
            }

        }

        return config

    },

    // ------------------- SIMPLE VALUE HANDLER
    
    'value': function(detail, path) {

        let type = detail.type
        let required = detail.required
        let def = ('def' in detail) ? detail.def : undefined

        let value = null

        while (value == null) {
            value = rl.question(create_question_str(detail, path))
            if (value == '') {
                value = def
                if (!required) {
                    return value
                } else {
                    continue
                }
            }
            if (type != 'string') {
                try {
                    value = JSON.parse(value)
                } catch(err) {
                    console.log('incorrect value, require type ' + type)
                }
            }
            if(typeof value != type) {
                value = null
                continue
            }
        }

        return value
    },

    // ------------------- MULTIPLE OPTIOINS HANDLER
    
    'option': function(detail, path) {

        let options = detail.options
        let reset_after_input = detail.reset_after_input

        let input = null
        while (input == null) {
            input = rl.question(create_question_str(detail, path))
            if (!(input in options)) {
                console.log('incorrect value, use a proposed option')
                input = null
            }
        }
        
        let value = options[input]

        if(reset_after_input) {
            value = handles_input(value, path)
        }

        return value

    }
}

// -------------------------------------------------------------------- DETAIL CREATION (SYNAX SUGAR)

function create_detail(config) {

    // ------------------- CONGI ALREADY IS A DETAIL OBJECT

    if (typeof config == 'object' && config != null && '@detail' in config) {
        return config
    }

    // ------------------- SIMPLE VALUE ASKER
    
    if (typeof config == 'number' || typeof config == 'string' || config == null) {
        return {
            '@detail': {
                input_type: 'value',
                type: config == null ? 'string' : typeof config,
                required: config == null,
                def: config
            }
        }
    }

    // ------------------- SIMPLE GLOBAL OBJECT

    if (typeof config == 'object') {
        let obj = {
            '@detail': config
        }
        obj['@detail'].input_type = 'object'
        return obj
    }

    // ------------------- CREATE BOOLEAN OPTION
    
    if (typeof config == 'boolean') {
        return {
            '@detail': {
                input_type: 'option',
                def: String(config),
                options: {
                    true: true,
                    false: false
                }
            }
        }
    }
}

// -------------------------------------------------------------------- INNER METHODS

// ------------------- CREATE PROMPT QUESTION

function create_question_str(detail, path) {
    let def = ''
    if (detail.def) {
        def = ' (' + detail.def + ') '
    }
    
    if (detail.input_type == 'option') {
        def = ' (' + Object.keys(detail.options).join('/') + ')'
    }

    let str = path.join('.') + def + ': '

    return str
}

// ------------------- SKIP NEXT IF

function need_to_skip_next(config, value) {
    let detail = create_detail(config)['@detail']
    if ('skip_next_if' in detail) {
        return value == detail.skip_next_if
    }
    return false
}

// ------------------- MAIN HANDLER

function handles_input(config, path=[]) {
    config = create_detail(config)
    let detail = config['@detail']
    let input_type = detail.input_type

    return detail_map[input_type](detail, path)
}

// -------------------------------------------------------------------- EXPORTS

module.exports = handles_input
