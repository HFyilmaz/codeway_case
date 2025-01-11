<template>
  <div class="home">
    <header class="header">
      <div class="logo">
        <img src="../assets/images/icon.png" alt="Logo" width="40" height="40" />
      </div>
      <div class="user-menu">
        <button class="user-button" @click="handleSignOut">
          <i class="mdi mdi-account"></i>
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="config-table">
        <div class="table-header">
          <div class="col-key">Parameter Key</div>
          <div class="col-value">Value</div>
          <div class="col-desc">Description</div>
          <div class="col-date sortable" @click="toggleSort">
            Create Date 
            <span class="sort-icon">
              {{ sortState === 'asc' ? '↓' : sortState === 'desc' ? '↑' : '' }}
            </span>
          </div>
          <div class="col-actions"></div>
        </div>

        <div v-for="param in sortedParameters" :key="param.key" class="table-row">
          <div class="col-key">{{ param.key }}</div>
          <div class="col-value">{{ param.value }}</div>
          <div class="col-desc">{{ param.description }}</div>
          <div class="col-date">{{ param.createDate }}</div>
          <div class="col-actions">
            <button class="edit-button" @click="editParameter(param)">Edit</button>
            <button class="delete-button" @click="deleteParameter(param)">Delete</button>
          </div>
        </div>

        <!-- New Parameter Row -->
        <div class="table-row new-parameter">
          <div class="col-key">
            <input type="text" v-model="newParam.key" placeholder="New Parameter" />
          </div>
          <div class="col-value">
            <input type="text" v-model="newParam.value" placeholder="Value" />
          </div>
          <div class="col-desc" style="width: 51%;">
            <input type="text" v-model="newParam.description" placeholder="New Description" />
          </div>
          <div class="col-actions">
            <button class="add-button" @click="addParameter">ADD</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sortState = ref('none') // 'none', 'asc', 'desc'

// Sample data - will be replaced with actual API calls
const parameters = ref([
  {
    key: 'min_version',
    value: '1.4.4',
    description: 'Minimum required version of the app',
    createDate: '10/05/2021 01:58'
  },
  {
    key: 'latest_version',
    value: '1.4.7',
    description: 'Latest version of the app',
    createDate: '10/05/2021 01:58'
  },
  {
    key: 'pricing_tier',
    value: 't6',
    description: 'Pricing tier of the user',
    createDate: '07/07/2021 11:13'
  },
  {
    key: 'scroll',
    value: '5',
    description: 'Index of Scroll Paywall for free users.',
    createDate: '25/08/2021 10:22'
  },
  {
    key: 'scroll_limit',
    value: '13',
    description: 'Index of Scroll Limit Paywall for free users.',
    createDate: '25/08/2021 10:23'
  }
])

const sortedParameters = computed(() => {
  if (sortState.value === 'none') return parameters.value

  return [...parameters.value].sort((a, b) => {
    const dateA = new Date(a.createDate.split(' ')[0].split('/').reverse().join('-') + ' ' + a.createDate.split(' ')[1])
    const dateB = new Date(b.createDate.split(' ')[0].split('/').reverse().join('-') + ' ' + b.createDate.split(' ')[1])
    
    return sortState.value === 'asc' 
      ? dateA - dateB 
      : dateB - dateA
  })
})

const toggleSort = () => {
  sortState.value = sortState.value === 'none' 
    ? 'asc' 
    : sortState.value === 'asc' 
      ? 'desc' 
      : 'none'
}

const newParam = ref({
  key: '',
  value: '',
  description: ''
})

const handleSignOut = async () => {
  // Firebase sign out logic will be implemented here
  router.push('/signin')
}

const editParameter = (param) => {
  // Edit logic will be implemented
  console.log('Edit:', param)
}

const deleteParameter = (param) => {
  // Delete logic will be implemented
  console.log('Delete:', param)
}

const addParameter = () => {
  // Add logic will be implemented
  console.log('Add:', newParam.value)
  newParam.value = { key: '', value: '', description: '' }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #1a1f2c;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1f2c;
}

.user-button {
  background: none;
  border: none;
  color: #8b92a5;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.main-content {
  padding: 2rem 0rem;
}

.config-table {
  width: 100%;
  border-spacing: 0;
  text-align: left;
  color: #fff;
}

.table-header {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #363c4c;
  font-weight: 500;
  font-size: 1.4rem;
  color: #8b92a5;
}

.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sortable:hover {
  color: #fff;
}

.sort-icon {
  display: inline-block;
  width: 12px;
}

.table-row {
  display: flex;
  padding: 1rem 0;
  align-items: center;
}

.col-key { width: 18%; padding-right: 1rem; }
.col-value { width: 18%; padding-right: 1rem; }
.col-desc { width: 36%; padding-right: 1rem; }
.col-date { width: 15%; padding-right: 1rem; }
.col-actions { width: 15%; display: flex; gap: 0.5rem; justify-content: flex-end; }

.edit-button, .delete-button, .add-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #4c5fff;
  color: white;
}

.delete-button {
  background-color: #ff4c4c;
  color: white;
}

.add-button {
  background-color: #00bcd4;
  color: white;
  width: fit-content;
  margin-right: 5rem;
}

.new-parameter input {
  width: 100%;
  padding: 0.5rem;
  background-color: #262b38;
  border: 1px solid #363c4c;
  border-radius: 4px;
  color: white;
}

.new-parameter input::placeholder {
  color: #8b92a5;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    overflow-x: auto;
  }
  
  .config-table {
    min-width: 800px;
  }
}
</style> 