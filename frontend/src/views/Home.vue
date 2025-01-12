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
              {{ sortState === 'asc' ? '↓' : '↑' }}
            </span>
          </div>
          <div class="col-actions"></div>
        </div>

        <div v-for="param in sortedParameters" :key="param.key" class="table-row" :class="{ 'editing-row': editingParam?.key === param.key }">
          <template v-if="editingParam?.key === param.key">
            <div class="col-key">
              <input type="text" v-model="editingParam.key" />
            </div>
            <div class="col-value">
              <input type="text" v-model="editingParam.value" />
            </div>
            <div class="col-desc">
              <input type="text" v-model="editingParam.description" />
            </div>
            <div class="col-date">{{ param.createDate }}</div>
            <div class="col-actions">
              <button class="accept-button" @click="acceptEdit">Accept</button>
              <button class="cancel-button" @click="cancelEdit">Cancel</button>
            </div>
          </template>
          <template v-else>
            <div class="col-key">{{ param.key }}</div>
            <div class="col-value">{{ param.value }}</div>
            <div class="col-desc">{{ param.description }}</div>
            <div class="col-date">{{ param.createDate }}</div>
            <div class="col-actions">
              <button class="edit-button" @click="editParameter(param)">Edit</button>
              <button class="delete-button" @click="deleteParameter(param)">Delete</button>
            </div>
          </template>
        </div>

        <div class="table-row new-parameter">
          <div class="col-key">
            <input 
              type="text" 
              v-model="newParam.key" 
              placeholder="New Parameter"
              :class="{ 'invalid-input': invalidFields.key }" 
            />
          </div>
          <div class="col-value">
            <input 
              type="text" 
              v-model="newParam.value" 
              placeholder="Value"
              :class="{ 'invalid-input': invalidFields.value }" 
            />
          </div>
          <div class="col-desc new-desc">
            <input 
              type="text" 
              v-model="newParam.description" 
              placeholder="New Description"
              :class="{ 'invalid-input': invalidFields.description }" 
            />
          </div>
          <div class="col-actions">
            <button class="add-button" @click="addParameter">ADD</button>
          </div>
        </div>

        <div class="table-row" v-if="errorMessage">
          <div class="error-message">{{ errorMessage }}</div>
        </div>
        
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { logout, user, getToken } = useAuth()
const sortState = ref('asc')
const editingParam = ref(null)
const errorMessage = ref('')
const parameters = ref([])

const fetchConfigurations = async () => {
  try {
    const token = await getToken()
    const response = await fetch('http://localhost:3000/config/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch configurations')
    }

    const configs = await response.json()
    parameters.value = configs.map(config => ({
      key: config.key,
      value: config.value,
      description: config.description,
      createDate: formatDate(config.createdAt)
    }))

  } catch (error) {
    console.error('Error fetching configurations:', error)
    errorMessage.value = 'Failed to load configurations'
  }
}

onMounted(fetchConfigurations)

