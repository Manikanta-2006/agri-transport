const Listing = require('../models/Listing');

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
exports.createListing = async (req, res) => {
    const { crop, quantity, destination, price } = req.body;

    try {
        const newListing = new Listing({
            farmer: req.user.id,
            crop,
            quantity,
            crop,
            quantity,
            destination,
            price
        });

        const listing = await newListing.save();
        res.json(listing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/listings
// @desc    Get all listings for the logged-in farmer
// @access  Private
exports.getListings = async (req, res) => {
    try {
        const listings = await Listing.find({ farmer: req.user.id })
            .populate('buyer', 'name')
            .sort({ date: -1 });
        res.json(listings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/listings/available
// @desc    Get all available listings (status: Pending)
// @access  Private
// @route   GET api/listings/agent-jobs
// @desc    Get all jobs for agents (status: Sold - ready for pickup) AND active deliveries
// @access  Private
exports.getAgentJobs = async (req, res) => {
    try {
        // Jobs available to pick up (Sold) OR Jobs assigned to this agent (In Transit)
        const listings = await Listing.find({
            $or: [
                { status: 'Sold' },
                { status: 'In Transit', agent: req.user.id },
                { status: 'Delivered', agent: req.user.id }
            ]
        })
            .populate('farmer', 'name')
            .populate('buyer', 'name')
            .sort({ date: -1 });

        res.json(listings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/listings/accept/:id
// @desc    Agent accepts a delivery
// @access  Private
exports.acceptDelivery = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) return res.status(404).json({ msg: 'Listing not found' });

        if (listing.status !== 'Sold') {
            return res.status(400).json({ msg: 'Job no longer available' });
        }

        listing.agent = req.user.id;
        listing.status = 'In Transit';
        await listing.save();

        res.json(listing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/listings/confirm/:id
// @desc    Buyer confirms receipt
// @access  Private
exports.confirmDelivery = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) return res.status(404).json({ msg: 'Listing not found' });

        // Ensure only the buyer can confirm
        if (listing.buyer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (listing.status !== 'In Transit') {
            return res.status(400).json({ msg: 'Cannot confirm delivery yet' });
        }

        listing.status = 'Delivered';
        await listing.save();

        res.json(listing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/listings/available
// @desc    Get all available listings (status: Pending) - For Buyers
// @access  Private
exports.getAvailableListings = async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'Pending' }).populate('farmer', 'name').sort({ date: -1 });
        res.json(listings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/listings/purchase/:id
// @desc    Purchase a listing
// @access  Private
exports.purchaseListing = async (req, res) => {
    try {
        const { quantity, deliveryAddress } = req.body;
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ msg: 'Listing not found' });
        }

        if (listing.status !== 'Pending') {
            return res.status(400).json({ msg: 'Listing is not available' });
        }

        // Logic for Partial Purchase
        // Helper to parse "500 kg" -> 500 and "kg"
        const availableQty = parseFloat(listing.quantity);
        const unit = listing.quantity.replace(/[0-9.]/g, '').trim();

        const requestedQty = parseFloat(quantity);

        // If no specific quantity requested, or requested >= available, do full purchase
        if (!quantity || isNaN(requestedQty) || requestedQty >= availableQty) {
            listing.buyer = req.user.id;
            listing.status = 'Sold';
            listing.deliveryAddress = deliveryAddress;
            await listing.save();
            return res.json(listing);
        }

        // Partial Purchase: requestedQty < availableQty
        const remainingQty = availableQty - requestedQty;

        // 1. Update original listing (Pending) with remaining quantity
        listing.quantity = `${remainingQty} ${unit}`;
        await listing.save();

        // 2. Create new listing (Sold) for the buyer with requested quantity
        const newSoldListing = new Listing({
            farmer: listing.farmer,
            crop: listing.crop,
            destination: listing.destination,
            quantity: `${requestedQty} ${unit}`,
            quantity: `${requestedQty} ${unit}`,
            status: 'Sold',
            buyer: req.user.id,
            price: listing.price, // Inherit price
            deliveryAddress,
            date: listing.date // Preserve original date or new date? Using new date/default
        });

        await newSoldListing.save();

        res.json(newSoldListing);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/listings/my-orders
// @desc    Get orders for the logged-in buyer
// @access  Private
exports.getBuyerOrders = async (req, res) => {
    try {
        const listings = await Listing.find({ buyer: req.user.id })
            .populate('farmer', 'name')
            .populate('agent', 'name')
            .sort({ date: -1 });
        res.json(listings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/listings/purchase-cart
// @desc    Purchase multiple items (Cart)
// @access  Private
exports.purchaseCart = async (req, res) => {
    try {
        const { items, deliveryDetails } = req.body; // items: [{ _id, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        const purchasedItems = [];
        const errors = [];

        // Process sequentially to avoid race conditions or logic complexity for now
        for (const item of items) {
            try {
                let listing = await Listing.findById(item._id || item.id);

                if (!listing) {
                    errors.push({ id: item._id, msg: 'Listing not found' });
                    continue;
                }

                if (listing.status !== 'Pending') {
                    errors.push({ id: item._id, msg: 'Item no longer available' });
                    continue;
                }

                const availableQty = parseFloat(listing.quantity);
                const unit = listing.quantity.replace(/[0-9.]/g, '').trim();
                const requestedQty = parseFloat(item.quantity);

                // Validation
                if (requestedQty > availableQty) {
                    errors.push({ id: item._id, msg: `Requested quantity ${requestedQty} exceeds available ${availableQty}` });
                    continue;
                }

                // Logic similar to single purchase
                if (requestedQty >= availableQty) {
                    // Full purchase
                    listing.buyer = req.user.id;
                    listing.status = 'Sold';
                    listing.deliveryAddress = `${deliveryDetails.address}, ${deliveryDetails.city} - ${deliveryDetails.pincode} (Ph: ${deliveryDetails.phone})`;
                    // Store extra details if DB schema allows, otherwise put it all in deliveryAddress for MVP
                    await listing.save();
                    purchasedItems.push(listing);
                } else {
                    // Partial purchase
                    const remainingQty = availableQty - requestedQty;

                    // 1. Update original
                    listing.quantity = `${remainingQty} ${unit}`;
                    await listing.save();

                    // 2. Create new Sold listing
                    const newSoldListing = new Listing({
                        farmer: listing.farmer,
                        crop: listing.crop,
                        destination: listing.destination,
                        quantity: `${requestedQty} ${unit}`,
                        status: 'Sold',
                        buyer: req.user.id,
                        price: listing.price,
                        deliveryAddress: `${deliveryDetails.address}, ${deliveryDetails.city} - ${deliveryDetails.pincode} (Ph: ${deliveryDetails.phone})`,
                        date: listing.date
                    });
                    await newSoldListing.save();
                    purchasedItems.push(newSoldListing);
                }

            } catch (err) {
                console.error(`Error processing item ${item._id}:`, err);
                errors.push({ id: item._id, msg: 'Server error processing item' });
            }
        }

        res.json({ success: true, purchased: purchasedItems, errors });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
