import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "dch-yt-raw-videos"
const processedVideoBucketName = "dch-yt-processed-videos"

const localRawVideoPath = "./raw-videos"
const localProcessedVideoPath = "./processed-videos"


export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
          .outputOptions("-vf", "scale=-1:360") // 360p
          .on("end", function () {
            console.log("Processing finished successfully");
            resolve();
          })
          .on("error", function (err: any) {
            console.log("An error occurred: " + err.message);
            reject(err);
          })
          .save(`${localProcessedVideoPath}/${processedVideoName}`);
      });
}

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
    );
}

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });

    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`
    );

    await bucket.file(fileName).makePublic();    
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}   

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file ${filePath}`, err);                    
                    reject(err);
                } else {
                    console.log(`File deleted: ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File ${filePath} does not exist`);
            resolve();
        }
    })
}

function ensureDirectoryExists(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, {recursive: true});
        console.log(`Directory created: ${directoryPath}`);
    }
}
