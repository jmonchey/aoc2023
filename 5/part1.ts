import * as fs from 'fs';

class RangeMap {
  private sourceEnd: number;
  private targetEnd: number;

  constructor(private sourceStart: number, private targetStart: number, private length: number) {
    this.sourceEnd = sourceStart + length;
    this.targetEnd = targetStart + length;
  }

  isInRange(source: number): boolean {
    return source >= this.sourceStart && source <= this.sourceEnd;
  }

  getTarget(source: number): number {
    return this.targetStart + (source - this.sourceStart);
  }
}

class CoordinateConverter {
  private rangeMaps: RangeMap[];

  constructor(sourceMap: string[]) {
    this.rangeMaps = sourceMap.map(line => {
      let parts = line.trim().split(' ');
      let targetStart = parseInt(parts[0]);
      let sourceStart = parseInt(parts[1]);
      let length = parseInt(parts[2]);
      return new RangeMap(sourceStart, targetStart, length);
    });
  }

  getTarget(source: number): number {
    let rangeMap = this.rangeMaps.find(rangeMap => rangeMap.isInRange(source));

    if (rangeMap) {
      return rangeMap.getTarget(source);
    }

    return source;
  }
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let groups = input.split('\r\n\r\n');
  let seeds = groups[0].split(':')[1].trim().split(' ').map(n => parseInt(n));
  let seedToSoilConverter = new CoordinateConverter(groups[1].split('\r\n').slice(1));
  let soilToFertilizerConverter = new CoordinateConverter(groups[2].split('\r\n').slice(1));
  let fertilizerToWaterConverter = new CoordinateConverter(groups[3].split('\r\n').slice(1));
  let waterToLightConverter = new CoordinateConverter(groups[4].split('\r\n').slice(1));
  let lightToTemperatureConverter = new CoordinateConverter(groups[5].split('\r\n').slice(1));
  let temperatureToHumidityConverter = new CoordinateConverter(groups[6].split('\r\n').slice(1));
  let humidityToLocationConverter = new CoordinateConverter(groups[7].split('\r\n').slice(1));

  let locations: number[] = [];

  for (let seed of seeds) {
    let soil = seedToSoilConverter.getTarget(seed);
    let fertilizer = soilToFertilizerConverter.getTarget(soil);
    let water = fertilizerToWaterConverter.getTarget(fertilizer);
    let light = waterToLightConverter.getTarget(water);
    let temperature = lightToTemperatureConverter.getTarget(light);
    let humidity = temperatureToHumidityConverter.getTarget(temperature);
    let location = humidityToLocationConverter.getTarget(humidity);
    locations.push(location);
  }

  let minLocation = Math.min(...locations);
  console.log(minLocation);
}

solve();