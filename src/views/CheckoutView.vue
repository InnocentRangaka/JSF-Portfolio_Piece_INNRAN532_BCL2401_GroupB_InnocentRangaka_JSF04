<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useUserStore } from '../stores/userStore'
import { loadScript } from "@paypal/paypal-js";

import NoItemFound from '../components/includes/NoItemFound.vue'
import CheckoutSkeleton from '../components/cart/CheckoutSkeleton.vue'

const router = useRouter();
const appStore = useAppStore()
const userStore = useUserStore()

const { cart, shippingCost, updateCart, updateShipping, placeOrder, saveOrder } = appStore;

const subTotalAmount = computed(() => appStore.cart.subTotalAmount),
  totalAmount = computed(() => appStore.cart.totalAmount),
  totalItems = computed(() => appStore.cart.totalItems),
  currentCartItems = computed(() => appStore.cart.cartItems),
  shippingMethod = computed(() => appStore.shippingMethod),
  paymentMethod = computed(() => appStore.paymentMethod),
  shippingRate = computed(() => appStore.shippingRate),
  taxAmount = computed(() => appStore.cart.taxAmount),
  user = computed(() => userStore.user);

const address1 = user.value ? `${user.value.address.number} ${user.value.address.street}` : '',
  state1 = `${user.value.address.geolocation.lat},${user.value.address.geolocation.long}`,
  street = ref(address1),
  apartment = ref(''),
  city = ref(user.value.address.city),
  countryCode = ref('ZA'),
  state = ref(state1),
  zipCode = ref(user.value.address.zipcode);

const ShippingAddress = {
    street: street.value,
    apartment: apartment.value,
    city: city.value,
    countryCode: countryCode.value,
    state: state.value,
    zipCode: zipCode.value,
  }

const loading = ref(true),
  isCancelOrder = ref(false),
  cancelOrderId = ref(''),
  showCancelConfirmation = ref(false),
  isReloadPage = ref(false),
  isPaymentConfirmed = ref(false),
  orderNumber = ref('');

  console.log(user.value, currentCartItems)
  // saveCart(user.value.id, currentCartItems)

const initiateCart = () => {
  const { cartItems, totalItems, subTotalAmount, taxAmount, totalAmount } = cart
  // cart.addToCartText = cart.addToCartText
  cart.shippingRate = shippingRate
  cart.shippingMethod = shippingMethod
  cart.cartItems = cartItems
  cart.totalItems = totalItems
  cart.subTotalAmount = subTotalAmount
  cart.taxAmount = taxAmount
  cart.totalAmount = totalAmount
  cart.paymentMethod = paymentMethod

  updateShippingMethod(shippingCost.standard)
}

// Methods
const updateShippingMethod = (method) => {
  updateShipping(method, appStore)
};

function useCountdownRedirect() {
  const countdown = ref(5); // Start countdown from 5 seconds

  const startCountdown = (redirectTo = '/', delayBy = 0) => {
    const seconds = delayBy * 1000;
    setTimeout(() => {
      const interval = setInterval(() => {
        countdown.value--; // Decrement countdown

        if (countdown.value <= 0) {
          clearInterval(interval); // Stop the interval when countdown reaches 0
          router.push(redirectTo); // Redirect to the home page
        }
      }, 1000); // Set interval to 1 second (1000 milliseconds)
    }, seconds);
  };

  return { countdown, startCountdown };
}

const { countdown, startCountdown } = useCountdownRedirect();

const paypalContainer = ref(null); // Reference to the PayPal button container

const loadPayPalScript = async () => {
  try {
    const paypal = await loadScript({
      'client-id': 'AW9BIhl6UaPp_pZ3QQA2plOVUUm54Q7q6DAjNySk8lkxe4euv4EoH2oEMBg5y29LqbmkBCrTBUHdu81c',  // Replace with your actual client ID
      currency: 'USD',
    });

    if (paypal && totalItems.value > 0) {
      renderPayPalButtons(paypal);
    }
  } catch (error) {
    console.error('Failed to load PayPal SDK:', error);
  }
};

