const { Responder } = require('cote');
const Jimp = require('jimp');
const path = require('path');

(async() => {
    const responder = new Responder({ name: 'resizing image service' });
    console.log(__dirname);
    responder.on('create-thumbnail', async(req, done) => {
        try {
            const { image, destination } = req;

            const sourceImg = destination + '/' + image.split('.')[0] + image.substring(image.indexOf('.'));
            const src = path.join(__dirname, '..', sourceImg);
            const destinationImg = destination + '/' + image.split('.')[0] + '-thumbnail' + image.substring(image.indexOf('.'));
            const dest = path.join(__dirname, '..', destinationImg);
            // open a file called "lenna.png"
            Jimp.read(src, (err, img) => {
                if (err) {
                    console.error(err);
                    throw err
                };
                img
                    .resize(100, 100) // resize
                    .write(dest); // save
            });
            console.log(`Imagen ${destinationImg} reescalada como thumbnail`);
            done();
        } catch (error) {
            done({ message: error.message }, null);
        }
    })
})().catch(error => { console.error(error); })