
import { getSession } from '../../../lib/session.js';
import { findUser, addPattern } from '../../../lib/db.js';
import { uploadStreamToR2 } from '../../../lib/r2.js';
import { parse } from 'querystring';


// A mock for handling multipart/form-data
// In a real app, you'd use a library like multer or formidable
async function parseMultipartFormData(req) {
    return new Promise((resolve) => {
        const boundary = req.headers['content-type'].split('boundary=')[1];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parts = body.split(`--${boundary}`);
            const result = { fields: {}, files: {} };
            for (const part of parts) {
                if (part.includes('Content-Disposition: form-data; name=')) {
                    const nameMatch = /name="([^"]+)"/.exec(part);
                    if (nameMatch) {
                        const name = nameMatch[1];
                        if (part.includes('filename=')) {
                            const filenameMatch = /filename="([^"]+)"/.exec(part);
                            const contentTypeMatch = /Content-Type: ([^
]+)/.exec(part);
                            const fileContent = part.substring(part.indexOf('\r\n\r\n') + 8, part.lastIndexOf('\r\n--'));
                            result.files[name] = {
                                filename: filenameMatch[1],
                                contentType: contentTypeMatch[1],
                                data: Buffer.from(fileContent)
                            };
                        } else {
                            const value = part.substring(part.indexOf('\r\n\r\n') + 4, part.lastIndexOf('\r\n')).trim();
                            result.fields[name] = value;
                        }
                    }
                }
            }
            resolve(result);
        });
    });
}


export default async function upload(req, res) {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = getSession(sessionId);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = findUser(session.email);
    if (!user || user.role !== 'creator') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // In a real application, you would use a robust multipart/form-data parsing library
        // like multer, formidable, or busboy. For this example, we'll use a mock parser.
        const { fields, files } = await parseMultipartFormData(req);
        const { title, price } = fields;
        const file = files.pattern; // 'pattern' is the field name for the file upload

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // The 'file.data' is a Buffer with the file content.
        // We need to convert it to a stream for uploadStreamToR2.
        const { Readable } = require('stream');
        const stream = Readable.from(file.data);

        const filePath = await uploadStreamToR2(stream, file.contentType);

        const patternData = {
            title,
            price: parseFloat(price),
            filePath,
            creatorId: user.id, // Assuming user object has an id
        };

        const newPattern = addPattern(patternData);

        res.status(201).json({ message: 'Pattern uploaded successfully', pattern: newPattern });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