const renderPayPalButtons = (paypal) => {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalAmount.value,
            }
          },
        ],
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then((details) => {
        const paymentInfo = {
          ...details,
          billingToken: data.billingToken,
          paymentMethod: data.paymentSource,
          facilitatorAccessToken: data.facilitatorAccessToken,
        }

        orderNumber.value = details.id;

        const paypalOverlay = document.querySelector('.paypal-checkout-sandbox')

        if(paypalOverlay){
          paypalOverlay.remove()
        }

        isPaymentConfirmed.value = placeOrder(user.value.id, appStore.cart, paymentInfo, ShippingAddress);
        startCountdown(`/order/${orderNumber.value}`);

        // alert('Transaction completed by ' + details.payer.name.given_name);

        console.log('orders', appStore.orders)
      });
    },
    onCancel: (data) => {
        // Show a cancel page, or return to cart
        // window.location.assign("/your-cancel-page");
        cancelOrderId.value = data.orderID;
        isCancelOrder.value = true;
    },
    onError: (err) => {
      // console.error('PayPal Checkout onError:', err);
      if(!isCancelOrder.value) isReloadPage.value = true;
    },
  }).render(paypalContainer.value);  // Render the PayPal button in the container
};

onMounted(() => {
  initiateCart()
  updateShippingMethod(shippingCost.standard)

  // Load PayPal script and render PayPal buttons if PayPal is selected
  if (appStore.paymentMethod === 'paypal') {
    loadPayPalScript();
  }

  setTimeout(() => {
    loading.value = false;
  }, 2000);
})

watch(
  shippingMethod,
  (newMethod) => {
    // console.log('newMethod:', newMethod)
    const { cartItems } = cart
    updateCart(cartItems)
  },
  { deep: true }
)

watch(
  paymentMethod,
  (newMethod) => {
    // console.log('newPaymentMethod:', newMethod)
    const { cartItems } = cart
    updateCart(cartItems)
    if (newMethod === 'paypal') {
      loadPayPalScript();
    }
  },
  { deep: true }
)

function retryPayment() {
  // Trigger the payment retry logic
  // alert('Retrying payment...');
  isCancelOrder.value = false;  // Close the modal after retry
}

function confirmCancellation() {
  // Show the confirmation dialog for order cancellation
  showCancelConfirmation.value = true;
  isCancelOrder.value = false;
}

function cancelOrder() {
  const paymentInfo = {
    status: 'cancelled',
    id: cancelOrderId,
  }

  saveOrder(user.value.id, appStore.cart, paymentInfo, ShippingAddress);

  // Trigger the order cancellation logic
  alert('Order has been cancelled.');
  showCancelConfirmation.value = false;
  isCancelOrder.value = false;  // Close both modals
}

function closeCancellationConfirmation() {
  // Close the cancellation confirmation dialog
  showCancelConfirmation.value = false;
}

function reloadPage() {
  window.location.reload();  // Reloads the current page
}

function navigateTo(path){
  router.push(path);
}

</script>

