/*! Kernel CI Dashboard | Licensed under the GNU GPL v3 (or later) */
define([
    'utils/date'
], function() {
    'use strict';
    var dateFormat;
    var gFormat;
    var numFormat;
    var sizes;

    gFormat = {};

    try {
        dateFormat = new Intl.DateTimeFormat(
            ['en-US'], {month: 'long', year: 'numeric'});
    } catch (ignore) {
        /*
         * WebKit does not have the Intl library implementation.
         * So do the mobile browsers.
        */
        dateFormat = {
            format: function(value) {
                return value.toCustomISODate();
            }
        };
    }

    try {
        numFormat = new Intl.NumberFormat(['en-US']);
    } catch (ignore) {
        /*
         * WebKit does not have the Intl library implementation.
         * So do the mobile browsers.
        */
        numFormat = {
            format: function(value) {
                return value;
            }
        };
    }

    sizes = [
        'bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'
    ];

    /**
     * Round a value down to 2 decimal positions.
     *
     * @private
     * @param {Number} value: The value to round.
     * @return {Number} The rounded value.
    **/
    function roundToTwo(value) {
        return +(Math.round(value + 'e+2') + 'e-2');
    }

    /**
     * Format a number through the Intl library.
     *
     * @param {Number} value: The number to format.
     * @return {String} The formatted number as a string.
    **/
    gFormat.number = function(value) {
        return numFormat.format(value);
    };

    /**
     * Format a float number rounding it to two decimals.
     * Formatting is done through the Intl libray (if available).
     *
     * @param {Number} value: The floating point number to format.
     * @return {String} The formatted number as a string.
    **/
    gFormat.float = function(value) {
        return numFormat.format(roundToTwo(value));
    };

    /**
     * Format a bytes number into a human-readable form.
     *
     * @param {Number} bytes: The bytes number to format.
     * @return {String} The formatted number as a string.
    **/
    gFormat.bytes = function(bytes) {
        var calcBase;
        var idx;
        var retVal;

        calcBase = 1024;
        if (bytes === 0 || isNaN(bytes)) {
            retVal = '0 bytes';
        } else {
            idx = Math.floor(Math.log(bytes) / Math.log(calcBase));
            retVal = numFormat.format(
                roundToTwo(
                    bytes / Math.pow(calcBase, idx))) + ' ' + sizes[idx];
        }

        return retVal;
    };

    /**
     * Parse a byte number into a number-formatted human-readable form.
     * This will keep the byte value as is, it will not be converted.
     *
     * @param {Number} bytes: The number to format.
     * @return {String} The formatted string.
    **/
    gFormat.bytesToBytes = function(bytes) {
        var toBytes;

        if (bytes === 0 || isNaN(bytes)) {
            toBytes = '0 bytes';
        } else if (bytes === 1) {
            toBytes = '1 byte';
        } else {
            toBytes = numFormat.format(bytes) + ' bytes';
        }

        return toBytes;
    };

    /**
     * Format a Date object through the Intl library (if available).
     * If the Intl library is not available return the custom ISO format.
     *
     * @param {Date} value: The date object to format.
     * @return {String} The formatted date.
    **/
    gFormat.date = function(value) {
        return dateFormat.format(value);
    };

    return gFormat;
});
