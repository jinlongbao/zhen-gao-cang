import { getSession } from '../../../lib/session.js';
import { findUser, findPatternById, userHasPurchasedPattern } from '../../../lib/db.js';
import { downloadFileFromR2 } from '../../../lib/r2.js';
import { addWatermark } from '../../../lib/watermark.js';

export default async function download(req, res) {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = getSession(sessionId);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = findUser(session.email);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { patternId } = req.params; // Assuming the router makes params available here

    const pattern = findPatternById(patternId);

    if (!pattern) {
        return res.status(404).json({ message: 'Pattern not found' });
    }

    // Authorization: Check if the user is allowed to download this pattern.
    const isAuthorized = userHasPurchasedPattern(user.id, pattern.id);
    if (!isAuthorized) {
        return res.status(403).json({ message: 'Forbidden: You have not purchased this pattern.' });
    }

    try {
        // Get the file from our mock R2
        const fileBuffer = await downloadFileFromR2(pattern.filePath);
        if (!fileBuffer) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Add watermark
        const watermarkText = `user:${user.id} email:${user.email}`;
        const watermarkedFileBuffer = await addWatermark(fileBuffer, watermarkText);

        // Send the file to the client
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="pattern-${pattern.id}-watermarked.pdf"`); // Assuming PDF for now
        res.status(200).send(watermarkedFileBuffer);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
