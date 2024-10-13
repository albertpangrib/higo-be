const isJSONString = (string) => {
    try {
        JSON.parse(string);
    } catch (err) {
        return false;
    }

    return true;
};

const isJSONObj = (obj) => {
    try {
        JSON.stringify(obj);
    } catch (err) {
        return false;
    }

    return true;
};

module.exports = {
   isJSONString,
   isJSONObj
};