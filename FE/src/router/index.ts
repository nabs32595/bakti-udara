import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/LoginPage.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue')
  },
  {
    path: '/request-for-quotation',
    name: 'Request For Quotation',
    component: () => import('@/pages/RFQListPage.vue')
  },
  {
    path: '/request-for-quotation/create',
    name: 'Create RFQ',
    component: () => import('@/pages/RFQCreatePage.vue')
  },
  {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('@/pages/QuotationsListPage.vue')
  },
  {
    path: '/quotations/create',
    name: 'Create Quotation',
    component: () => import('@/pages/QuotationCreatePage.vue')
  },
  {
    // Catch full rfqNo including slashes (e.g. PA/RO1/M50/260123/EMAIL)
    path: '/rfq/:rfqNo(.*)',
    name: 'RFQ Details',
    component: () => import('@/pages/EntityDetailsPage.vue')
  },
  {
    path: '/quotations/:quotationNo',
    name: 'Quotation Details',
    component: () => import('@/pages/EntityDetailsPage.vue')
  },
  {
    path: '/purchase-orders',
    name: 'Purchase Orders',
    component: () => import('@/pages/PurchaseOrdersListPage.vue')
  },
  {
    path: '/purchase-orders/create',
    name: 'Create Purchase Order',
    component: () => import('@/pages/PurchaseOrderCreatePage.vue')
  },
  {
    path: '/purchase-orders/:poReference',
    name: 'Purchase Order Details',
    component: () => import('@/pages/EntityDetailsPage.vue')
  },
  {
    path: '/deliveries',
    name: 'Deliveries',
    component: () => import('@/pages/DeliveriesPage.vue')
  },
  {
    path: '/roles',
    name: 'Roles & Permissions',
    component: () => import('@/pages/RolesPage.vue')
  },
  {
    path: '/email',
    name: 'Email',
    component: () => import('@/pages/email/EmailPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
