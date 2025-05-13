const auth = (req, res, next) => {
    const password = req.header('x-auth-password');
    
    // Set a simple password - in production, use environment variables
    const SITE_PASSWORD = 'boobs';
    
    if (!password || password !== SITE_PASSWORD) {
      return res.status(401).json({ message: 'Access denied. Invalid password.' });
    }
    
    next();
  };
  
  module.exports = auth;