const express = require('express');
const router = express.Router();
const { Sale, Purchase } = require('../utils/db');
const requireAuth = require('../middleware/requireAuth');

// Sales routes
router.post('/sales', requireAuth(['Salesman', 'Admin']), async (req, res) => {
  try {
    const { productName, quantity, price } = req.body;
    if (!productName || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const saleData = { 
      product_name: productName, 
      quantity: parseInt(quantity), 
      price: parseFloat(price), 
      date: new Date().toISOString(), 
      salesman_id: req.user.id 
    };
    
    await Sale.create(saleData);
    res.json({ message: 'Sale recorded.' });
  } catch (error) {
    console.error('Record sale error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/sales', requireAuth(['Manager', 'Admin']), async (req, res) => {
  try {
    const sales = await Sale.find();
    // Convert database column names to frontend expected format
    const formattedSales = sales.map(sale => ({
      id: sale.id,
      productName: sale.product_name,
      quantity: sale.quantity,
      price: sale.price,
      date: sale.date,
      salesmanId: sale.salesman_id
    }));
    res.json(formattedSales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Purchases routes
router.post('/purchases', requireAuth(['PurchaseMan', 'Admin']), async (req, res) => {
  try {
    const { productName, quantity, cost } = req.body;
    if (!productName || !quantity || !cost) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const purchaseData = { 
      product_name: productName, 
      quantity: parseInt(quantity), 
      cost: parseFloat(cost), 
      date: new Date().toISOString(), 
      purchaseman_id: req.user.id 
    };
    
    await Purchase.create(purchaseData);
    res.json({ message: 'Purchase recorded.' });
  } catch (error) {
    console.error('Record purchase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/purchases', requireAuth(['Manager', 'Admin']), async (req, res) => {
  try {
    const purchases = await Purchase.find();
    // Convert database column names to frontend expected format
    const formattedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      productName: purchase.product_name,
      quantity: purchase.quantity,
      cost: purchase.cost,
      date: purchase.date,
      purchaseManId: purchase.purchaseman_id
    }));
    res.json(formattedPurchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
