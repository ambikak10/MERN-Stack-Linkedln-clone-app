const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true); // to avoid deprecation warning
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log('MongoDB connected...')
  } catch(err){
    console.error(err.message);
    process.exit(1); //Exit process with failure
  }
}
module.exports = connectDB;