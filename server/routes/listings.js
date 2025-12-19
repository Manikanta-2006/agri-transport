const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const listingController = require('../controllers/listingController');

// Middleware to verify token (we need to create this or extract it if not separated yet)
// Since we used inline auth logic in authController, we should extract the middleware.
// For now, I'll create a simple middleware file to use here.

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
router.post('/', auth, listingController.createListing);

// @route   GET api/listings/agent-jobs
// @desc    Get jobs for agent
// @access  Private
router.get('/agent-jobs', auth, listingController.getAgentJobs);

// @route   PUT api/listings/accept/:id
// @desc    Agent accepts delivery
// @access  Private
router.put('/accept/:id', auth, listingController.acceptDelivery);

// @route   PUT api/listings/confirm/:id
// @desc    Buyer confirms delivery
// @access  Private
router.put('/confirm/:id', auth, listingController.confirmDelivery);

// @route   GET api/listings/available
// @desc    Get all available listings (for buyers)
// @access  Private
router.get('/available', auth, listingController.getAvailableListings);

// @route   GET api/listings/my-orders
// @desc    Get buyer orders
// @access  Private
router.get('/my-orders', auth, listingController.getBuyerOrders);

// @route   POST api/listings/purchase/:id
// @desc    Purchase a listing
// @access  Private
router.post('/purchase/:id', auth, listingController.purchaseListing);

// @route   GET api/listings
// @desc    Get all listings for user
// @access  Private
router.get('/', auth, listingController.getListings);

// @route   POST api/listings/purchase-cart
// @desc    Purchase cart items
// @access  Private
router.post('/purchase-cart', auth, listingController.purchaseCart);

module.exports = router;
