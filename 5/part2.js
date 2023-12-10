"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var RangeMap = /** @class */ (function () {
    function RangeMap(sourceStart, targetStart, length) {
        this.sourceStart = sourceStart;
        this.targetStart = targetStart;
        this.length = length;
        this.sourceEnd = sourceStart + length;
        this.targetEnd = targetStart + length;
    }
    RangeMap.prototype.isInRange = function (source) {
        return source >= this.sourceStart && source <= this.sourceEnd;
    };
    RangeMap.prototype.getTarget = function (source) {
        return this.targetStart + (source - this.sourceStart);
    };
    return RangeMap;
}());
var CoordinateConverter = /** @class */ (function () {
    function CoordinateConverter(sourceMap) {
        this.rangeMaps = sourceMap.map(function (line) {
            var parts = line.trim().split(' ');
            var targetStart = parseInt(parts[0]);
            var sourceStart = parseInt(parts[1]);
            var length = parseInt(parts[2]);
            return new RangeMap(sourceStart, targetStart, length);
        });
    }
    CoordinateConverter.prototype.getTarget = function (source) {
        var rangeMap = this.rangeMaps.find(function (rangeMap) { return rangeMap.isInRange(source); });
        if (rangeMap) {
            return rangeMap.getTarget(source);
        }
        return source;
    };
    return CoordinateConverter;
}());
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var groups = input.split('\r\n\r\n');
    var seeds = groups[0].split(':')[1].trim().split(' ').map(function (n) { return parseInt(n); });
    var seedToSoilConverter = new CoordinateConverter(groups[1].split('\r\n').slice(1));
    var soilToFertilizerConverter = new CoordinateConverter(groups[2].split('\r\n').slice(1));
    var fertilizerToWaterConverter = new CoordinateConverter(groups[3].split('\r\n').slice(1));
    var waterToLightConverter = new CoordinateConverter(groups[4].split('\r\n').slice(1));
    var lightToTemperatureConverter = new CoordinateConverter(groups[5].split('\r\n').slice(1));
    var temperatureToHumidityConverter = new CoordinateConverter(groups[6].split('\r\n').slice(1));
    var humidityToLocationConverter = new CoordinateConverter(groups[7].split('\r\n').slice(1));
    var locations = [];
    var seed;
    var minLocation = Number.MAX_VALUE;
    for (var i = 0; i < seeds.length - 1; i += 2) {
        for (var j = 0; j < seeds[i + 1]; j++) {
            seed = seeds[i] + j;
            var soil = seedToSoilConverter.getTarget(seed);
            var fertilizer = soilToFertilizerConverter.getTarget(soil);
            var water = fertilizerToWaterConverter.getTarget(fertilizer);
            var light = waterToLightConverter.getTarget(water);
            var temperature = lightToTemperatureConverter.getTarget(light);
            var humidity = temperatureToHumidityConverter.getTarget(temperature);
            var location_1 = humidityToLocationConverter.getTarget(humidity);
            if (location_1 < minLocation) {
                minLocation = location_1;
            }
        }
    }
    console.log(minLocation);
}
solve();
