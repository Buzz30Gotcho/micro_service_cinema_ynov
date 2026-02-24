<template>
  <div class="min-h-screen bg-dark-bg text-light-text flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-light-text mb-2">Paiement</h2>
          <p class="text-muted-text">Finalisez votre réservation en effectuant le paiement</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="text-muted-text">
            <Loader2 :size="32" class="animate-spin mx-auto" />
            <p class="mt-2">Chargement...</p>
          </div>
        </div>

        <!-- Payment Form -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Payment Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Payment Method -->
            <div class="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 class="text-xl font-bold text-light-text mb-4 flex items-center gap-2">
                <CreditCard :size="24" class="text-primary-accent" />
                Mode de paiement
              </h3>
              
              <div class="space-y-3">
                <label 
                  v-for="method in paymentMethods" 
                  :key="method.id"
                  class="flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer"
                  :class="selectedPaymentMethod === method.id ? 'border-primary-accent bg-primary-accent/10' : 'border-dark-border hover:border-primary-accent/50'"
                >
                  <input 
                    type="radio" 
                    :value="method.id" 
                    v-model="selectedPaymentMethod"
                    class="w-4 h-4 text-primary-accent"
                  >
                  <component :is="method.icon" :size="24" class="text-primary-accent" />
                  <div class="flex-1">
                    <div class="font-semibold text-light-text">{{ method.name }}</div>
                    <div class="text-sm text-muted-text">{{ method.description }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Card Details (if card selected) -->
            <div v-if="selectedPaymentMethod === 'card'" class="bg-dark-card rounded-xl border border-dark-border p-6">
              <h3 class="text-xl font-bold text-light-text mb-4">Informations de carte</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-muted-text mb-2">
                    Numéro de carte <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    v-model="cardNumber"
                    @input="formatCardNumber($event.target.value)"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    required
                    class="w-full px-4 py-3 bg-dark-bg border rounded-lg text-light-text focus:outline-none focus:border-primary-accent transition-colors"
                    :class="cardErrors.cardNumber ? 'border-red-500' : 'border-dark-border'"
                  >
                  <p v-if="cardErrors.cardNumber" class="text-red-500 text-xs mt-1">{{ cardErrors.cardNumber }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-muted-text mb-2">
                      Date d'expiration <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="expiryDate"
                      @input="formatExpiryDate($event.target.value)"
                      placeholder="MM/AA"
                      maxlength="5"
                      required
                      class="w-full px-4 py-3 bg-dark-bg border rounded-lg text-light-text focus:outline-none focus:border-primary-accent transition-colors"
                      :class="cardErrors.expiryDate ? 'border-red-500' : 'border-dark-border'"
                    >
                    <p v-if="cardErrors.expiryDate" class="text-red-500 text-xs mt-1">{{ cardErrors.expiryDate }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm text-muted-text mb-2">
                      CVV <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="cvv"
                      @input="onCVVInput"
                      placeholder="123"
                      maxlength="3"
                      required
                      class="w-full px-4 py-3 bg-dark-bg border rounded-lg text-light-text focus:outline-none focus:border-primary-accent transition-colors"
                      :class="cardErrors.cvv ? 'border-red-500' : 'border-dark-border'"
                    >
                    <p v-if="cardErrors.cvv" class="text-red-500 text-xs mt-1">{{ cardErrors.cvv }}</p>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm text-muted-text mb-2">
                    Nom sur la carte <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    v-model="cardName"
                    @input="onCardNameInput"
                    placeholder="JOHN DOE"
                    required
                    class="w-full px-4 py-3 bg-dark-bg border rounded-lg text-light-text focus:outline-none focus:border-primary-accent transition-colors uppercase"
                    :class="cardErrors.cardName ? 'border-red-500' : 'border-dark-border'"
                  >
                  <p v-if="cardErrors.cardName" class="text-red-500 text-xs mt-1">{{ cardErrors.cardName }}</p>
                </div>

                <div class="bg-primary-accent/10 border border-primary-accent/30 rounded-lg p-3 mt-4">
                  <p class="text-xs text-muted-text text-center">
                    🔒 Paiement sécurisé - Vos informations sont chiffrées
                  </p>
                </div>
              </div>
            </div>

            <!-- PayPal Info -->
            <div v-if="selectedPaymentMethod === 'paypal'" class="bg-dark-card rounded-xl border border-dark-border p-6">
              <div class="text-center py-8">
                <div class="w-16 h-16 bg-primary-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet :size="32" class="text-primary-accent" />
                </div>
                <p class="text-light-text mb-2">Paiement PayPal (Mode test)</p>
                <p class="text-sm text-muted-text mb-4">Cliquez sur "Payer maintenant" pour valider directement</p>
                <div class="inline-block bg-primary-accent/10 border border-primary-accent/30 rounded px-3 py-1">
                  <p class="text-xs text-muted-text">ℹ️ Simulation de paiement</p>
                </div>
              </div>
            </div>

            <!-- Apple Pay Info -->
            <div v-if="selectedPaymentMethod === 'apple'" class="bg-dark-card rounded-xl border border-dark-border p-6">
              <div class="text-center py-8">
                <div class="w-16 h-16 bg-primary-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone :size="32" class="text-primary-accent" />
                </div>
                <p class="text-light-text mb-2">Apple Pay (Mode test)</p>
                <p class="text-sm text-muted-text mb-4">Cliquez sur "Payer maintenant" pour valider directement</p>
                <div class="inline-block bg-primary-accent/10 border border-primary-accent/30 rounded px-3 py-1">
                  <p class="text-xs text-muted-text">ℹ️ Simulation de paiement</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-dark-card rounded-xl border border-dark-border p-6 sticky top-24">
              <h3 class="text-xl font-bold text-light-text mb-4">Récapitulatif</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex items-start gap-3 pb-4 border-b border-dark-border">
                  <Film :size="20" class="text-primary-accent mt-1" />
                  <div class="flex-1">
                    <div class="text-sm text-muted-text">Film</div>
                    <div class="font-semibold text-light-text">{{ bookingData?.movieTitle || 'Film' }}</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-3 pb-4 border-b border-dark-border">
                  <Calendar :size="20" class="text-primary-accent mt-1" />
                  <div class="flex-1">
                    <div class="text-sm text-muted-text">Date & Heure</div>
                    <div class="font-semibold text-light-text">{{ bookingData?.sessionDate }} à {{ bookingData?.sessionTime }}</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-3 pb-4 border-b border-dark-border">
                  <Armchair :size="20" class="text-primary-accent mt-1" />
                  <div class="flex-1">
                    <div class="text-sm text-muted-text">Places</div>
                    <div class="font-semibold text-light-text">{{ bookingData?.seats?.join(', ') || 'N/A' }}</div>
                    <div class="text-xs text-muted-text mt-1">{{ bookingData?.seats?.length || 0 }} place(s)</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-3 pb-4 border-b border-dark-border">
                  <Ticket :size="20" class="text-primary-accent mt-1" />
                  <div class="flex-1">
                    <div class="text-sm text-muted-text">Prix unitaire</div>
                    <div class="font-semibold text-light-text">{{ bookingData?.pricePerSeat?.toFixed(2) || '12.50' }} €</div>
                  </div>
                </div>
              </div>
              
              <!-- Student discount checkbox -->
              <div class="bg-primary-accent/10 border border-primary-accent/30 rounded-lg p-4 mb-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    v-model="isStudent" 
                    type="checkbox"
                    class="w-5 h-5 rounded border-primary-accent bg-dark-bg cursor-pointer"
                  />
                  <div>
                    <div class="font-semibold text-light-text">Je suis étudiant</div>
                    <div class="text-xs text-muted-text">-3€ par place</div>
                  </div>
                </label>
              </div>
              
              <div class="flex justify-between items-center py-4 border-t-2 border-primary-accent">
                <span class="text-lg font-bold text-light-text">Total</span>
                <div class="text-right">
                  <div v-if="isStudent" class="text-sm text-green-500 mb-1">Prix réduit étudiant</div>
                  <span class="text-2xl font-bold text-primary-accent">{{ totalAmount.toFixed(2) }} €</span>
                </div>
              </div>
              
              <button 
                @click="processPayment"
                :disabled="!canPay || processing"
                class="w-full mt-6 px-6 py-3 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 v-if="processing" :size="20" class="animate-spin" />
                <Lock v-else :size="20" />
                {{ processing ? 'Paiement en cours...' : 'Payer maintenant' }}
              </button>

              <p v-if="selectedPaymentMethod === 'card' && !canPay && !processing" class="text-xs text-red-400 text-center mt-2">
                Veuillez remplir tous les champs requis
              </p>
              
              <p class="text-xs text-muted-text text-center mt-4">
                Paiement sécurisé • Vos données sont protégées
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings.store'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Film, 
  Calendar, 
  Armchair, 
  Ticket, 
  Lock,
  Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()

const loading = ref(true)
const processing = ref(false)
const bookingData = ref(null)
const isStudent = ref(false)

// Payment methods
const paymentMethods = [
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paiement sécurisé via PayPal',
    icon: Wallet
  },
  {
    id: 'apple',
    name: 'Apple Pay',
    description: 'Paiement rapide avec Apple Pay',
    icon: Smartphone
  }
]

const selectedPaymentMethod = ref('card')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardName = ref('')
const cardErrors = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: ''
})

