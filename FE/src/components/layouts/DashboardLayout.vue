<template>
  <SidebarProvider>
    <div class="flex min-h-screen w-full">
      <!-- Sidebar -->
      <Sidebar>
        <SidebarHeader>
          <div class="flex items-center gap-3 px-4 py-3 border-b">
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span class="text-xs font-bold">BU</span>
            </div>
            <span class="text-sm font-medium">Bakti Udara</span>
          </div>
        </SidebarHeader>

        <SidebarContent class="flex flex-col h-[calc(100vh-4rem)]">
          <div class="flex-grow">
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Dashboard'"
                      @click="$router.push('/')"
                  >
                    Dashboard Overview
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Sales Operations</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Request For Quotation'"
                      @click="$router.push('/request-for-quotation')"
                  >
                    Request for Quotation (RFQ)
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Quotations'"
                      @click="$router.push('/quotations')"
                  >
                    Quotations
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Purchase Orders'"
                      @click="$router.push('/purchase-orders')"
                  >
                    Purchase Orders (PO)
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Deliveries'"
                      @click="$router.push('/deliveries')"
                  >
                    Deliveries
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>System Tools</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Email'"
                      @click="$router.push('/email')"
                  >
                    Email
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      :is-active="$route.name === 'Roles & Permissions'"
                      @click="$router.push('/roles')"
                  >
                    Roles
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </div>

          <!-- Logout button at bottom -->
          <div class="mt-auto p-4 border-t">
            <Button @click="handleLogout" class="w-full">
              Logout
            </Button>
            <div class="mt-3 text-center text-xs text-muted-foreground">
              Version Alpha 0.1.0
            </div>
          </div>
        </SidebarContent>
      </Sidebar>

      <!-- Main Content -->
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1"/>
            <Separator orientation="vertical" class="mr-2 h-4"/>
            <h1 class="text-lg font-semibold">{{ $route.name }}</h1>
          </div>
          <NotificationBell />
        </header>

        <main class="flex-1 p-6">
          <RouterView/>
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {Separator} from '@/components/ui/separator'
import {Button} from '@/components/ui/button'
import NotificationBell from '@/components/NotificationBell.vue'

const router = useRouter()

const handleLogout = () => {
  // In a real app, you would clear tokens, call logout API, etc.
  console.log('Logging out...')
  router.push('/login')
}
</script>
