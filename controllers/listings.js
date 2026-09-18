const Listing=require("../models/listing");
  
// Index Route
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
};

//New Route
module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author",
      },
    })
   .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

// Create Route
module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    // Delete any existing image key from req.body.listing to avoid type conflict
    delete req.body.listing.image;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; // object assign karo
    await newListing.save();

    req.flash("success", "New listing Created!");
    res.redirect("/listings");
};


//Edit Route
module.exports.renderEditForm=async(req,res)=>{
   let{id}=req.params;
   const listing= await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing You Requested for does not exist!");
    res.redirect("/listings");
   }
   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
   res.render("listings/edit.ejs",{listing,originalImageUrl});
};

//Update Route
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url, filename};
      await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};