const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config.js");

const REGION = config.AWS_REGION;
const BUCKET = config.AWS_BUCKET_NAME;

const s3Client = new S3Client({ 
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
});

function getPublicUrl(key) {
    const regionPart = REGION ? `.${REGION}` : "";
    return `https://${BUCKET}.s3${regionPart}.amazonaws.com/${key}`;
}

async function uploadBufferToS3(buffer, contentType, keyPrefix = "uploads/") {
    if (!BUCKET) {
        throw new Error("AWS_S3_BUCKET not set");
    }
    const extension = contentType && contentType.includes("/") ? contentType.split("/")[1] : "bin";
    const key = `${keyPrefix}${uuidv4()}.${extension}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType || "application/octet-stream",
        ACL: "public-read",
    });
    await s3Client.send(command);
    return { key, url: getPublicUrl(key) };
}

async function deleteImageFromS3(key) {
  try { 
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error(`Failed to delete from S3: ${error.message}`);
  }
}

module.exports = { uploadBufferToS3, deleteImageFromS3 };


