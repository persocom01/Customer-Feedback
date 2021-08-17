function uploadS3(filePath, file, isImage=false) {
    var bucketName = "inp-dil-ap-southeast-1";
    var bucketRegion = 'ap-southeast-1';
    var IdentityPoolId = s3IdentityPoolId; // From credentials.js
    if (isImage) {
        var u = file.split(',')[1],
            binary = atob(u),
            array = [];

        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }

        var typedArray = new Uint8Array(array);
        // var file = AWS.util.base64.decode(file)
        // buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""),'base64')
    }
    AWS.config.update({
                region: bucketRegion,
                credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
                })
            });

    var s3 = new AWS.S3({
        params: {Bucket: bucketName}
    });

    s3.putObject({
        Key: filePath,
        // ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        Body: typedArray
    }, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Successfully Uploaded!');
        }
    });
}