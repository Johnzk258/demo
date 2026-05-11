import { Router, Request, Response } from "express";

export default function mountProductsEndpoints(router: Router) {
  // Get all products
  router.get('/', async (req: Request, res: Response) => {
    try {
      const productCollection = req.app.locals.productCollection;
      const products = await productCollection.find({}).toArray();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get all categories
  router.get('/categories', async (req: Request, res: Response) => {
    try {
      const categoryCollection = req.app.locals.categoryCollection;
      const categories = await categoryCollection.find({}).toArray();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Add a product
  router.post('/', async (req: Request, res: Response) => {
    try {
      const productCollection = req.app.locals.productCollection;
      const product = {
        ...req.body,
        created_at: new Date()
      };
      const result = await productCollection.insertOne(product);
      res.status(201).json({ message: 'Product created', id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Update a product
  router.patch('/:id', async (req: Request, res: Response) => {
    try {
      const productCollection = req.app.locals.productCollection;
      const { ObjectId } = require('mongodb');
      await productCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.status(200).json({ message: 'Product updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Delete a product
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const productCollection = req.app.locals.productCollection;
      const { ObjectId } = require('mongodb');
      await productCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Add a category
  router.post('/categories', async (req: Request, res: Response) => {
    try {
      const categoryCollection = req.app.locals.categoryCollection;
      const result = await categoryCollection.insertOne(req.body);
      res.status(201).json({ message: 'Category created', id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  // Delete a category
  router.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
      const categoryCollection = req.app.locals.categoryCollection;
      const { ObjectId } = require('mongodb');
      await categoryCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });
}
