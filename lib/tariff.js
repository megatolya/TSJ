module.exports = function (tariffId) {
    switch (tariffId) {
        case 0:
            return {
                name: 'Свет (обычный)',
                valuable: true,
                price: 10
            };
            break;
        case 1:
            return {
                name: 'Свет (безлимит)',
                valuable: false,
                price: 500
            };
            break;
        case 2:
            return {
                name: 'Вода (обычный)',
                valuable: true,
                price: 500
            };
            break;
        case 3:
            return {
                name: 'Вода (безлимит)',
                valuable: false,
                price: 700
            };
            break;
        default:
            return new ReferenceError('Unknown tariff');
    }
};