<template>

  <CheckoutSkeleton  v-if="loading" />

  <div v-show="!loading">
    <div class="bg-gray-100 mb-10">
      <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
        <h1 class="text-gray-800 text-xl font-bold my-2">Checkout</h1>
        <div class="mb-2 text-xs text-right flex items-end ml-auto">
          <router-link to="/" class="cursor-pointer text-gray-900 hover:text-cyan-900 hover:underline">
            <span class="flex h-full items-center text-xs text-right">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
              </svg>
              <span class="mb-[0.1rem]">Continue shopping</span>
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="totalItems > 0" v-show="!loading" class="container mx-auto text-gray-800 mb-10">
      <!-- <h1 class="text-3xl font-bold mb-6">Checkout</h1> -->

      <div class="flex flex-col lg:flex-row gap-3">
        <!-- Contact and Shipping Information -->
        <div class="w-full lg:w-1/2 h-fit bg-white p-8 rounded-lg shadow-md ">
          <h2 class="text-xl font-bold mb-4">Contact Information</h2>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Email address</label>
            <input v-model="user.email" type="email" id="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email">
          </div>
          <h2 class="text-xl font-bold mb-4">Shipping Information</h2>
          <div class="flex gap-4 mb-4">
            <div class="w-1/2">
              <label for="first-name" class="block text-gray-700 font-bold mb-2">First name</label>
              <input v-model="user.name.firstname" type="text" id="first-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your first name">
            </div>
            <div class="w-1/2">
              <label for="last-name" class="block text-gray-700 font-bold mb-2">Last name</label>
              <input v-model="user.name.lastname" type="text" id="last-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your last name">
            </div>
          </div>
          <div class="mb-4">
            <label for="company" class="block text-gray-700 font-bold mb-2">Company</label>
            <input type="text" id="company" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your company name">
          </div>
          <div class="mb-4">
            <label for="address" class="block text-gray-700 font-bold mb-2">Address</label>
            <input  v-model="street" type="text" id="address" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your address">
          </div>
          <div class="mb-4">
            <label for="apartment" class="block text-gray-700 font-bold mb-2">Apartment, suite, etc.</label>
            <input v-model="apartment" type="text" id="apartment" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter apartment, suite, etc.">
          </div>
          <div class="flex gap-4 mb-4">
            <div class="w-1/2">
              <label for="city" class="block text-gray-700 font-bold mb-2">City</label>
              <input v-model="city" type="text" id="city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your city">
            </div>
            <div class="w-1/2">
              <label for="country" class="block text-gray-700 font-bold mb-2">Country</label>
              <select v-model="countryCode" id="country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="ZA">South Africa</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>
          <div class="flex gap-4 mb-4">
            <div class="w-1/2">
              <label for="state" class="block text-gray-700 font-bold mb-2">State/Province</label>
              <input v-model="state" type="text" id="state" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your state/province">
            </div>
            <div class="w-1/2">
              <label for="postal-code" class="block text-gray-700 font-bold mb-2">Postal code</label>
              <input v-model="zipCode" type="text" id="postal-code" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your postal code">
            </div>
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-gray-700 font-bold mb-2">Phone</label>
            <input type="tel" id="phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your phone number">
          </div>
        </div>

        <!-- Order Summary -->
        <div class="w-full lg:w-1/2 h-fit sticky flex flex-col gap-3">
          <div class="text-gray-700 bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Delivery Method</h2>
            <div class="flex gap-4 mb-4">
              <div class="flex flex-col w-1/2 border rounded p-4">
                <div class="flex items-center">
                  <input type="radio" id="standard" name="delivery" class="mr-2" value="standard" 
                    x-model="cart.shippingMethod" 
                    @change="updateShippingMethod('standard')"
                    checked
                  >
                  <label for="standard" class="font-bold">Standard</label>
                </div>
                <p class="text-gray-700">4-10 business days</p>
                <p class="font-bold">$5.00</p>
              </div>
              <div class="flex flex-col w-1/2 border rounded p-4">
                <div class="flex items-center">
                  <input type="radio" id="express" name="delivery" class="mr-2" value="express"
                    @change="updateShippingMethod('express')" 
                    x-model="cart.shippingMethod"
                  >
                  <label for="express" class="font-bold">Express</label>
                </div>
                <p class="text-gray-700">2-5 business days</p>
                <p class="font-bold">$16.00</p>
              </div>
            </div>
          </div>
          <div class="text-gray-700 bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Order Summary</h2>
            <div class="border rounded-lg p-4 mb-4 ">
              <div v-for="(cartItem, index) in currentCartItems" :key="cartItem.id" class="flex justify-between mb-4">
                <img
                      :src="cartItem.image"
                      :alt="cartItem.title"
                      class="w-20 h-auto max-h-19 object-cover mt-[0.35rem] self-start"
                    />
                <div class="flex-1 mx-4">
                  <p class="font-semibold text-ellipsis overflow-hidden break-words line-clamp-2">{{ cartItem.title }}</p>
                  <!-- <p class="text-gray-700 text-ellipsis overflow-hidden break-words line-clamp-1">{{ cartItem.description }}</p> -->
                  <p class="text-gray-700">Quantity: {{ cartItem.quantity }}</p>
                </div>
                <div>
                  <p class="font-bold">$ {{ cartItem.totalPrice }}</p>
                </div>
              </div>

              <div class="flex justify-between mb-4">
                <div>
                  <p class="font-bold">Subtotal</p>
                </div>
                <div>
                  <p class="font-bold">$ {{ subTotalAmount }}</p>
                </div>
              </div>
              <div class="flex justify-between mb-4">
                <div>
                  <p class="font-bold">Shipping</p>
                </div>
                <div>
                  <p class="font-bold">$ {{ shippingRate }}</p>
                </div>
              </div>
              <div class="flex justify-between mb-4">
                <div>
                  <p class="font-bold">Tax</p>
                </div>
                <div>
                  <p class="font-bold">$ {{ taxAmount }}</p>
                </div>
              </div>
              <div class="flex justify-between mb-4">
                <div>
                  <p class="font-bold text-xl">Total</p>
                </div>
                <div>
                  <p class="font-bold text-xl">$ {{ totalAmount }}</p>
                </div>
              </div>
            </div>
            <div v-if="appStore.paymentMethod === 'paypal'"  ref="paypalContainer" id="paypal-button-container" class="mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <NoItemFound v-if="totalItems == 0" v-show="!loading" name="checkout" />

  <div v-if="isPaymentConfirmed" class="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 class="text-gray-700 text-2xl font-semibold mb-4">Payment successful</h2>
      <p class="text-gray-700 mb-2">Thank you for your order <strong>#{{ orderNumber }}</strong>!</p>
      <p class="text-gray-700 mb-4">We will email you confirmation shortly. You will automatically be redirected to your order in {{ countdown }}</p>
      <div class="flex justify-end space-x-4">
        <button @click="navigateTo('/')" class="text-gray-700 px-4 py-2 rounded hover:bg-red-500 hover:text-white">Continue Shopping</button>
        <button @click="navigateTo(`/order/${orderNumber}`)" class="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-blue-700">Track Your Order</button>
      </div>
    </div>
  </div>

  <div v-if="isCancelOrder" class="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 class="text-gray-700 text-2xl font-semibold mb-4">Payment failed</h2>
      <p class="text-gray-700 mb-4">Unfortunately, your payment did not go through. Would you like to try again or cancel the order?</p>
      <div class="flex justify-end space-x-4">
        <button @click="confirmCancellation" class="text-gray-700 px-4 py-2 rounded hover:bg-red-500 hover:text-white">Cancel Order</button>
        <button @click="retryPayment" class="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-blue-700">Try Again</button>
      </div>
    </div>
  </div>
  
  <!-- Order Cancellation Confirmation Modal -->
  <div v-if="showCancelConfirmation" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 class="text-gray-700 text-2xl font-semibold mb-4">Confirm cancellation</h2>
      <p class="text-gray-700 mb-4">Are you sure you want to cancel your order?</p>
      <div class="flex justify-end space-x-4">
        <button @click="cancelOrder" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Yes, Cancel Order</button>
        <button @click="closeCancellationConfirmation" class="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-blue-700">No, Cancel</button>
      </div>
    </div>
  </div>

  <div v-if="isReloadPage" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 class="text-gray-700 text-2xl font-semibold mb-4">Something went wrong</h2>
      <p class="text-gray-700 mb-4">An error occurred. Please try reloading the page.</p>
      <div class="flex justify-end space-x-4">
        <button @click="reloadPage" class="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-blue-700">
          Reload Page
        </button>
      </div>
    </div>
  </div>

</template>
