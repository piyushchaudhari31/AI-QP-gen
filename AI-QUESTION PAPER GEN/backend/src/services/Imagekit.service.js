const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLICKEY,
    privateKey : process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint : process.env.IMAGEKIT_ENDURLPOINT
});

async function uploadImage(file,fileName){
    const response = await imagekit.upload({
        file:file,
        fileName:fileName,
        folder:"QP-Generate"
    })

    return response
}

module.exports = uploadImage