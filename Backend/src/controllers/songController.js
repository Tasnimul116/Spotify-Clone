import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;

    // Ensure files are available
    if (!req.files || !req.files.audio || !req.files.image) {
      return res.status(400).json({ success: false, message: "Files are required" });
    }

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // Upload files to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Calculate the duration of the audio
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

    // Prepare song data
    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url, // Match the schema field name
      file: audioUpload.secure_url,
      duration,
    };

    // Create and save the song in the database
    const song = new songModel(songData);
    await song.save();


    res.json({ success: true, message: "Song Added" });
  } catch (error) {
 
    console.error("Error adding song:", error);
    res.status(500).json({ success: false, message: "Failed to add song", error: error.message });
  }
};

const listSong = async (req, res) => {
    try{

        const allSongs = await songModel.find({});
        res.json({success:true, songs:allSongs})

    }catch(error){
        res.json({success:false});
    }
};


const removeSong = async (req,res)=>{
    try{

        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Song removed"})
    }catch(error){
        res.json({success:false, message:error.message})
    }
}

export { addSong, listSong, removeSong };
