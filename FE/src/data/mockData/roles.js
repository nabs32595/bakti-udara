export const INITIAL_ROLES = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: [
      'dashboard.view',
      'dashboard.analytics',
      'rfq.view',
      'rfq.create',
      'rfq.edit',
      'rfq.delete',
      'quotation.view',
      'quotation.create',
      'quotation.edit',
      'quotation.delete',
      'quotation.approve',
      'po.view',
      'po.create',
      'po.edit',
      'po.delete',
      'po.approve',
      'delivery.view',
      'delivery.create',
      'delivery.edit',
      'delivery.delete',
      'user.view',
      'user.create',
      'user.edit',
      'user.delete',
      'role.view',
      'role.create',
      'role.edit',
      'role.delete',
      'email.view',
      'email.edit',
      'email.send',
      'settings.view',
      'settings.edit'
    ],
    userCount: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isSystem: true
  },
  {
    id: '2',
    name: 'Operations',
    description: 'Manage daily operations, RFQs, quotations, and purchase orders',
    permissions: [
      'dashboard.view',
      'rfq.view',
      'rfq.create',
      'rfq.edit',
      'quotation.view',
      'quotation.create',
      'quotation.edit',
      'quotation.approve',
      'po.view',
      'po.create',
      'po.edit',
      'delivery.view',
      'delivery.create',
      'delivery.edit'
    ],
    userCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    isSystem: false
  },
  {
    id: '3',
    name: 'Customer',
    description: 'Customer access to view quotations and track orders',
    permissions: [
      'dashboard.view',
      'rfq.view',
      'quotation.view',
      'po.view',
      'delivery.view'
    ],
    userCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
    isSystem: false
  }
]

export const INITIAL_USERS = [
  { id: '1', name: 'aliff', email: 'aliff@baktiudara.com', roleId: '1' },
  { id: '2', name: 'erma', email: 'erma@baktiudara.com', roleId: '2' },
  { id: '3', name: 'adda', email: 'adda@baktiudara.com', roleId: '2' },
  { id: '7', name: 'shahmail', email: 'shahmail@baktiudara.com', roleId: '3' },
  { id: '8', name: 'zico', email: 'zico@baktiudara.com', roleId: '3' }
]

