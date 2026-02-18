const express=require('express');
const router=express.Router();
const authorizeRoles=require("../Middlewares/roleMiddleware").default;
const verifyToken=require("../Middlewares/authMiddleware");
const Item = require('../Model/ItemModel');
const User = require('../Model/UserModel');
const Payment = require('../Model/PaymentModel');
const Cart = require('../Model/CartModel'); 


//Add items
router.post('/AddItems',verifyToken,async (req, res) => {
  const {ItemName,ItemPrice,Gender,Material,Subcategory,Url1,Url2,Url3,Url4,Url5} = req.body;
  console.log("Request body is : ", req.body);

  try{
    const newItem = new Item({
      ItemName,
      ItemPrice,
      Gender,
      Material,
      Subcategory,
      Url1,
      Url2,
      Url3,
      Url4,
      Url5
    });

    await newItem.save();
    res.status(201).json({message: 'Item added successfully', 
      item: newItem});
  }catch(err) {
    res.status(500).json({message: 'Error adding item', 
      error: err.message});

      console.error("Error adding item:", err);
  }
})


//get all items 
router.get('/GetAllItems',verifyToken,async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({message: 'Items retrieved successfully', items});
  } catch (err) {
    res.status(500).json({message: 'Error retrieving items', error: err.message});
    console.error("Error retrieving items:", err);
  }
});


//Add price to item
router.post('/AddPayment', verifyToken, async (req, res) => {
  const {userId,userName,ItemId, Price, Material, Quantity, Size } = req.body;
  console.log("Request body is : ", req.body);

  try {
    const newPayment = new Payment({
      userId,
      userName,
      ItemId,
      Price,
      Material,
      Quantity,
      Size
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment added successfully', payment: newPayment });
  } catch (err) {
    res.status(500).json({ message: 'Error adding payment', error: err.message });
    console.error("Error adding payment:", err);
  }
});


//Add item to cart
router.post('/AddToCart', verifyToken, async (req, res) => {
  const { userId, Url1, Name, ItemId, ItemPrice, ItemName } = req.body;
  console.log("Request body is : ", req.body);

  try {
    const newCartItem = new Cart({
      userId,
       Url1,
       Name, 
       ItemId, 
       ItemPrice,
       ItemName
    });

    await newCartItem.save();
    res.status(201).json({ message: 'Item added to cart successfully', cartItem: newCartItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
    console.error("Error adding item to cart:", err);
  }
});





//get all userId related cart items
router.get('/cart/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find all cart items for the given userId
    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: 'No cart items found for this user' });
    }

    res.status(200).json({
      message: 'Cart items retrieved successfully',
      cartItems,
    });
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ message: 'Error retrieving cart items', error: error.message });
  }
});


//Delete item from cart
router.delete('/cart/:ItemId/:userId', verifyToken, async (req, res) => {
  try {
    const ItemId = req.params.ItemId;
    const userId = req.params.userId;

    if (!ItemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find and delete the cart item
    const deletedCartItem = await Cart.findOneAndDelete({ ItemId, userId });

    if (!deletedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({
      status:true,
      message: 'Cart item deleted successfully',
      deletedCartItem,
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'Error deleting cart item', error: error.message });
  }
});


//Edite items
router.put('/EditItem/:id', verifyToken, async (req, res) => {
  const itemId = req.params.id;
  const { ItemName, ItemPrice,Gender,Material,Subcategory} = req.body;

  const updateData= Item.findByIdAndUpdate(itemId, {
    ItemName,
    ItemPrice,
    Gender,
    Material,
    Subcategory
  });

  try {
    await updateData;
    res.status(200).json({ status: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ status: false, message: 'Error updating item', error: error.message });
  }
});

//Delete items
router.delete('/DeleteItem/:id', verifyToken, async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await Item.findByIdAndDelete({_id:itemId});
    if (!deletedItem) {
      return res.status(404).json({ status: false, message: 'Item not found' });
    }

    res.status(200).json({ status: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error deleting item', error: error.message });
  }
});

//Get monthly payment details
router.get('/GetMonthlyPaymentDetails/:month', verifyToken, async (req, res) => {
  const month = parseInt(req.params.month);
  console.log("Request month is : ", month);

  try {
    const year = new Date().getFullYear();
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const results = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $addFields: {
          QuantityNum: { $toInt: "$Quantity" },
          ItemObjectId: { $toObjectId: "$ItemId" }
        }
      },
      {
        $group: {
          _id: "$ItemObjectId",
          totalQuantity: { $sum: "$QuantityNum" },
          totalPrice: { $sum: "$Price" },
          Material: { $first: "$Material" }
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails"
        }
      },
      { $unwind: "$itemDetails" },
      {
        $project: {
          _id: 0,
          ItemId: "$_id",
          totalQuantity: 1,
          totalPrice: 1,
          Material: 1,
          ItemName: "$itemDetails.ItemName",
          ItemPrice: "$itemDetails.ItemPrice",
          Gender: "$itemDetails.Gender",
          url: "$itemDetails.Url1"
        }
      }
    ]);

    if (!results.length) {
      return res.status(404).json({ message: 'No payments found for this month' });
    }

    res.status(200).json({
      Status: true,
      message: 'Monthly payment summary retrieved successfully',
      items: results
    });

  } catch (error) {
    console.error('Error retrieving monthly payment summary:', error);
    res.status(500).json({
      Status: false,
      message: 'Error retrieving monthly payment summary',
      error: error.message
    });
  }
});


//Get the all the payments with there details
router.get('/GetAllPaymentsItems', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'userId',
        model: 'User',
        select: 'userName postalCode address'
      })
      .populate({
        path: 'ItemId',
        model: 'Item',
        select: 'ItemName ItemPrice'
      });

    // Transform the data to include only the required fields
    const formattedPayments = payments.map(payment => ({
      userName: payment.userId?.userName || 'N/A',
      TotalPrice: payment.Price,
      Quantity: payment.Quantity,
      Size: payment.Size,
      ItemName: payment.ItemId?.ItemName || 'N/A',
      ItemPrice: payment.ItemId?.ItemPrice || 0,
      postalCode: payment.userId?.postalCode || 'N/A',
      address: payment.userId?.address || 'N/A'
    }));

    res.status(200).json({
      Status: true,
      message: 'All payments retrieved successfully',
      payments: formattedPayments
    });
  } catch (error) {
    console.error('Error retrieving all payments:', error);
    res.status(500).json({
      Status: false,
      message: 'Error retrieving all payments',
      error: error.message
    });
  }
});

module.exports=router;