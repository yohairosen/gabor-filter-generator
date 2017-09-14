var gd = require('node-gd');
var radians = require('degrees-radians');
var path = require('path');

/*
 Module responsible for generating the gabor filter images.
 */


function generate_gabor(orient, size, env, std, freq, phase, color0, color1, color2, outfile) {


    return new Promise(function (resolve, reject) {

        // Convert the orientation to radians
        orient = radians(orient);
        // Convert the size to a factor of the standard deviation
        _size = size;
        size = size / std;


        var im = gd.createTrueColorSync(_size, _size);

        im.alphaBlending(0);
        im.saveAlpha(1);

        for (rx = 0; rx < std * size; rx++) {
            for (ry = 0; ry < std * size; ry++) {
                // The dx from the center
                dx = rx - 0.5 * std * size;
                // The dy from the center
                dy = ry - 0.5 * std * size;
                // The angle of the Math.PIxel
                t = Math.atan2(dy, dx) + orient;
                // The distance of the Math.PIxel from the center
                r = Math.sqrt(dx * dx + dy * dy);
                // The x coordinate in the unrotated image
                x = r * Math.cos(t);
                // The y coordinate in the unrotated image
                y = r * Math.sin(t);
                // The amplitude without envelope (from 0 to 1)
                amp = 0.5 + 0.5 * Math.cos(2 * Math.PI * (x * freq + phase));
                // The amplitude of the Math.PIxel (from 0 to 1)
                if (env == "gaussian") {
                    f = Math.exp(-0.5 * Math.pow(x / std, 2) - 0.5 * Math.pow(y / std, 2));
                } else if (env == "linear") {
                    f = Math.max(0, (0.5 * std * size - r) / (0.5 * std * size));
                } else if (env == "cos") {
                    if (r > _size / 2) {
                        f = 0;
                    } else {
                        f = Math.cos((Math.PI * (r + _size / 2)) / (_size - 1) - Math.PI / 2);
                    }
                } else if (env == "hann") {
                    if (r > _size / 2) {
                        f = 0;
                    } else {
                        f = 0.5 * (1 - Math.cos((2 * Math.PI * (r + _size / 2)) / (_size - 1)));
                    }
                } else if (env == "hamming") {
                    if (r > _size / 2) {
                        f = 0;
                    } else {
                        f = 0.54 - 0.46 * Math.cos((2 * Math.PI * (r + _size / 2)) / (_size - 1));
                    }
                } else if (env == "circle") {
                    if (r > 0.5 * std * size) {
                        f = 0;
                    } else {
                        f = 1;
                    }
                } else {
                    f = 1;
                }
                r = color1[0] * amp + color2[0] * (1 - amp);
                g = color1[1] * amp + color2[1] * (1 - amp);
                b = color1[2] * amp + color2[2] * (1 - amp);
                if (color0[0] < 0 || color0[1] < 0 || color0[2] < 0) {
                    color = im.colorAllocateAlpha(r, g, b, 127 - 127 * f);
                } else {
                    r = Math.round(r * f + color0[0] * (1 - f));
                    g = Math.round(g * f + color0[1] * (1 - f));
                    b = Math.round(b * f + color0[2] * (1 - f));

                    color = im.colorAllocateAlpha(r, g, b, 0);
                }

                im.setPixel(rx, ry, color);
            }
        }

        im.savePng(path.resolve('public') + '/images/' + outfile + '.png', 0, function (error) {
            if (error) throw error;
            im.destroy();
            resolve();

        });
    });

    return new gaborfilter();

}

module.exports = generate_gabor;

