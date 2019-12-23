const vision = require('@google-cloud/vision');

/*
* In this function, any error occured during recognition process will return TRUE
*/
export const areImagesOnConstestLegal = async (snapshot: FirebaseFirestore.DocumentSnapshot) => {
    // * Just to be safe
    if (snapshot.data()['options'][0]['imageUrl'] === undefined) { console.log("snapshot.data()['options'][0]['imageUrl'] is undefined"); return null }
    if (snapshot.data()['options'][1]['imageUrl'] === undefined) { console.log("snapshot.data()['options'][1]['imageUrl'] is undefined"); return null }

    // * Get URLs of the images from the contest
    const firstImageURL = snapshot.data()['options'][0]['imageUrl']
    const secondImageURL = snapshot.data()['options'][1]['imageUrl']

    // * Creates a client
    const client = new vision.ImageAnnotatorClient();

    // * Performs label detection on the image urls
    const [firstResult] = await client.labelDetection(firstImageURL);
    const [secondResult] = await client.labelDetection(secondImageURL);
    const firstLabels = firstResult.labelAnnotations;
    const secondLabels = secondResult.labelAnnotations;

    // * Just to be safe (again)
    if (firstLabels.length === 0) { return null }
    if (secondLabels.length === 0) { return null }

    // * Make sure the classified image have a clothing type keyword
    const validKeywords = ['garment', 'jacket', 'skirt', 'breeches', 'trouser', 'pants', 'clothing', 'fabric', 'dress', 'shorts', 'footwear', 'outfit', 'revers', 'polo', 'shirt', 'sleeve', 'T-shirt', 'waistcoat', 'cardigan', 'jacket', 'sweater', 'vest', 'pocket', 'flannel', 'tartan', 'lumberjack', 'coat', 'overgarment', 'outerwear', 'top']

    let isFirstImageValid = false
    let isSecondImageValid = false

    firstLabels.forEach(label => {
        if (isFirstImageValid) { return }
        validKeywords.forEach(validKey => {
            if (label.description.toLowerCase().includes(validKey.toLowerCase())) {
                isFirstImageValid = true
                return
            }
        })
    })

    secondLabels.forEach(label => {
        if (isSecondImageValid) { return }
        validKeywords.forEach(validKey => {
            if (label.description.toLowerCase().includes(validKey.toLowerCase())) {
                isSecondImageValid = true
                return
            }
        })
    })

    if (isFirstImageValid && isSecondImageValid) {
        return true
    }
    else {
        return false
    }

    // return new Promise((resolve, reject) => {
    // const firstImageURL = snapshot.data()['options'][0]['imageUrl']
    // const secondImageURL = snapshot.data()['options'][1]['imageUrl']

    // const firstClassifyParams = {
    //     url: firstImageURL,
    // };

    // const secondClassifyParams = {
    //     url: secondImageURL,
    // };

    // /* Make sure the classified image have a clothing type keyword */
    // const validKeywords = ['garment', 'jacket', 'skirt', 'breeches', 'trouser', 'pants', 'clothing', 'fabric', 'dress', 'shorts', 'footwear', 'outfit', 'revers', 'polo', 'shirt', 'sleeve', 'T-shirt', 'waistcoat', 'cardigan', 'jacket', 'sweater', 'vest', 'pocket', 'flannel', 'tartan', 'lumberjack', 'coat', 'overgarment', 'shoes']

    //     let isValidOne = false
    //     let isValidTwo = false

    //     visualRecognition.classify(firstClassifyParams).then(firstResponse => {
    //         visualRecognition.classify(secondClassifyParams).then(secondResponse => {
    //             const firstClassifiedImages = firstResponse.result;
    //             const secondClassifiedImages = secondResponse.result;

    //             if (firstClassifiedImages['images'].length === 0 || secondClassifiedImages['images'].length === 0) { resolve(false) }
    //             if (firstClassifiedImages['images'][0]['classifiers'][0].length === 0 || secondClassifiedImages['images'][0]['classifiers'][0].length === 0) { resolve(false) }
    //             if (firstClassifiedImages['images'][0]['classifiers'][0]['classes'].length === 0 || secondClassifiedImages['images'][0]['classifiers'][0]['classes'].length === 0) { resolve(false) }

    //             const allClassesFirst = firstClassifiedImages['images'][0]['classifiers'][0]['classes'].map(detectedClass => {
    //                 return detectedClass['class']
    //             })

    //             const allClassesSecond = secondClassifiedImages['images'][0]['classifiers'][0]['classes'].map(detectedClass => {
    //                 return detectedClass['class']
    //             })

    //             allClassesFirst.forEach(detectedClass => {
    //                 if (isValidOne) { return }
    //                 validKeywords.forEach(validKey => {
    //                     if (detectedClass.toLowerCase().includes(validKey.toLowerCase())) {
    //                         isValidOne = true
    //                     }
    //                 })
    //             })

    //             allClassesSecond.forEach(detectedClass => {
    //                 if (isValidTwo) { return }
    //                 validKeywords.forEach(validKey => {
    //                     if (detectedClass.toLowerCase().includes(validKey.toLowerCase())) {
    //                         isValidTwo = true
    //                     }
    //                 })
    //             })

    //             if (isValidOne && isValidTwo) {
    //                 resolve(true)
    //             }
    //             else {
    //                 resolve(false)
    //             }
    //         }).catch(err => {
    //             console.log('error:', err);
    //             reject(err)
    //         });
    //     }).catch(err => {
    //         console.log('error:', err);
    //         reject(err)
    //     });
    // })

}