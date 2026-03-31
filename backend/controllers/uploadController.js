const User     = require('../models/User')
const Provider = require('../models/Provider')
const path     = require('path')
const fs       = require('fs')

// @desc  Upload avatar for user or provider
// @route POST /api/upload/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'No file uploaded' })

    const avatarUrl = `/uploads/avatars/${req.file.filename}`
    const Model     = req.user.role === 'user' ? User : Provider

    // Delete old avatar file if exists
    const account = await Model.findById(req.user._id)
    if (account.avatar && account.avatar.startsWith('/uploads')) {
      const oldPath = path.join(__dirname, '..', account.avatar)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const updated = await Model.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    )

    res.json({ success: true, message: 'Avatar updated', avatar: avatarUrl, user: updated })
  } catch (err) {
    next(err)
  }
}
