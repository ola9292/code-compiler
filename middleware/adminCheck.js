import User from "../db/models/User.js"
export function adminCheck(req, res, next){
   if(req.user && req.user.is_admin){
    return next()
   }
   let errorMsg = "unauthorized action"
   // return res.json({msg: "unauthorized action"})
   return res.render('error', {errorMsg})
}   