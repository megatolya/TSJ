module.exports = function (count, callback, args) {
    callback = callback || function () {
        process.exit(0);
    };
    args = args || {length: 0};
    if (count === 0)
        return callback(args);

    count = count || 1;
    currentCount = 0;
    return function () {
        currentCount++;
        if (currentCount >= count)
            callback(args);
    };
};
