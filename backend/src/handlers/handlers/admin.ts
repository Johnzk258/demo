import { Router, Request, Response } from "express";

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

function checkAdmin(req: Request, res: Response, next: any) {
  const key = req.headers['admin-key'] || req.query.admin_key;
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

export default function mountAdminEndpoints(router: Router) {
  // Get all users
  router.get('/users', checkAdmin, async (req: Request, res: Response) => {
    try {
      const userCollection = req.app.locals.userCollection;
      const users = await userCollection.find({}).toArray();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Get all orders
  router.get('/orders', checkAdmin, async (req: Request, res: Response) => {
    try {
      const orderCollection = req.app.locals.orderCollection;
      const orders = await orderCollection.find({}).toArray();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Delete a user
  router.delete('/users/:id', checkAdmin, async (req: Request, res: Response) => {
    try {
      const userCollection = req.app.locals.userCollection;
      const { ObjectId } = require('mongodb');
      await userCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Update order status
  router.patch('/orders/:id', checkAdmin, async (req: Request, res: Response) => {
    try {
      const orderCollection = req.app.locals.orderCollection;
      const { ObjectId } = require('mongodb');
      await orderCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.status(200).json({ message: 'Order updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // Dashboard stats
  router.get('/stats', checkAdmin, async (req: Request, res: Response) => {
    try {
      const userCollection = req.app.locals.userCollection;
      const orderCollection = req.app.locals.orderCollection;
      const totalUsers = await userCollection.countDocuments();
      const totalOrders = await orderCollection.countDocuments();
      const paidOrders = await orderCollection.countDocuments({ paid: true });
      const cancelledOrders = await orderCollection.countDocuments({ cancelled: true });
      res.status(200).json({ totalUsers, totalOrders, paidOrders, cancelledOrders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
}
