const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
 
   const { 
   company,
   location,
   website,
   bio,
   skills,
   status,
   githubusername,
   youtube,
   twitter,
   instagram,
   linkedin,
   facebook
} = req.body;
  

// Build profile object 
const profileFields = {};
profileFields.user = req.user.id;
if(company) profileFields.company = company;
if (location) profileFields.location = location;
if (website) profileFields.website = website;
if (bio) profileFields.bio = bio;
if (status) profileFields.status = status;
if (githubusername) profileFields.githubusername = githubusername;
if (skills) {
  profileFields.skills = skills.split(',').map(skill => skill.trim());
}

 profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;


// Update Profile 
try {
  let profile = await Profile.findOne({ user: req.user.id});
  if (profile) {
    let profile = await Profile.findOneAndUpdate(
    { user: req.user.id }, 
    { $set: profileFields }, 
    { new: true }
    );
    return res.json(profile);
  }
// Create profile
  profile = new Profile(profileFields);
  await profile.save();
   return res.json(profile);

} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
}

});

module.exports = router;
