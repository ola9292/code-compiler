export default async function(req, res, next){

    const id = req.params.id;
    const current_user_id = req.user.userId
    try{
        // const note = await Note.findById(id)

        // if(!note){
        //     return res.status(404).json({msg: "note not found"})
        // }

        // if(note.user.toString() === current_user_id){
        //     return next()
        // }
        return res.status(401).json({msg: "you are not authorized"})
    }catch(err){
        console.log(err)
    }

}