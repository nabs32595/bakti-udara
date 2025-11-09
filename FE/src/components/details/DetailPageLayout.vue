<template>
  <div class="min-h-screen" :class="backgroundColor">
    <!-- Header Slot -->
    <slot name="header"></slot>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" :class="{ 'bg-gray-50': isEditMode }">
      <!-- Tabs Navigation -->
      <Tabs :default-value="defaultTab" class="w-full" v-model="activeTab">
        <TabsList class="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="rfq" class="flex items-center gap-2">
            <FileText class="h-4 w-4" />
            RFQ Details
          </TabsTrigger>
          <TabsTrigger value="quotation" class="flex items-center gap-2">
            <Receipt class="h-4 w-4" />
            Quotation Details
          </TabsTrigger>
        </TabsList>

        <!-- RFQ Details Tab Content -->
        <TabsContent value="rfq" class="mt-0">
          <!-- Backward compatibility: full-width slot -->
          <template v-if="$slots['rfq-content']">
            <div class="space-y-6">
              <slot name="rfq-content"></slot>
            </div>
          </template>
          <!-- 2-column layout -->
          <template v-else>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column (2/3 width) -->
              <div class="lg:col-span-2 space-y-6">
                <slot name="rfq-left"></slot>
              </div>
              <!-- Right Column (1/3 width) -->
              <div class="space-y-6">
                <slot name="rfq-right"></slot>
              </div>
            </div>
          </template>
        </TabsContent>

        <!-- Quotation Details Tab Content -->
        <TabsContent value="quotation" class="mt-0">
          <!-- Backward compatibility: full-width slot -->
          <template v-if="$slots['quotation-content']">
            <div class="space-y-6">
              <slot name="quotation-content"></slot>
            </div>
          </template>
          <!-- 2-column layout -->
          <template v-else>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column (2/3 width) -->
              <div class="lg:col-span-2 space-y-6">
                <slot name="quotation-left"></slot>
              </div>
              <!-- Right Column (1/3 width) -->
              <div class="space-y-6">
                <slot name="quotation-right"></slot>
              </div>
            </div>
          </template>
        </TabsContent>
      </Tabs>

      <!-- Actions Slot (Context-Aware) -->
      <div class="mt-6">
        <slot name="actions" :active-tab="activeTab"></slot>
      </div>
    </div>

    <!-- Dialogs Slot -->
    <slot name="dialogs"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileText, Receipt } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isEditMode?: boolean
  backgroundColor?: string
  defaultTab?: 'rfq' | 'quotation'
  rfqData?: any
  quotationData?: any
}>(), {
  defaultTab: 'rfq'
})

const activeTab = ref<string>(props.defaultTab)
</script>

