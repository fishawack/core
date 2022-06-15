module.exports = function (v1, operator, v2, rt1, rt2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? rt1 : rt2;
        case '===':
            return (v1 === v2) ? rt1 : rt2;
        case '!==':
            return (v1 !== v2) ? rt1 : rt2;
        case '<':
            return (v1 < v2) ? rt1 : rt2;
        case '<=':
            return (v1 <= v2) ? rt1 : rt2;
        case '>':
            return (v1 > v2) ? rt1 : rt2;
        case '>=':
            return (v1 >= v2) ? rt1 : rt2;
        case '&&':
            return (v1 && v2) ? rt1 : rt2;
        case '||':
            return (v1 || v2) ? rt1 : rt2;
        default:
            return false;
    }
};