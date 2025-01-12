import { ref } from 'vue'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
const error = ref(null)
const loading = ref(false)
const isReady = ref(false)

onAuthStateChanged(auth, (_user) => {
  user.value = _user
  isReady.value = true
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

  const getToken = async () => {
    if (user.value) {
      return await user.value.getIdToken()
    }
    throw new Error('User is not authenticated')
  }

  return {
    user,
    error,
    loading,
    isReady,
    login,
    logout,
    getToken
  }
}

export { useAuth } 