const formatDate = (isoDate) => {
  const date = new Date(isoDate)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const sortedParameters = computed(() => {
  return [...parameters.value].sort((a, b) => {
    const dateA = new Date(a.createDate.split(' ')[0].split('/').reverse().join('-') + ' ' + a.createDate.split(' ')[1])
    const dateB = new Date(b.createDate.split(' ')[0].split('/').reverse().join('-') + ' ' + b.createDate.split(' ')[1])
    
    return sortState.value === 'asc' 
      ? dateA - dateB 
      : dateB - dateA
  })
})

const toggleSort = () => {
  sortState.value = sortState.value === 'asc' ? 'desc' : 'asc'
}

const newParam = ref({
  key: '',
  value: '',
  description: ''
})

const invalidFields = ref({
  key: false,
  value: false,
  description: false
})

const resetValidation = () => {
  invalidFields.value = {
    key: false,
    value: false,
    description: false
  }
}

const handleSignOut = async () => {
  await logout()
  router.push('/signin')
}

const editParameter = (param) => {
  editingParam.value = { ...param }
}

const acceptEdit = async () => {
  try {
    const token = await getToken()
    const response = await fetch(`http://localhost:3000/config/update/${editingParam.value.key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        value: editingParam.value.value,
        description: editingParam.value.description
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update parameter')
    }

    const result = await response.json()
    
    const index = parameters.value.findIndex(p => p.key === editingParam.value.key)
    if (index !== -1) {
      parameters.value[index] = {
        key: result.config.key,
        value: result.config.value,
        description: result.config.description,
        createDate: formatDate(result.config.createdAt)
      }
    }

    editingParam.value = null
    errorMessage.value = ''
  } catch (error) {
    console.error('Error updating parameter:', error)
    errorMessage.value = error.message
  }
}

const cancelEdit = () => {
  editingParam.value = null
  errorMessage.value = ''
}

const deleteParameter = async (param) => {
  try {
    const token = await getToken()
    const response = await fetch(`http://localhost:3000/config/delete/${param.key}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete parameter')
    }

    parameters.value = parameters.value.filter(p => p.key !== param.key)
    errorMessage.value = ''
  } catch (error) {
    console.error('Error deleting parameter:', error)
    errorMessage.value = error.message
  }
}

const addParameter = async () => {
  try {
    resetValidation()
    
    invalidFields.value.key = !newParam.value.key
    invalidFields.value.value = !newParam.value.value
    invalidFields.value.description = !newParam.value.description

    if (!newParam.value.key || !newParam.value.value || !newParam.value.description) {
      errorMessage.value = 'All fields are required'
      return
    }

    const token = await getToken()
    const response = await fetch('http://localhost:3000/config/add_config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        key: newParam.value.key,
        value: newParam.value.value,
        description: newParam.value.description
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add parameter')
    }

    const result = await response.json()
    
    parameters.value.push({
      key: result.config.key,
      value: result.config.value,
      description: result.config.description,
      createDate: formatDate(result.config.createdAt)
    })

    newParam.value = { key: '', value: '', description: '' }
    errorMessage.value = ''
  } catch (error) {
    console.error('Error adding parameter:', error)
    errorMessage.value = error.message
  }
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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
  padding: 5rem 0rem;
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

.col-key { 
  width: 18%; 
  padding-right: 1rem; 
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 1rem;
}
.col-value { 
  width: 18%; 
  padding-right: 1rem; 
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 1rem;
}
.col-desc { 
  width: 36%; 
  padding-right: 1rem; 
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 1rem;
}
.col-desc.new-desc { 
  width: 51%; 
  padding-right: 1rem; 
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 1rem;
}
.col-date { 
  width: 15%; 
  padding-right: 1rem; 
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 1rem;
}

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

.accept-button, .cancel-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.accept-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #9e9e9e;
  color: white;
}

.table-row input {
  width: 100%;
  padding: 0.5rem;
  background-color: #262b38;
  border: 1px solid #363c4c;
  border-radius: 4px;
  color: white;
  white-space: nowrap;
  overflow-x: auto;
}

.table-row input:focus {
  outline: none;
  border-color: #4c5fff;
}

.editing-row {
    border-radius: 4px;
    background-color: rgba(255, 255, 0, 0.1);
}

@media (max-width: 768px) {
    .header {
        position: fixed;
    }

    .main-content {
        padding: 3.5rem 0rem;
    }
    
    .config-table {
    min-width: unset;
  }

    .table-header {
        display: none;
    }

    .table-row {
        display: flex;
        flex-direction: column;
        background: #262b38;
        margin: 1rem 0rem;
        padding: 1rem;
        border-radius: 8px;
        gap: 0rem;
        border: 1px solid #ffffff;
    }

    .editing-row {
        background: rgba(255, 255, 0, 0.1) !important;
    }

    .col-key, 
    .col-value, 
    .col-desc, 
    .col-date,
    .col-actions,
    .col-desc.new-desc {
        width: 100%;
        padding: 0.25rem 0;
        white-space: normal;
    }

    .col-key::before {
        content: "Parameter Key: ";
        color: #8b92a5;
        font-weight: 500;
    }

    .col-value::before {
        content: "Value: ";
        color: #8b92a5;
        font-weight: 500;
    }

    .col-desc::before {
        content: "Description: ";
        color: #8b92a5;
        font-weight: 500;
    }

    .col-date::before {
        content: "Create Date: ";
        color: #8b92a5;
        font-weight: 500;
    }

    .col-actions {
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
    }

    .edit-button,
    .delete-button {
        flex: 1;
        max-width: 80px;
    }

    .new-parameter {
        background: transparent;
        gap: 1rem;
    }
    
    .new-parameter input {
        margin-top: 0.5rem;
    }

    .new-parameter .col-actions {
        justify-content: center;
    }

    .add-button {
        margin: 0;
        width: 100%;
        max-width: 120px;
    }

    .accept-button,
    .cancel-button {
        flex: 1;
        max-width: 80px;
    }
}

.error-message {
  color: #ff4c4c;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
}

.new-parameter input.invalid-input {
  border-color: #ff4c4c;
}

.new-parameter input.invalid-input::placeholder {
  color: rgba(255, 76, 76, 0.7);
}
</style> 