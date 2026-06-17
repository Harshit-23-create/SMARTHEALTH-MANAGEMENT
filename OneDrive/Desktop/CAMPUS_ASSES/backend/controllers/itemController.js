import Item from '../models/Item.js';
import Match from '../models/Match.js';
import axios from 'axios';

// @desc    Get all items (with filters)
// @route   GET /api/items
// @access  Public (or Private depending on rules)
export const getItems = async (req, res) => {
  try {
    const { type, status, collegeId } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (collegeId) query.collegeId = collegeId;

    const items = await Item.find(query)
      .populate('reporterId', 'name email avatar')
      .sort({ createdAt: -1 });
      
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new item (Lost or Found)
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    // Basic body params
    const { 
      type, name, category, description, location, date, 
      reward, tags, storageLocation, securityNotes, images 
    } = req.body;

    // Use req.user (from protect middleware)
    const reporterId = req.user._id;
    const collegeId = req.user.collegeId;

    if (!collegeId) {
      return res.status(400).json({ message: "User is not associated with a college." });
    }

    const item = await Item.create({
      type,
      name,
      category,
      description,
      location,
      date,
      reward,
      tags,
      storageLocation,
      securityNotes,
      images: images || [], // Base64 strings from frontend
      reporterId,
      collegeId
    });

    // --- AI MATCHING INTEGRATION ---
    // We run the AI matching asynchronously so it doesn't block the API response.
    if (images && images.length > 0) {
      (async () => {
        try {
          const oppositeType = type === 'LOST' ? 'FOUND' : 'LOST';
          const targetItems = await Item.find({ 
            collegeId, 
            type: oppositeType, 
            status: 'ACTIVE',
            images: { $exists: true, $not: { $size: 0 } }
          });

          if (targetItems.length > 0) {
            const targetUrls = targetItems.map(t => t.images[0]);
            
            // Call Python AI Microservice
            const aiResponse = await axios.post('http://127.0.0.1:8000/api/match', {
              source_image_url: images[0],
              target_image_urls: targetUrls
            });

            const aiMatches = aiResponse.data.matches || [];
            
            // Save matches to MongoDB
            for (const matchResult of aiMatches) {
              if (matchResult.similarity > 60) { // Threshold
                const matchedItem = targetItems.find(t => t.images[0] === matchResult.url);
                if (matchedItem) {
                  await Match.create({
                    lostItemId: type === 'LOST' ? item._id : matchedItem._id,
                    foundItemId: type === 'FOUND' ? item._id : matchedItem._id,
                    confidenceScore: matchResult.similarity,
                    collegeId
                  });
                }
              }
            }
          }
        } catch (aiError) {
          console.error("AI Matching Error:", aiError.message);
        }
      })();
    }
    // -------------------------------
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reporterId', 'name email avatar');

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
