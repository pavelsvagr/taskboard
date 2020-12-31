const axios = require("axios")
const aws = require("aws-sdk")
const { PassThrough } = require("stream")
const keys = require("../../config/keys")

aws.config.region = "eu-central-1"

/**
 * Uploads file to AWS S3
 * @param {Response} fileResponse
 * @param {string} fileName
 * @return {{passThrough: module:stream.internal.PassThrough, promise: Promise<ManagedUpload.SendData>}}
 * */
const uploadFromStream = (fileResponse, fileName) => {
  const s3 = new aws.S3({
    accessKeyId: keys.awsKeyId,
    secretAccessKey: keys.awsKeySecret
  })
  const passThrough = new PassThrough()
  const promise = s3
    .upload({
      Bucket: keys.awsBucketName,
      Key: fileName,
      Expires: 60,
      ContentType: fileResponse.headers["content-type"],
      ContentLength: fileResponse.headers["content-length"],
      Body: passThrough,
      ACL: "public-read"
    })
    .promise()
  return { passThrough, promise }
}

/**
 * Downloads file from given url
 * @param {string} downloadUrl
 * @return {Promise<Response<any>>}
 */
const downloadFile = async (downloadUrl) => {
  return axios.get(downloadUrl, { responseType: "stream" })
}
exports.downloadFile = downloadFile

/**
 * Downloads image from given url and save it to S3
 * @param url
 * @param fileName
 * @return {Promise<string>}
 */
exports.downloadImage = async (url, fileName) => {
  const s3 = new aws.S3()
  await s3.deleteObject({  Bucket: keys.awsBucketName, Key: fileName })

  const responseStream = await downloadFile(url)

  const { passThrough, promise } = uploadFromStream(responseStream, fileName)
  responseStream.data.pipe(passThrough)

  return promise
    .then((result) => {
      return result.Location
    })
    .catch((e) => {
      throw e
    })
}

