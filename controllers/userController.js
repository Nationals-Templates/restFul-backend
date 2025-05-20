const prisma = require('../utils/db');

const safeUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  password: false,
  role: false
};




// Helper to check authentication
const ensureAuthenticated = (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: please log in' });
    return false;
  }
  return true;
};




exports.getAllUsers = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return;

  try {
    const users = await prisma.user.findMany({
      where: {
        role: { not: 'admin' } // Exclude admin users
      },
      select: safeUserFields,
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};



exports.getUserById = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return;

  const { id } = req.params;
  const requestingUserId = req.user.id;
  const requestingUserRole = req.user.role;

  try {
    if (parseInt(id) !== requestingUserId && requestingUserRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: requestingUserRole === 'admin' 
        ? { ...safeUserFields, role: true }
        : safeUserFields
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ 
      error: 'Error fetching user',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};



exports.updateUser = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return;

  const { id } = req.params;
  const requestingUserId = req.user.id;
  const requestingUserRole = req.user.role;
  const updateData = req.body;

  try {
    if (parseInt(id) !== requestingUserId && requestingUserRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized update attempt' });
    }

    if (updateData.role && requestingUserRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: safeUserFields
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ 
      error: 'Error updating user',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};



exports.deleteUser = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return;

  const { id } = req.params;

  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ 
      where: { id: parseInt(id) }
    });
    
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ 
      error: 'Error deleting user',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};


exports.getCurrentUser = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: safeUserFields
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      error: 'Error fetching current user',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
// module.exports = {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getCurrentUser
// };