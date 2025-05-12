const prisma = require('../utils/db');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
