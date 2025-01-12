<template>
  <div class="signin-container">
    <div class="signin-content">
      <div class="logo">
        <img src="../assets/images/icon.png" alt="Logo" width="150" height="150" />
      </div>
      
      <h1>Please sign in</h1>
      
      <div class="form-group">
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="E-mail address"
          :disabled="loading"
        />
      </div>
      
      <div class="form-group">
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Password"
          :disabled="loading"
        />
      </div>
      
      <button @click="handleSignIn" :disabled="loading" class="signin-button">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
      
      <p v-if="error" class="error-message">{{ error }}</p>
      
      <div class="copyright">
        Codeway © 2021
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { login, error: authError, loading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password'
    return
  }

  error.value = ''
  await login(email.value, password.value)
  
  if (authError.value) {
    if (authError.value.includes('auth/invalid-credential')) {
      error.value = 'Invalid email or password'
    } else {
      error.value = 'Failed to sign in. Please try again.'
    }
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.signin-container {
    
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1f2c;
}

.signin-content {
  width: 300px;
  max-width: 400px;
  text-align: center;
}

.logo {
  margin-bottom: 2rem;
}

h1 {
  color: #8b92a5;
  font-weight: normal;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

input {
  width: 100%;
  padding: 12px;
  background-color: #262b38;
  border: 1px solid #363c4c;
  border-radius: 4px;
  font-size: 16px;
  color: white;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #7e57ff;
}

input::placeholder {
  color: #8b92a5;
}

.signin-button {
  width: 100%;
  padding: 12px;
  background-color: #4c5fff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.signin-button:hover {
  background-color: #3f51ff;
}

.signin-button:disabled {
  background-color: #363c4c;
  cursor: not-allowed;
}

.error-message {
  color: #ff4c4c;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.copyright {
  color: #8b92a5;
  font-size: 0.9rem;
  margin-top: 5rem;
}
</style> 