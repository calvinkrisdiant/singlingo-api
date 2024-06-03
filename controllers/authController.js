const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nanoid;
import('nanoid').then((module) => {
  nanoid = module.nanoid;
});

// Register
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validasi agar semua bidang harus diisi
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Semua bidang harus diisi' });
    }

    // Validasi panjang nama pengguna dan kata sandi
    if (fullName.length < 8 || password.length < 8) {
      return res.status(400).json({ message: 'Panjang nama pengguna dan kata sandi harus setidaknya 8 karakter' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const id = nanoid(10); // Generate a unique ID with length 10
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ id, fullName, email, password: hashedPassword });

    // Mengonversi pesan ke format yang diinginkan
    const response = {
      status: 'Sukses',
      message: 'Member baru berhasil ditambahkan.',
      data: {
        userId: newUser.id
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi agar semua bidang harus diisi
    if (!email || !password) {
      return res.status(400).json({ message: 'Semua bidang harus diisi' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      // Penanganan kesalahan jika email atau password salah
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      const { fullName, email, password } = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validasi agar semua bidang yang diperlukan diisi
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Semua bidang harus diisi' });
      }

      user.fullName = fullName;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);
      
      await user.save();
      res.json({ message: 'User updated successfully', user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all users
exports.getUsers = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const users = await User.findAll();
      res.json(users);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Logout User
exports.logoutUser = async (req, res) => {
  try {
    // Hapus cookie JWT dengan mengatur maxAge menjadi 0
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
    
    // Berikan pesan balasan
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mengirim respons dengan data pengguna
    res.json({ message: 'User found', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

