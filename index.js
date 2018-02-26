/**
 * Validate if the value is a string
 * @param {*} value 
 */
function isFieldSimple(value) {
    return typeof value === 'string';
}

/**
 * Validate if the value is a function
 * @param {*} value 
 */
function isFieldFunction(value) {
    return typeof value === 'function';
};

/**
 * Validate if the value is a object
 * @param {*} value 
 */
function isFieldObject(value) {
    return typeof value === 'object' && value.constructor === Object;
};

/**
 * Validate if the value is a array
 * @param {*} value 
 */
function isFieldArray(value) {
    return typeof value === 'object' && value.constructor === Array;
};

/**
 * New instance Transformer
 * @param {*} obj properties
 */
function Transformer(obj) {
    var keysObject = Object.keys(obj);
    for (var i = 0; i < keysObject.length; i++) {
        var property = obj[keysObject[i]];
        if (isFieldObject(property)) {
            if (!property.hasOwnProperty('field')) {
                throw "The field {" + keysObject[i] + "} must have the property {field}";
            }
            if (!property.hasOwnProperty('reference')) {
                throw "The field {" + keysObject[i] + "} must have the property {reference}";
            }
            if (!(property.reference instanceof Transformer)) {
                throw "The field {" + keysObject[i] + ".reference} must be a instance of the Transformer";
            }
        }
    }
    this.obj = obj;
}

/**
 * Method public that transform data
 * @param {*} data
 */
Transformer.prototype.transformer = function (data) {

    function tranformItem(properties, data) {
        var dataResponse = {};
        var keysObject = Object.keys(properties);
        for (var i = 0; i < keysObject.length; i++) {
            var key = keysObject[i];
            var value = properties[key];
            if (isFieldSimple(value)) {
                dataResponse[key] = data[value];
            }
            if (isFieldFunction(value)) {
                dataResponse[key] = value(data);
            }
            if (isFieldObject(value)) {
                var field = value.field;
                var reference = value.reference;
                if (isFieldArray(data[value.field])) {
                    var collection = data[value.field];
                    var dataArray = [];
                    for (var j = 0; j < collection.length; j++) {
                        dataArray.push(reference.transformer(collection[j]));
                    }
                    dataResponse[key] = dataArray;
                }
                if (isFieldObject(data[value.field])) {
                    dataResponse[key] = reference.transformer(data[value.field]);
                }
            }
        }
        return dataResponse;
    }

    if (isFieldArray(data)) {
        var dataArray = [];
        for (var i = 0; i < data.length; i++) {
            dataArray.push(tranformItem(this.obj, data[i]));
        }
        return dataArray;
    }

    if (isFieldObject(data)) {
        return tranformItem(this.obj, data);
    }
};

module.exports = exports = Transformer;