// Validation helpers
const validateCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '')
  if (!cleaned) return 'Le numéro de carte est requis'
  if (!/^\d+$/.test(cleaned)) return 'Le numéro doit contenir uniquement des chiffres'
  if (cleaned.length < 16) return 'Le numéro doit contenir 16 chiffres'
  if (cleaned.length > 16) return 'Le numéro ne doit pas dépasser 16 chiffres'
  return ''
}

const validateExpiryDate = (date) => {
  if (!date) return 'La date d\'expiration est requise'
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
  if (!regex.test(date)) return 'Format invalide (MM/AA)'
  
  const [month, year] = date.split('/')
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const now = new Date()
  if (expiry < now) return 'Carte expirée'
  return ''
}

const validateCVV = (cvvValue) => {
  if (!cvvValue) return 'Le CVV est requis'
  if (!/^\d{3}$/.test(cvvValue)) return 'Le CVV doit contenir 3 chiffres'
  return ''
}

const validateCardName = (name) => {
  if (!name) return 'Le nom du titulaire est requis'
  if (name.length < 3) return 'Le nom doit contenir au moins 3 caractères'
  return ''
}

// Format card number with spaces
const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, '')
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
  cardNumber.value = formatted.substring(0, 19) // Max 16 digits + 3 spaces
  cardErrors.value.cardNumber = validateCardNumber(cardNumber.value)
}

