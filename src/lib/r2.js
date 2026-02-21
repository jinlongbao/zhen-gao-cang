import { writeAsyncIterableToWritable } from "@remix-run/node";
import { createWriteStream } from "fs";
import { v4 as uuidv4 } from "uuid"; // We'll have to polyfill or replace this.

/**
 * MOCKS uploading a stream to R2 by writing it to a local tmp file.
 * In a real app, this would use the AWS S3 SDK to put an object in R2.
 * @param {AsyncIterable<Uint8Array>} data
 * @param {string} contentType
 * @returns {Promise<string>} The path/key of the uploaded file.
 */
export async function uploadStreamToR2(data, contentType) {
    // A real implementation would require the R2 binding from context.
    // const key = uuidv4();
    const key = `mock-${Date.now()}`;
    const localPath = `tmp/${key}`;

    const stream = createWriteStream(localPath);
    await writeAsyncIterableToWritable(data, stream);

    console.log(`Mock R2 Upload: File written to ${localPath} with type ${contentType}`);

    // In a real R2 upload, the key would be returned.
    return key;
}

/**
 * MOCKS downloading a file from R2 by reading it from the local tmp file.
 * In a real app, this would use the AWS S3 SDK to get an object from R2.
 * @param {string} key The key of the file to download.
 * @returns {Promise<Buffer>} The buffer of the file.
 */
export async function downloadFileFromR2(key) {
    const localPath = `tmp/${key}`;
    console.log(`Mock R2 Download: Reading file from ${localPath}`);
    // In a real app, you'd get a stream from R2 and convert it to a buffer.
    const fs = require('fs').promises;
    try {
        const fileBuffer = await fs.readFile(localPath);
        return fileBuffer;
    } catch (error) {
        console.error(`Error reading mock file ${localPath}:`, error);
        // In a real app, you would handle this error based on S3 SDK's response
        if (error.code === 'ENOENT') {
            return null; // Or throw a specific "not found" error
        }
        throw error;
    }
}
