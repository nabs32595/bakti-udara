import { ref, watch } from 'vue'

/**
 * Composable for managing reactive data with localStorage persistence
 * 
 * @param {string} key - localStorage key to store the data under
 * @param {*} defaultValue - Default value to use if no data exists in localStorage
 * @returns {import('vue').Ref} Reactive ref that automatically syncs with localStorage
 * 
 * @example
 * const rfqList = useLocalStorage('rfqList', [])
 * // Changes to rfqList.value are automatically saved to localStorage
 */
export function useLocalStorage(key, defaultValue) {
  // Try to load existing data from localStorage
  const stored = localStorage.getItem(key)
  
  // Parse stored data or use default value
  const data = ref(
    stored ? JSON.parse(stored) : defaultValue
  )

  // If no stored data exists, save the default value immediately
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue))
  }

  // Watch for changes and automatically save to localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true } // Deep watch for nested objects and arrays
  )

  return data
}

