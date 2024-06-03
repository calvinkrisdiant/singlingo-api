const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');

    // Jika tidak ada header Authorization, lanjutkan tanpa otentikasi
    if (!authorizationHeader) {
      return next();
    }

    // Jika header Authorization ada, verifikasi token JWT
    const token = authorizationHeader.replace('Bearer ', '');

    // Verifikasi token dan tangani kesalahan jika token tidak valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Handle token expired error here
          return res.status(401).json({ message: 'Token expired, please log in again' });
        } else {
          // Handle other token verification errors here
          return res.status(401).json({ message: 'Token invalid, please log in again' });
        }
      }

      // Menambahkan informasi pengguna ke objek permintaan
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
