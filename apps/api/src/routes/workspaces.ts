import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const members = await prisma.workspaceMember.findMany({
      where: { userId: req.user!.id },
      include: { workspace: true, role: true }
    });

    res.json({
      success: true,
      data: members.map((m: any) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        role: m.role.roleType,
        logo: m.workspace.logo
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.get('/current', requireWorkspaceAccess, async (req: AuthRequest, res, next) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: req.workspaceId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true, jobTitle: true } },
            role: true
          }
        }
      }
    });

    res.json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
});

router.put('/current', requireWorkspaceAccess, async (req: AuthRequest, res, next) => {
  try {
    const { name, logo, description, industry, websiteUrl, contactEmail, contactPhone, address, timezone, currency, locale, businessHours } = req.body;

    const updated = await prisma.workspace.update({
      where: { id: req.workspaceId },
      data: {
        name,
        logo,
        description,
        industry,
        websiteUrl,
        contactEmail,
        contactPhone,
        address,
        timezone,
        currency,
        locale,
        businessHours
      }
    });

    await prisma.auditLog.create({
      data: {
        workspaceId: req.workspaceId!,
        userId: req.user!.id,
        action: 'UPDATE_WORKSPACE_SETTINGS',
        resource: 'Workspace',
        resourceId: req.workspaceId
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
