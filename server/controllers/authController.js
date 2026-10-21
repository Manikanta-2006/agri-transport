const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: role ? role.toLowerCase() : 'farmer'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret', // Use env variable in production
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { id: user.id, name: user.name, email: user.email, role: user.role }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter both email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Verify role if provided
        if (req.body.role && req.body.role.toLowerCase() !== user.role.toLowerCase()) {
            return res.status(400).json({
                msg: `This account is registered as a ${user.role}. Please log in through the ${user.role} portal.`,
                actualRole: user.role
            });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
