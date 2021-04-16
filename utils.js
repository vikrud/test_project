function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

function isArrayWithData(arr) {
    if (Array.isArray(arr) && arr[0].id) {
        return true;
    }

    return false;
}

module.exports = { isEmpty, isArrayWithData };
