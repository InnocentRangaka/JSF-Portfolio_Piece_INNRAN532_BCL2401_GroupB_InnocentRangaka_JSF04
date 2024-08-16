<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useUserStore } from '../stores/userStore'
import { parseObjectToArray } from '../utils/utils'
import { loadScript } from "@paypal/paypal-js";

const appStore = useAppStore()
const userStore = useUserStore()

const { cart, shippingCost, updateCart, updateShipping, updatePaymentMethod } = appStore;

const subTotalAmount = computed(() => appStore.cart.subTotalAmount),
  totalAmount = computed(() => appStore.cart.totalAmount),
  totalItems = computed(() => appStore.cart.totalItems),
  currentCartItems = computed(() => appStore.cart.cartItems),
  shippingMethod = computed(() => appStore.shippingMethod),
  paymentMethod = computed(() => appStore.paymentMethod),
  shippingRate = computed(() => appStore.shippingRate),
  taxAmount = computed(() => appStore.cart.taxAmount),
  user = computed(() => userStore.user);

  const address1 = user.value ? `${user.value.address.number} ${user.value.address.street}` : '';


  console.log(user.value)

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

const paypalContainer = ref(null); // Reference to the PayPal button container

const loadPayPalScript = async () => {
  try {
    const paypal = await loadScript({
      'client-id': 'AW9BIhl6UaPp_pZ3QQA2plOVUUm54Q7q6DAjNySk8lkxe4euv4EoH2oEMBg5y29LqbmkBCrTBUHdu81c',  // Replace with your actual client ID
      currency: 'USD',
    });

    if (paypal) {
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
            },
            cart: JSON.stringify(currentCartItems.value),
          },
        ],
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then((details) => {
        alert('Transaction completed by ' + details.payer.name.given_name);
        placeOrder(details);
      });
    },
    onCancel: (data) => {
        // Show a cancel page, or return to cart
        // window.location.assign("/your-cancel-page");
        console.log('Cancelled Order:', data)
    },
    onError: (err) => {
      console.error('PayPal Checkout onError:', err);
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

const placeOrder = (details) => {
  // Logic for placing the order
  alert('Order placed successfully!');
  console.log(details)
};
</script>

<template>
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

  <div class="max-w-6xl mx-auto text-gray-800 bg-white p-8 rounded-lg shadow-md mb-4">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <div class="flex flex-col lg:flex-row gap-6 sm:gap-x-10 sm:gap-y-6 ">
      <!-- Contact and Shipping Information -->
      <div class="w-full lg:w-1/2">
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
          <input  v-model="address1" type="text" id="address" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your address">
        </div>
        <div class="mb-4">
          <label for="apartment" class="block text-gray-700 font-bold mb-2">Apartment, suite, etc.</label>
          <input type="text" id="apartment" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter apartment, suite, etc.">
        </div>
        <div class="flex gap-4 mb-4">
          <div class="w-1/2">
            <label for="city" class="block text-gray-700 font-bold mb-2">City</label>
            <input v-model="user.address.city" type="text" id="city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your city">
          </div>
          <div class="w-1/2">
            <label for="country" class="block text-gray-700 font-bold mb-2">Country</label>
            <select id="country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="south-africa">South Africa</option>
              <option value="united-states">United States</option>
              <option value="canada">Canada</option>
            </select>
          </div>
        </div>
        <div class="flex gap-4 mb-4">
          <div class="w-1/2">
            <label for="state" class="block text-gray-700 font-bold mb-2">State/Province</label>
            <input type="text" id="state" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your state/province">
          </div>
          <div class="w-1/2">
            <label for="postal-code" class="block text-gray-700 font-bold mb-2">Postal code</label>
            <input v-model="user.address.zipcode" type="text" id="postal-code" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your postal code">
          </div>
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-gray-700 font-bold mb-2">Phone</label>
          <input type="tel" id="phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your phone number">
        </div>
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

      <!-- Order Summary -->
      <div class="w-full lg:w-1/2 text-gray-700">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        <div class="border rounded-lg p-4 mb-4 ">
          <div v-for="(cartItem, index) in currentCartItems" :key="cartItem.id" class="flex justify-between mb-4">
            <img
                  :src="cartItem.image"
                  :alt="cartItem.title"
                  class="w-20 h-20 object-cover mt-[0.35rem] self-start"
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
</template>
