const { series } = require('gulp');
const format = require('string-format');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const config = {
    name: 'Lautum',
    base: 'src/base.qss',
    palettes: [
        {
            name: 'Dark',
            file: 'src/palettes/dark.yml'
        }
    ],
    dest: process.env.DIST || 'dist'
}

function generateTheme(palette) {
    const baseData = this.baseData;
    const paletteData = yaml.load(fs.readFileSync(palette.file, 'utf8'));
    const themeData = format(baseData, paletteData);
    const destFile = path.join(config.dest, `${config.name} ${palette.name}.qss`);
    fs.writeFileSync(destFile, themeData, { encoding: 'utf8' });
}

function generateThemes(done) {
    // Create dest directory
    fs.mkdirSync(config.dest, { recursive: true });

    // Load base theme data and generate variants using the available palettes
    const baseData = fs.readFileSync(config.base, 'utf8');
    config.palettes.map(generateTheme, { baseData: baseData });

    done();
}

exports.default = series(generateThemes);
