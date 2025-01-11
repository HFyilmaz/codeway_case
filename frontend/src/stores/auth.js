import { ref } from 'vue'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

// Create a reactive reference to store the user
const user = ref(null)
const error = ref(null)
const loading = ref(false)

// Initialize auth state listener
onAuthStateChanged(auth, (_user) => {
  user.value = _user
})

const useAuth = () => {
  const login = async (email, password) => {
    error.value = null
    loading.value = true
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      error.value = null
    } catch (err) {
      error.value = err.message
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    user,
    error,
    loading,
    login,
    logout
  }
}

export { useAuth } 