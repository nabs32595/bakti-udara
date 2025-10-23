<script setup lang="ts">
import {ref, computed} from 'vue'
import type {Role} from '@/types/roles'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Badge} from '@/components/ui/badge'
import {Search, Shield, Users, UserCheck, Trash2} from 'lucide-vue-next'

// Sample data - replace with API calls
const roles = ref<Role[]>([
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: ['dashboard.view', 'dashboard.analytics', 'rfq.view', 'rfq.create', 'rfq.edit', 'rfq.delete', 'quotation.view', 'quotation.create', 'quotation.edit', 'quotation.delete', 'quotation.approve', 'po.view', 'po.create', 'po.edit', 'po.delete', 'po.approve', 'delivery.view', 'delivery.create', 'delivery.edit', 'delivery.delete', 'user.view', 'user.create', 'user.edit', 'user.delete', 'role.view', 'role.create', 'role.edit', 'role.delete', 'email.view', 'email.edit', 'email.send', 'settings.view', 'settings.edit'],
    userCount: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isSystem: true
  },
  {
    id: '2',
    name: 'Operations',
    description: 'Manage daily operations, RFQs, quotations, and purchase orders',
    permissions: ['dashboard.view', 'rfq.view', 'rfq.create', 'rfq.edit', 'quotation.view', 'quotation.create', 'quotation.edit', 'quotation.approve', 'po.view', 'po.create', 'po.edit', 'delivery.view', 'delivery.create', 'delivery.edit'],
    userCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    isSystem: false
  },
  {
    id: '3',
    name: 'Customer',
    description: 'Customer access to view quotations and track orders',
    permissions: ['dashboard.view', 'rfq.view', 'quotation.view', 'po.view', 'delivery.view'],
    userCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
    isSystem: false
  }
])

const searchQuery = ref('')
const userSearchQuery = ref('')
const selectedRoleFilter = ref('')

// Sample users data
const users = ref([
  {id: '1', name: 'aliff', email: 'aliff@baktiudara.com', roleId: '1'},
  {id: '2', name: 'erma', email: 'erma@baktiudara.com', roleId: '2'},
  {id: '3', name: 'adda', email: 'adda@baktiudara.com', roleId: '2'},
  {id: '7', name: 'shahmail', email: 'shahmail@baktiudara.com', roleId: '3'},
  {id: '8', name: 'zico', email: 'zico@baktiudara.com', roleId: '3'},
])


const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value

  const query = searchQuery.value.toLowerCase()
  return roles.value.filter(role =>
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
  )
})

// Filtered users for the table view
const filteredUsers = computed(() => {
  let result = users.value

  // Filter by role if selected
  if (selectedRoleFilter.value) {
    result = result.filter(user => user.roleId === selectedRoleFilter.value)
  }

  // Filter by search query if provided
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase()
    result = result.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }

  return result
})

// Helper function to get a user's role object
const getUserRole = (user: { roleId: string }) => {
  return roles.value.find(role => role.id === user.roleId)
}

// Function to change a user's role
const changeUserRole = (user: { id: string, roleId: string }, event: Event) => {
  const target = event.target as HTMLSelectElement
  user.roleId = target.value
}

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Roles</h2>
        <p class="text-muted-foreground">
          Manage user roles
        </p>
      </div>
    </div>
    <!-- Tabs -->
    <Tabs default-value="roles" class="w-full">
      <div class="flex mb-2">
        <TabsList class="grid grid-cols-2 w-auto">
          <TabsTrigger value="roles" class="flex items-center gap-2">
            <Shield class="h-4 w-4 text-gray-600"/>
            Roles Management
          </TabsTrigger>
          <TabsTrigger value="users" class="flex items-center gap-2">
            <UserCheck class="h-4 w-4"/>
            User Assignments
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- Roles Management Tab -->
      <TabsContent value="roles" class="space-y-4">
        <Card class="border-2 border-gray-300">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>All Roles</CardTitle>
                <CardDescription>Manage system roles</CardDescription>
              </div>
              <div class="flex items-center gap-4">
                <div class="relative w-72">
                  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                  <Input
                      v-model="searchQuery"
                      placeholder="Search roles..."
                      class="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-0">

            <div class="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-4">
              <Card v-for="role in filteredRoles" :key="role.id" class="border border-gray-200">
                <CardHeader class="pb-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Shield v-if="role.isSystem" class="h-5 w-5 text-gray-600"/>
                      <CardTitle>{{ role.name }}</CardTitle>
                      <Badge v-if="role.isSystem" variant="secondary" class="text-xs">System</Badge>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <CardDescription class="mr-2">{{ role.description }}</CardDescription>
                    <Badge variant="outline" class="font-normal">
                      {{ role.userCount }} user{{ role.userCount !== 1 ? 's' : '' }}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div>Created: {{
                          new Date(role.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        }}
                      </div>
                      <div>Updated: {{
                          new Date(role.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- User Assignments Tab -->
      <TabsContent value="users" class="space-y-4">
        <Card class="border-2 border-gray-300">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>User Role Assignments</CardTitle>
                <CardDescription>View and manage user role assignments</CardDescription>
              </div>
              <div class="flex items-center gap-4">
                <!-- Search box -->
                <div class="relative w-72">
                  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                  <Input
                      v-model="userSearchQuery"
                      placeholder="Search users..."
                      class="pl-9"
                  />
                </div>
                <!-- Role filter dropdown -->
                <div class="w-48">
                  <select
                      v-model="selectedRoleFilter"
                      class="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  >
                    <option value="">All Roles</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                      {{ role.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow class="bg-gray-50 hover:bg-gray-50">
                  <TableHead class="font-semibold text-gray-700">User Name</TableHead>
                  <TableHead class="font-semibold text-gray-700">Email</TableHead>
                  <TableHead class="font-semibold text-gray-700">Role</TableHead>
                  <TableHead class="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                  <TableCell class="font-medium">{{ user.name }}</TableCell>
                  <TableCell class="text-gray-600">{{ user.email }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <Shield v-if="getUserRole(user)?.isSystem" class="h-4 w-4 text-gray-600"/>
                      {{ getUserRole(user)?.name }}
                      <Badge v-if="getUserRole(user)?.isSystem" variant="secondary" class="text-xs">System</Badge>
                    </div>
                  </TableCell>
                  <TableCell class="text-right">
                    <div class="flex items-center justify-end gap-2" v-if="user.roleId !== '1'">
                      <select
                          :value="user.roleId"
                          @change="changeUserRole(user, $event)"
                          class="rounded-md border border-gray-300 py-1 px-2 text-sm"
                      >
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                          {{ role.name }}
                        </option>
                      </select>
                      <Button
                          variant="ghost"
                          size="sm"
                          class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 class="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-if="filteredUsers.length === 0">
                  <TableCell colspan="4" class="h-24 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                      <Users class="h-8 w-8 mb-2 text-gray-400"/>
                      <p>No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  </div>
</template>
