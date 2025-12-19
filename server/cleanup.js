const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./models/Listing');

dotenv.config();

const cleanUp = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Find listings that are 'Sold' or 'In Transit' or 'Delivered' but have no deliveryAddress
        const query = {
            status: { $in: ['Sold', 'In Transit', 'Delivered'] },
            $or: [
                { deliveryAddress: { $exists: false } },
                { deliveryAddress: null },
                { deliveryAddress: '' }
            ]
        };

        const count = await Listing.countDocuments(query);
        console.log(`Found ${count} invalid listings.`);

        if (count > 0) {
            const res = await Listing.deleteMany(query);
            console.log(`Deleted ${res.deletedCount} listings.`);
        } else {
            console.log('No listings to delete.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanUp();
