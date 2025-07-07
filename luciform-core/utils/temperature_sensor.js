"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCpuTemperature = getCpuTemperature;
var child_process_1 = require("child_process");
var osHint_js_1 = require("./osHint.js");
/**
 * Retourne la température CPU actuelle en degrés Celsius.
 * Retourne null si la température n'a pas pu être lue.
 */
function getCpuTemperature(_exec, _osHint) {
    if (_exec === void 0) { _exec = child_process_1.exec; }
    if (_osHint === void 0) { _osHint = osHint_js_1.osHint; }
    switch (_osHint) {
        case osHint_js_1.OSContext.Unix:
            return getUnixCpuTemp(_exec);
        case osHint_js_1.OSContext.WindowsCmd:
            return getWindowsCmdCpuTemp(_exec);
        case osHint_js_1.OSContext.WindowsPowershell:
            return getWindowsPowershellCpuTemp(_exec);
        default:
            return Promise.resolve(null);
    }
}
function getUnixCpuTemp(_exec) {
    return new Promise(function (resolve) {
        _exec('sensors', function (error, stdout, stderr) {
            if (error || stderr) {
                resolve(null);
                return;
            }
            var match = stdout.match(/Package id 0:\s+\+?([\d.]+)°C/);
            if (match) {
                resolve(parseFloat(match[1]));
            }
            else {
                resolve(null);
            }
        });
    });
}
function getWindowsCmdCpuTemp(_exec) {
    var cmd = 'wmic /namespace:\\root\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature';
    return new Promise(function (resolve) {
        _exec(cmd, function (error, stdout, stderr) {
            if (error || stderr) {
                resolve(null);
                return;
            }
            var match = stdout.match(/(\d+)/);
            if (match) {
                var kelvin = parseInt(match[1]);
                var celsius = Math.round((kelvin / 10) - 273.15);
                resolve(celsius);
            }
            else {
                resolve(null);
            }
        });
    });
}
function getWindowsPowershellCpuTemp(_exec) {
    var psCommand = 'Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" | Select-Object -First 1 CurrentTemperature';
    return new Promise(function (resolve) {
        _exec("powershell -Command \"".concat(psCommand, "\""), function (error, stdout, stderr) {
            if (error || stderr) {
                resolve(null);
                return;
            }
            var match = stdout.match(/(\d+)/);
            if (match) {
                var kelvin = parseInt(match[1]);
                var celsius = Math.round((kelvin / 10) - 273.15);
                resolve(celsius);
            }
            else {
                resolve(null);
            }
        });
    });
}
