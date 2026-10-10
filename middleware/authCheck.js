import jwt from 'jsonwebtoken';
export default function authCheck(req, res, next){
  // 1. Extract the token from the cookies object
    const token = req.cookies.token;

    // 2. If no token exists, redirect unauthenticated users to login
    if (!token) {
        return res.redirect('/login');
    }

    try {
        // 3. Verify the token's signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Optionally attach user payload to request for use in controllers
        req.user = decoded;

        // 5. Token is valid, proceed to the next route handler/controller
        return next();
    } catch (error) {
        // 6. Token is invalid or expired; clear the bad cookie and redirect
        res.clearCookie('token');
        return res.redirect('/login');
    }
}
