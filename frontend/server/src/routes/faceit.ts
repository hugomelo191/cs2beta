import { Router } from 'express';
import { faceitService } from '../services/faceitService.js';

const router = Router();

/**
 * @desc    Test Faceit API connection
 * @route   GET /api/faceit/test/:nickname
 * @access  Public (for testing)
 */
router.get('/test/:nickname', async (req, res) => {
  try {
    const { nickname } = req.params;
    
    console.log(`🎯 Testing Faceit API for: ${nickname}`);
    
    const playerData = await faceitService.getCompletePlayerData(nickname);
    
    if (!playerData) {
      return res.status(404).json({
        success: false,
        message: 'Player not found on Faceit',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Faceit data retrieved successfully',
      data: {
        basic: {
          faceit_id: playerData.faceit_id,
          faceit_nickname: playerData.faceit_nickname,
          country: playerData.country,
          faceit_elo: playerData.faceit_elo,
          faceit_level: playerData.faceit_level,
          steam_id: playerData.steam_id,
        },
        stats: playerData.stats,
        urls: {
          faceit_url: playerData.faceit_url,
          steam_url: playerData.steam_url,
          avatar: playerData.avatar,
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Faceit API test error:', error.message);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error testing Faceit API',
      data: null
    });
  }
});

/**
 * @desc    Validate if nickname exists on Faceit
 * @route   GET /api/faceit/validate/:nickname
 * @access  Public
 */
router.get('/validate/:nickname', async (req, res) => {
  try {
    const { nickname } = req.params;
    
    const isValid = await faceitService.validateNickname(nickname);
    
    res.json({
      success: true,
      message: isValid ? 'Nickname exists on Faceit' : 'Nickname not found on Faceit',
      data: {
        nickname,
        exists: isValid
      }
    });

  } catch (error: any) {
    console.error('❌ Faceit validation error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error validating Faceit nickname',
      data: null
    });
  }
});

/**
 * @desc    Get API status and limits
 * @route   GET /api/faceit/status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const apiKey = process.env['FACEIT_API_KEY'];
    
    res.json({
      success: true,
      message: 'Faceit API status',
      data: {
        api_configured: !!apiKey,
        api_key_length: apiKey ? apiKey.length : 0,
        service_available: true,
        endpoints: {
          test: '/api/faceit/test/:nickname',
          validate: '/api/faceit/validate/:nickname',
          status: '/api/faceit/status'
        },
        limits: {
          free_tier: '10,000 requests/month',
          rate_limit: '~100 requests/minute'
        }
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error getting Faceit API status',
      data: null
    });
  }
});

export default router; 