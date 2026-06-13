const Listing = require("../model/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req,res) => {
    let allListings = await Listing.find();
    res.render("listing/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
     res.render("listing/new.ejs");
};

module.exports.showListing = async (req,res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
        if(!listing){
            req.flash("error","listing does not exist anymore!");
            return res.redirect("/listings");
        }
      
        res.render("listing/show.ejs",{listing});
 };

 module.exports.createListing = async (req,res,next) =>{
  let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
  // console.log(response.body.features[0].geometry);
  // res.send("done");
 
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,filename);
    const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename};
     newListing.geometry = response.body.features[0].geometry;
     let savedListing = await newListing.save();
     console.log(savedListing);
    req.flash("success","listing created successfully!");
    res.redirect("/listings");
   };

module.exports.editListing = async (req,res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","listing does not exist anymore!");
            return res.redirect("/listings");
        }
        let  originalImageUrl =listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
        res.render("listing/edit.ejs",{listing,originalImageUrl});
 };

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  if (req.file) {
    listing.image.url = req.file.path;
    listing.image.filename = req.file.filename;
    await listing.save();
  }

console.log("Updated listing image:", listing.image);
  req.flash("success", "Listing edited successfully!");
  res.redirect(`/listings/${listing._id}`);
};

 module.exports.deleteListing = async(req,res) => {
     let {id} = req.params;
     let deletedList =  await Listing.findByIdAndDelete(id);
     console.log(deletedList);
      req.flash("success","listing deleted successfully!");
     res.redirect("/listings");
  };