import express from "express";
const router = express.Router();
import AWS from "aws-sdk"

const s3 = new AWS.S3({
    region:process.env.AWS_REGION,
    accessKeyId:process.env.ACCESS_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    signatureVersion:'v4'
});

router.get('/get-presigned-url',async(req,res)=>{
    const {fileName,filetype} = req.query;
    const params = {
        bucket:process.env.BUCKET_NAME,
        key:fileName,
        Expires:120,
        ContentType:filetype
    }
    const uploadUrl = await s3.getSignedUrlPromise('putobject',params);
    res.send({uploadUrl,fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`})
})

export default router