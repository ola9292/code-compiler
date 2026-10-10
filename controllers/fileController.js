import File from "../db/models/File.js"
import bcrypt from 'bcryptjs';

export async function index(req, res)
{
  try{

    return res.render('index')
  }catch(err){
    console.log(err)
  }
}
export async function upload(req, res)
{
  if(!req.file){
    return res.status(401).json({msg: "Please upload a file"})
  }
  if(!req.body.password){
    return res.status(401).json({msg: "Please enter a password"})
  }
  const maxSize = 10 * 1024 * 1024; 
  if (req.file.size > maxSize) {
    // fs.unlinkSync(req.file.path); 
    return res.status(401).json({ msg: "File size too large" });
  }
  const password = req.body.password
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAvatar = new File({
        filename: req.file.filename,
        path:req.file.path,
        originalname: req.file.originalname,
        password:hashedPassword
    })
    const savedAvatar = await newAvatar.save()
    const downloadUrl = `${req.protocol}://${req.get('host')}/download/${savedAvatar._id}`
    return res.json({msg: "upload successful", data: downloadUrl})
  }catch(err){
    console.log(err)
  }
}

export function showDownload(req, res){
    const data = req.params.id
    res.render('download', {data})
}

export async function download(req, res){
    const { downloadid, password } = req.body
    try{
        const fileToDownload = await File.findById(downloadid);
         if(!fileToDownload){
            return res.status(401).json({msg: "File not found"})
        }

        const isPasswordValid = await bcrypt.compare(password, fileToDownload.password);

        if(!isPasswordValid){
            return res.status(401).json({msg: "Wrong password"})
        }

        return res.download(fileToDownload.path, fileToDownload.originalname, (err) => {
                if (err) {
                    console.error(err);
                    if (!res.headersSent) {
                        res.status(500).json({ msg: "Error downloading file" });
                    }
                }
            });
    }catch(err){
        console.log(err)
    }
}