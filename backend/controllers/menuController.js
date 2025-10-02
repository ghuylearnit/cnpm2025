// controllers/menuController.js
const mongoose = require('mongoose');

const Menu = require('../models/menu');              // kiểu 1-nhà-hàng-1-doc (nếu có)
const MenuItem = require('../models/menuItem');      // mỗi món là 1 doc trong 'menus'
const Restaurant = require('../models/restaurant');

const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../middlewares/catchAsyncErrors');

/**
 * GET /api/menus?storeId=<restaurantId>
 * Trả về danh sách document Menu (nếu bạn đang dùng cấu trúc 1-nhà-hàng-1-menu)
 * Response: { status, count, data: [ MenuDoc... ] }
 */
exports.getAllMenus = catchAsync(async (req, res) => {
  let filter;
  if (req.params?.storeId || req.query?.storeId) {
    const storeId = req.params.storeId || req.query.storeId;
    filter = { restaurant: storeId };
  }

  const menus = await Menu.find(filter)
    .populate({ path: 'menu.items', model: 'MenuItem' })
    .exec();

  res.status(200).json({
    status: 'success',
    count: menus.length,
    data: menus,
  });
});

/**
 * POST /api/menus
 * Body: { restaurant, menu: [ { category, items:[MenuItemId] }, ... ] }
 */
exports.createMenu = catchAsync(async (req, res) => {
  const created = await Menu.create(req.body);
  res.status(201).json({
    status: 'success',
    data: created,
  });
});

/**
 * DELETE /api/menus/:menuId
 */
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const doc = await Menu.findByIdAndDelete(req.params.menuId);
  if (!doc) return next(new ErrorHandler('No document found with that ID', 404));
  res.status(204).json({ status: 'success' });
});

/**
 * ⭐ GET /api/stores/:id/menus
 * - TH1: Nếu đã có document Menu cho nhà hàng -> populate và trả { restaurant, menu }
 * - TH2: Nếu chưa có Menu, đọc từng món từ collection 'menus' (MenuItem) và group theo category
 */
exports.getMenusByRestaurant = catchAsync(async (req, res) => {
  const { id } = req.params; // restaurantId

  const restaurant = await Restaurant.findById(id).lean();
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  // TH1: Có sẵn document Menu (kiểu 1-nhà-hàng-1-doc)
  let menuDoc = await Menu.findOne({ restaurant: id })
    .populate({ path: 'menu.items', model: 'MenuItem' })
    .lean();

  if (menuDoc && Array.isArray(menuDoc.menu)) {
    return res.json({ restaurant, menu: menuDoc.menu });
  }

  // TH2: Đọc trực tiếp từ collection 'menus' qua model MenuItem và group theo category
  const menu = await MenuItem.aggregate([
    { $match: { restaurant: new mongoose.Types.ObjectId(id) } },
    {
      $group: {
        _id: '$category',
        items: {
          $push: {
            _id: '$_id',
            name: '$name',
            price: '$price',
            description: '$description',
            isVeg: '$isVeg',
            images: '$images',
            ratings: '$ratings',
            numOfReviews: '$numOfReviews',
          }
        }
      }
    },
    { $project: { _id: 0, category: '$_id', items: 1 } },
    { $sort: { category: 1 } }
  ]);

  return res.json({ restaurant, menu: menu || [] });
});