// Format expiry date
const formatExpiryDate = (value) => {
  let cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
  }
  expiryDate.value = cleaned
  cardErrors.value.expiryDate = validateExpiryDate(expiryDate.value)
}

// Validate CVV
const onCVVInput = () => {
  cvv.value = cvv.value.replace(/\D/g, '').substring(0, 3)
  cardErrors.value.cvv = validateCVV(cvv.value)
}

// Validate card name
const onCardNameInput = () => {
  cardErrors.value.cardName = validateCardName(cardName.value)
}

const totalAmount = computed(() => {
  if (!bookingData.value) return 0
  const seatCount = bookingData.value.seats?.length || 0
  let price = bookingData.value.pricePerSeat || 12.50
  
  // Appliquer réduction étudiant (-3€ par place)
  if (isStudent.value) {
    price = Math.max(0, price - 3)
  }
  
  return seatCount * price
})

const canPay = computed(() => {
  // Pour les méthodes autres que carte, pas de validation
  if (selectedPaymentMethod.value !== 'card') return true
  
  // Pour carte bancaire, valider tous les champs
  return !validateCardNumber(cardNumber.value) &&
         !validateExpiryDate(expiryDate.value) &&
         !validateCVV(cvv.value) &&
         !validateCardName(cardName.value)
})

