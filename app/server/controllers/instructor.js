import User from '../models/user';
import queryString from 'query-string';
import Course from '../models/course';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
    
    try {
        // 1. find user from db
        const user = await User.findById(req.user._id).exec();


        // 2. if user don't have sripe_account_id yet then create new
        if(!user.stripe_account_id) {
            const account = await stripe.accounts.create({ type: 'express' });
            // console.log('ACCOUNT => ', account.id);
            user.stripe_account_id = account.id;
            user.save();
        }


        // 3. create account link based on account id used for front-end to complete onboarding


        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: 'account_onboarding',
        });


        // console.log(accountLink);

        // 4. pre-fill any info such as email(optional), then send url response to front-end
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email,
        });

        // 5. then send the account link as response to frontend
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    } catch(err) {
            console.log(err);
            if(err.raw && err.raw.statusCode && err.raw.statusCode == 400) {
                return res.status(403).send(err.raw.message);
            }
            return res.status(400).send('Network Error. Please Try again.');
    };
};




export const getAccountStatus = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const account = await stripe.accounts.retrieve(user.stripe_account_id);
        // console.log('ACCOUNT => ', account);

        if(!account.charges_enabled) {
            return res.status(401).send('Unauthorized Stripe User Account');
        } else {
            const statusUpdated = await User.findByIdAndUpdate(user._id, {
                    stripe_seller: account,
                    $addToSet: {role: "Instructor"},
                },
                { new: true }
            ).select('-password').exec();
            res.json(statusUpdated)
        }
    } catch(err) {
        console.log(err);
    }
};


export const currentInstructor = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('-password').exec();
        if( user == null || !user.role.includes('Instructor')) {
            return res.sendStatus(403);
        } else {
            res.json({ok: true});
        }
    } catch(err) {
        console.log(err);
    }
};

export const instructorCourses = async (req, res) => {
    try {

        const courses = await Course.find({
            instructor: req.user._id
        }).sort({createdAt: -1}).exec();

        res.json(courses);

    } catch(err) {
        console.log(err);
    }
};


export const studentCount = async (req, res) => {
    try {
        const users = await User.find({courses: req.body.courseId}).select('_id').exec();

        res.json(users);

    } catch(err) {
        console.log(err)
    }
};


export const instructorBalance = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).exec();
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id
        });
        res.json(balance)
    } catch(err) {
        console.log(err);
    }
};

export const instructorPayoutSettings = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).exec();
        const loginLink = await stripe.accounts.createLoginLink(user.stripe_seller.id, 
            {redirect_url: process.env.STRIPE_SETTINGS_REDIRECT} 
        );

        res.json(loginLink.url);

    } catch(err) {
        console.log('stripe payout settings login link err => ', err);
        console.log(err);
    }
}