module.exports = function (count, callback, args) {
    count = count || 1;
    currentCount = 0;
    callback = callback || function () {
        process.exit(0);
    };
    args = args || {length: 0};
    return function () {
        currentCount++;
        if (currentCount >= count)
            callback(args);
    };
};
