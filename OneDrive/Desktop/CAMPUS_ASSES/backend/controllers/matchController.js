import Match from '../models/Match.js';

// @desc    Get matches
// @route   GET /api/matches
// @access  Private
export const getMatches = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    // For students, maybe only show their matches. For security, show all.
    // For simplicity, let's just return all matches for the college and let frontend filter if needed.
    const matches = await Match.find({ collegeId })
      .populate('lostItemId')
      .populate('foundItemId')
      .sort({ confidenceScore: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update match status (VERIFIED or REJECTED)
// @route   PUT /api/matches/:id
// @access  Private
export const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);

    if (match) {
      match.status = status;
      await match.save();
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
