<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Email Management</h2>
      <p class="text-muted-foreground">
        Manage email templates and settings for your communications
      </p>
    </div>

    <!-- Tabs -->
    <Tabs default-value="templates" class="w-full">
      <div class="flex mb-2">
        <TabsList class="grid grid-cols-2 w-auto">
          <TabsTrigger value="templates" class="flex items-center gap-2">
            <Mail class="h-4 w-4 text-gray-600"/>
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" class="flex items-center gap-2">
            <Settings class="h-4 w-4"/>
            Settings
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- Templates Tab -->
      <TabsContent value="templates">
          <EmailTemplates/>
      </TabsContent>

      <!-- Settings Tab -->
      <TabsContent value="settings">
          <EmailSettings/>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import EmailTemplates from '@/pages/email/EmailTemplates.vue'
import EmailSettings from '@/pages/email/EmailSettings.vue'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {Mail, Settings} from 'lucide-vue-next'
import {Card} from "@/components/ui/card";
</script>