onMounted(() => {
  // Récupérer les données de réservation depuis le state du router ou localStorage
  const state = window.history.state
  if (state?.bookingData) {
    bookingData.value = state.bookingData
  } else {
    const savedData = localStorage.getItem('pendingBooking')
    if (savedData) {
      bookingData.value = JSON.parse(savedData)
    } else {
      // Pas de données, rediriger vers la page de réservation
      router.push('/booking')
      return
    }
  }
  
  loading.value = false
})

const processPayment = async () => {
  processing.value = true
  
  try {
    // Validation basique
    if (!bookingData.value || !bookingData.value.sessionId) {
      throw new Error('Données de réservation manquantes')
    }

    // Préparer les données de paiement pour le serveur
    const paymentData = {
      reservationId: bookingData.value.reservationId || null,
      amount: totalAmount.value,
      paymentMethod: selectedPaymentMethod.value,
      cardLastDigits: cardNumber.value ? cardNumber.value.slice(-4) : null,
      cardHolderName: cardName.value || null,
    }

    console.log('Données de paiement envoyées:', paymentData)
    console.log('Données de réservation:', bookingData.value)

    // Appeler le serveur pour traiter le paiement
    const paymentResult = await bookingsStore.processPayment(paymentData)
    console.log('Réponse paiement complète:', paymentResult)
    console.log('Type de status:', typeof paymentResult?.status)
    console.log('Valeur de status:', paymentResult?.status)

    if (!paymentResult || paymentResult.status !== 'completed') {
      console.error('Paiement échoué:', {
        paymentResult,
        status: paymentResult?.status,
        failureReason: paymentResult?.failureReason,
        failure_reason: paymentResult?.failure_reason
      })
      throw new Error(paymentResult?.failureReason || paymentResult?.failure_reason || 'Erreur lors du paiement')
    }

    // Créer les réservations après paiement réussi
    const bookingPromises = []
    const failedBookings = []
    
    for (const seatCode of bookingData.value.seats) {
      const bookingPayload = {
        name: bookingData.value.userName,
        email: bookingData.value.userEmail,
        seanceId: bookingData.value.sessionId,
        seatNumber: seatCode,
        price: bookingData.value.pricePerSeat,
      }
      bookingPromises.push(
        bookingsStore.createBooking(bookingPayload).catch(error => {
          console.error('Erreur réservation:', error)
          failedBookings.push(seatCode)
        })
      )
    }
    
    await Promise.all(bookingPromises)
    
    // Nettoyer les données temporaires
    localStorage.removeItem('pendingBooking')
    
    if (failedBookings.length > 0) {
      alert(`Paiement effectué mais certaines réservations ont échoué pour les places : ${failedBookings.join(', ')}.`)
    }
    
    // Sauvegarder les données complètes pour la page de succès
    localStorage.setItem('completedBooking', JSON.stringify({
      bookingData: bookingData.value,
      paymentMethod: selectedPaymentMethod.value,
      amount: totalAmount.value,
      paymentId: paymentResult.id
    }))
    
    // Rediriger vers la page de confirmation (succès)
    setTimeout(() => {
      router.push('/payment/success')
    }, 100)
  } catch (error) {
    console.error('Erreur de paiement:', error)
    alert(`Erreur lors du paiement: ${error.message}`)
  } finally {
    processing.value = false
  }
}
</script>
