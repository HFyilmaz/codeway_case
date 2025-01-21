<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Override for {{ parameter?.key }}</h2>
        <button class="close-button" @click="close">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="country-override-form">
          <div class="form-group">
            <input 
              type="text" 
              v-model="newOverride.country" 
              placeholder="Country Code (e.g., TR)"
              maxlength="3"
            />
            <input 
              type="text" 
              v-model="newOverride.value" 
              placeholder="Override Value"
            />
            <button @click="addOverride" class="add-override-button">Add Override</button>
          </div>
        </div>

        <div class="country-overrides-list">
          <div v-if="!parameter?.countryOverrides || Object.keys(parameter?.countryOverrides).length === 0" class="no-overrides">
            No country overrides set
          </div>
          <div v-else v-for="(value, country) in parameter?.countryOverrides" :key="country" class="override-item">
            <template v-if="editingOverride?.country === country">
              <div class="override-country">{{ country }}</div>
              <div class="override-value">
                <input 
                  type="text" 
                  v-model="editingOverride.value"
                />
              </div>
              <div class="override-actions">
                <button @click="acceptEdit" class="edit-action-button accept">
                  <i class="mdi mdi-check"></i>
                </button>
                <button @click="cancelEdit" class="edit-action-button cancel">
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
            </template>
            <template v-else>
              <div class="override-country">{{ country }}</div>
              <div class="override-value">{{ value }}</div>
              <div class="override-actions">
                <button @click="editOverride(country, value)" class="edit-action-button">
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button @click="deleteOverride(country)" class="delete-override-button">
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </template>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS } from '../config/api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  parameter: {
    type: Object,
    required: true
  },
  getToken: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:show', 'parameter-updated'])

const error = ref('')
const newOverride = ref({
  country: '',
  value: ''
})
const editingOverride = ref(null)

const close = () => {
  emit('update:show', false)
  newOverride.value = { country: '', value: '' }
  error.value = ''
}

const addOverride = async () => {
  try {
    const country = newOverride.value.country.toUpperCase()
    const value = newOverride.value.value

    if (!country || !value) {
      error.value = 'Both country code and value are required'
      return
    }

    if (country.length < 2 || country.length > 3) {
      error.value = 'Country code must be 2 or 3 characters'
      return
    }

    const token = await props.getToken()
    const response = await fetch(API_ENDPOINTS.config.countryOverrides.update(props.parameter.key, country), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        value,
        version: props.parameter.version 
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 409) {
        error.value = 'This parameter was modified by another user. Please refresh to see the latest changes.'
        setTimeout(() => {
          emit('update:show', false)
        }, 2000)
        return
      }
      throw new Error(errorData.error || 'Failed to add country override')
    }

    const result = await response.json()
    emit('parameter-updated', result.config)
    newOverride.value = { country: '', value: '' }
    error.value = ''
  } catch (error) {
    console.error('Error adding country override:', error)
    error.value = error.message
  }
}

const deleteOverride = async (country) => {
  try {
    const token = await props.getToken()
    const response = await fetch(API_ENDPOINTS.config.countryOverrides.delete(props.parameter.key, country), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete country override')
    }

    const updatedOverrides = { ...props.parameter.countryOverrides }
    delete updatedOverrides[country]
    emit('parameter-updated', { ...props.parameter, countryOverrides: updatedOverrides })
    error.value = ''
  } catch (error) {
    console.error('Error deleting country override:', error)
    error.value = error.message
  }
}

const editOverride = (country, value) => {
  editingOverride.value = { country, value }
}

const cancelEdit = () => {
  editingOverride.value = null
  error.value = ''
}

const acceptEdit = async () => {
  try {
    const { country, value } = editingOverride.value

    if (!value) {
      error.value = 'Value is required'
      return
    }

    const token = await props.getToken()
    const response = await fetch(API_ENDPOINTS.config.countryOverrides.update(props.parameter.key, country), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        value,
        version: props.parameter.version 
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 409) {
        error.value = 'This parameter was modified by another user. Please refresh the page to see the latest changes.'
        editingOverride.value = null
        setTimeout(() => {
          emit('update:show', false)
        }, 2000)
        return
      }
      throw new Error(errorData.error || 'Failed to update country override')
    }

    const result = await response.json()
    emit('parameter-updated', result.config)
    editingOverride.value = null
    error.value = ''
  } catch (error) {
    console.error('Error updating country override:', error)
    error.value = error.message
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1f2c;
  border-radius: 8px;
  width: 90%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #363c4c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  color: #8b92a5;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-body {
  padding: 1rem;
}

.country-override-form {
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  gap: 0.5rem;
}

.form-group input {
  flex: 1;
  padding: 0.5rem;
  background-color: #262b38;
  border: 1px solid #363c4c;
  border-radius: 4px;
  color: white;
}

.add-override-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.country-overrides-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.override-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #262b38;
  border-radius: 4px;
  gap: 1rem;
}

.override-country {
  font-weight: bold;
  color: #4c5fff;
  width: 60px;
}

.override-value {
  flex: 1;
  color: #fff;
}

.delete-override-button {
  background: none;
  border: none;
  color: #ff4c4c;
  cursor: pointer;
  padding: 0.5rem;
}

.no-overrides {
  text-align: center;
  color: #8b92a5;
  padding: 1rem;
}

.error-message {
  color: #ff4c4c;
  margin-top: 1rem;
  text-align: center;
}

.override-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-action-button {
  background: none;
  border: none;
  color: #8b92a5;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-action-button:hover {
  color: #fff;
}

.edit-action-button.accept {
  color: #4CAF50;
}

.edit-action-button.cancel {
  color: #9e9e9e;
}

.override-country input,
.override-value input {
  width: 100%;
  padding: 0.5rem;
  background-color: #262b38;
  border: 1px solid #363c4c;
  border-radius: 4px;
  color: white;
}

@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
  }
  
  .add-override-button {
    width: 100%;
  }
  
  .override-item {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  
  .override-country {
    width: auto;
    min-width: 60px;
  }
  
  .override-value {
    flex: 1;
    min-width: 100px;
  }
  
  .override-actions {
    width: 100%;
    justify-content: center;
    padding-top: 0.5rem;
  }

  .edit-action-button,
  .delete-override-button {
    transform: scale(1.5);
    padding: 0.25rem 1rem;
  }
  
  .override-country input,
  .override-value input {
    width: 100%;
    min-width: unset;
  }
}
</style> 