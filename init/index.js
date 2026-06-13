const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wunderlust'
main().then(() => {
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);

  
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj , owner:'6a2b329ff61c6ea3824b016b'})); //assinging owner to every listing
    await Listing.insertMany(initData.data);
    console.log("data was inisialized");
};
initDB();