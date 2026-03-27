const Provider = require('../models/Provider');

exports.getAllProviders = async (req, res, next) => {
  try {
    const { category, city, minRate, maxRate, minRating, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.serviceCategory = category;
    if (city)     query['address.city'] = new RegExp(city, 'i');
    if (search)   query.name            = new RegExp(search, 'i');
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    if (minRating) query['rating.average'] = { $gte: Number(minRating) };

    const total     = await Provider.countDocuments(query);
    const providers = await Provider.find(query).select('-password')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), providers });
  } catch (err) { next(err); }
};

exports.getProviderById = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id).select('-password');
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });
    res.json({ success: true, provider });
  } catch (err) { next(err); }
};
