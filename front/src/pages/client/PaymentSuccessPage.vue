<template>
  <div class="min-h-screen bg-dark-bg text-light-text flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Success Icon -->
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle :size="48" class="text-green-500" />
          </div>
          <h1 class="text-4xl font-bold text-light-text mb-2">Paiement réussi !</h1>
          <p class="text-lg text-muted-text">Votre réservation a été confirmée</p>
        </div>

        <!-- Booking Details -->
        <div class="bg-dark-card rounded-xl border border-dark-border p-8 mb-6">
          <h2 class="text-2xl font-bold text-light-text mb-6 flex items-center gap-2">
            <Ticket :size="24" class="text-primary-accent" />
            Détails de votre réservation
          </h2>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
              <span class="text-muted-text">Film</span>
              <span class="font-semibold text-light-text">{{ bookingData?.movieTitle || '✓ Réservation confirmée' }}</span>
            </div>
            
            <div v-if="bookingData?.sessionDate" class="flex justify-between items-center py-3 border-b border-dark-border">
              <span class="text-muted-text">Date & Heure</span>
              <span class="font-semibold text-light-text">{{ bookingData.sessionDate }} à {{ bookingData.sessionTime }}</span>
            </div>
            
            <div v-if="bookingData?.room" class="flex justify-between items-center py-3 border-b border-dark-border">
              <span class="text-muted-text">Salle</span>
              <span class="font-semibold text-light-text">Salle {{ bookingData.room }}</span>
            </div>
            
            <div v-if="bookingData?.seats?.length" class="flex justify-between items-center py-3 border-b border-dark-border">
              <span class="text-muted-text">Places</span>
              <span class="font-semibold text-light-text">{{ bookingData.seats.join(', ') }}</span>
            </div>
            
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
              <span class="text-muted-text">Mode de paiement</span>
              <span class="font-semibold text-light-text">{{ getPaymentMethodName() }}</span>
            </div>
            
            <div class="flex justify-between items-center py-4 border-t-2 border-primary-accent">
              <span class="text-lg font-bold text-light-text">Total payé</span>
              <span class="text-2xl font-bold text-primary-accent">{{ (amount || 0).toFixed(2) }} €</span>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        <div class="bg-dark-card rounded-xl border border-dark-border p-8 mb-6">
          <h3 class="text-xl font-bold text-light-text mb-4 text-center">Votre billet électronique</h3>
          <div class="flex justify-center mb-4">
            <div class="w-48 h-48 bg-white p-4 rounded-lg">
              <div 
                class="w-full h-full bg-dark-bg opacity-80"
                :style="{
                  backgroundImage: 'linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(315deg, #000 25%, transparent 25%)',
                  backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
                  backgroundSize: '10px 10px',
                  backgroundRepeat: 'repeat'
                }"
              ></div>
            </div>
          </div>
          <p class="text-center text-sm text-muted-text">
            Présentez ce QR code à l'entrée du cinéma
          </p>
        </div>

        <!-- Confirmation Email -->
        <div class="bg-primary-accent/10 border border-primary-accent/30 rounded-xl p-6 mb-8">
          <div class="flex items-start gap-3">
            <Mail :size="24" class="text-primary-accent mt-1" />
            <div>
              <p class="font-semibold text-light-text">Email de confirmation envoyé</p>
              <p class="text-sm text-muted-text mt-1">
                Un email de confirmation avec tous les détails de votre réservation vous a été envoyé.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            @click="goToBookings"
            class="flex-1 px-6 py-3 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover transition-all text-center flex items-center justify-center gap-2"
          >
            <Ticket :size="20" />
            Voir mes réservations
          </button>
          
          <button 
            @click="goHome"
            class="flex-1 px-6 py-3 bg-dark-card border border-dark-border text-light-text font-semibold rounded-lg hover:border-primary-accent transition-all text-center flex items-center justify-center gap-2"
          >
            <Film :size="20" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { CheckCircle, Ticket, Mail, Film } from 'lucide-vue-next'

const router = useRouter()

const bookingData = ref(null)
const paymentMethod = ref(null)
const amount = ref(0)

onMounted(() => {
  // Récupérer les données de la réservation complète
  const savedData = localStorage.getItem('completedBooking')
  console.log('Données de réservation complète:', savedData)
  
  if (savedData) {
    const parsed = JSON.parse(savedData)
    bookingData.value = parsed.bookingData
    paymentMethod.value = parsed.paymentMethod
    amount.value = parsed.amount
    console.log('Données de réservation chargées:', bookingData.value)
    console.log('Montant:', amount.value)
    console.log('Méthode de paiement:', paymentMethod.value)
    
    // Nettoyer après récupération
    localStorage.removeItem('completedBooking')
  } else {
    console.log('Aucune donnée trouvée')
  }
})

const getPaymentMethodName = () => {
  const methods = {
    card: 'Carte bancaire',
    paypal: 'PayPal',
    apple: 'Apple Pay'
  }
  return methods[paymentMethod.value] || 'Non spécifié'
}

const goToBookings = () => {
  console.log('Navigation vers mes réservations...')
  router.push('/client/my-bookings')
}

const goHome = () => {
  console.log('Navigation vers l\'accueil...')
  router.push('/')
}
</script>
