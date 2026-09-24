import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/products', async (req: AuthRequest, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { workspaceId: req.workspaceId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
});

router.post('/products', async (req: AuthRequest, res, next) => {
  try {
    const { sku, name, description, price, inStock, stockQuantity, category, supportInfo } = req.body;
    const product = await prisma.product.create({
      data: { workspaceId: req.workspaceId!, sku, name, description, price: parseFloat(price), inStock, stockQuantity: parseInt(stockQuantity || 100), category, supportInfo }
    });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

router.get('/services', async (req: AuthRequest, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { workspaceId: req.workspaceId }
    });
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
});

router.get('/orders', async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { workspaceId: req.workspaceId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
});

router.get('/customers', async (req: AuthRequest, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { workspaceId: req.workspaceId },
      include: { conversations: true, orders: true, tags: true },
      orderBy: { lastContactAt: 'desc' }
    });
    res.json({ success: true, data: customers });
  } catch (err) { next(err); }
});

router.get('/collections', async (req: AuthRequest, res, next) => {
  try {
    const collections = await prisma.customCollection.findMany({
      where: { workspaceId: req.workspaceId },
      include: { fields: true, records: true }
    });
    res.json({ success: true, data: collections });
  } catch (err) { next(err); }
});

router.post('/collections', async (req: AuthRequest, res, next) => {
  try {
    const { name, description, fields } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const collection = await prisma.customCollection.create({
      data: {
        workspaceId: req.workspaceId!,
        name,
        slug,
        description,
        fields: {
          create: fields.map((f: any) => ({
            name: f.name,
            key: f.key || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            fieldType: f.fieldType || 'TEXT',
            isRequired: f.isRequired || false
          }))
        }
      },
      include: { fields: true }
    });

    res.json({ success: true, data: collection });
  } catch (err) { next(err); }
});

router.post('/collections/:id/records', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { data } = req.body;
    const record = await prisma.customRecord.create({
      data: {
        collectionId: id,
        data
      }
    });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
});

export default router;
