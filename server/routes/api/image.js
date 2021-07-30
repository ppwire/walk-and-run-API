const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');



router.post("/vision", async (req, res) => {
    console.log(req.body.url)
    var listofObject = [];
    
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';

    // Performs text detection on the local file
    const [result] = await client.textDetection(req.body.url);
    const detections = result.textAnnotations;
    detections.forEach(text => {
        var mathches = text.description.match(/[+-]?\d+(\.\d+)?(\:\d+)?(\:\d+)?/g);
        if(mathches){
            listofObject.push(mathches)
        }
    });
    res.json({
        text: listofObject[0]
    })
});

router.post("/push", async (req, res) => {
    
    console.log(req.body.imgdata)
});


module.exports = router;