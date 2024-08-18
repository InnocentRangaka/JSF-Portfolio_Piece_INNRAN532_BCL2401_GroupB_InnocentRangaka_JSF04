<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'

import NoItemFound from '../components/includes/NoItemFound.vue'
import CheckoutSkeleton from '../components/cart/CheckoutSkeleton.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const orderId = ref(route.params.id),
user = ref(appStore.user),
loading = ref(true),
{ findOrder } = appStore;

if(orderId.value !== appStore.order.payment.id){
    findOrder(user.value.id, orderId.value)
}

console.log(route)
console.log(appStore.order)

const order = ref(appStore.order),
orderproducts = ref(appStore.order.cart.cartItems),
totalItems = ref(appStore.order.cart.totalItems),
subTotalAmount = ref(appStore.order.cart.subTotalAmount),
shippingRate = ref(appStore.order.cart.shippingRate),
taxAmount = ref(appStore.order.cart.taxAmount),
totalAmount = ref(appStore.order.cart.totalAmount);

const orderTime = ref(appStore.order.payment.created_time),
paymentTime = ref(appStore.order.payment.update_time)



const street = ref(appStore.order.shippingAddress.street),
    apartment = ref(appStore.order.shippingAddress.apartment),
    city = ref(appStore.order.shippingAddress.city),
    countryCode = ref(appStore.order.shippingAddress.countryCode),
    state = ref(appStore.order.shippingAddress.state),
    zipCode = ref(appStore.order.shippingAddress.zipCode);

// console.log(user)

const calculateDate = (input = 'now', baseDate = '') => {
  // Check if the input is 'now'
  if (input === "now") {
    return baseDate ? new Date(baseDate) : new Date();
  }

  // Check if the input is a valid date string (ISO format)
  const parsedDate = Date.parse(input);
  if (!isNaN(parsedDate)) {
    return new Date(parsedDate);
  }

  // Use the baseDate if provided, otherwise default to the current date
  const today = baseDate ? new Date(baseDate) : new Date();

  // Extract the number and the unit (d, m, y) using regex
  const match = input.match(/^(\d+)([dmy])$/);
  
  if (!match) {
    throw new Error("Invalid input format. Please use 'now', 'Xd', 'Xm', 'Xy', or a valid date string format.");
  }
  
  const number = parseInt(match[1], 10);
  const unit = match[2];

  // Calculate the new date based on the unit
  switch (unit) {
    case 'd':
      today.setDate(today.getDate() + number);
      break;
    case 'm':
      today.setMonth(today.getMonth() + number);
      break;
    case 'y':
      today.setFullYear(today.getFullYear() + number);
      break;
    default:
      throw new Error("Invalid unit. Use 'd' for days, 'm' for months, or 'y' for years.");
  }

  return today;
}

function formatDate(date, format) {
  // Check if date is valid
  if (!date) {
    throw new Error("Invalid date value: date is undefined or null");
  }

  // Convert the input to a Date object if it's a string or number
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }

  // Check if the conversion was successful
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const options = {
    // Full month name
    MMMM: date.toLocaleString('en-US', { month: 'long' }),
    // Two-digit day
    DD: String(date.getDate()).padStart(2, '0'),
    // Full year
    YYYY: date.getFullYear(),
    // Two-digit month
    MM: String(date.getMonth() + 1).padStart(2, '0'),
  };

  // Replace format tokens with corresponding date values
  return format.replace(/MMMM|DD|YYYY|MM/g, (match) => options[match]);
}



onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);

})
</script>

<template>
    <CheckoutSkeleton  v-if="loading" />

      <div v-show="!loading">

        <!-- Order Header -->
        <div class="bg-gray-100 mb-10">
            <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
            <h1 class="text-gray-800 text-xl font-bold my-2">Order #{{ orderId }}</h1>
            <div class="mb-2 text-xs text-right flex items-end ml-auto">
                <a href="/" class="cursor-pointer text-gray-900 hover:text-cyan-900 hover:underline">
                <span class="flex h-full items-center text-xs text-right">
                    <span class="mb-[0.1rem]">View Invoice</span>
                </span>
                </a>
            </div>
            </div>
        </div>

        <div v-if="totalItems > 0" class="container mx-auto mb-4">
            <div class="grid grid-cols-1 gap-3 relative">
                <div class="grid grid-cols-1 md:grid-cols-3 h-fit gap-3 relative">
                    <div
                        class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative"
                    >
                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Order status</h2>
                        <p class="text-gray-500">Preparing to ship on <time :datetime="formatDate(calculateDate('14d'), 'YYYY-MM-DD')">{{ formatDate(calculateDate('14d'), 'MMMM DD, YYYY') }}</time></p>
                        <!-- Progress bar -->
                        <div class="relative mt-2 mb-4">
                            <div class="h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-indigo-600 rounded-full" style="width: 37.5%;"></div>
                            </div>
                            <div class="flex justify-between text-sm text-gray-700 mt-2">
                            <div>Order placed</div>
                            <div>Processing</div>
                            <div>Shipped</div>
                            <div>Delivered</div>
                            </div>
                        </div>

                        <div class="">
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Ordered</p>
                                </div>
                                <div>
                                <p class=""><time :datetime="formatDate(calculateDate('0d', orderTime), 'YYYY-MM-DD')">{{ formatDate(calculateDate('0d', orderTime), 'MMMM DD, YYYY') }}</time></p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Paid</p>
                                </div>
                                <div>
                                <p class=""><time :datetime="formatDate(calculateDate('0d', paymentTime), 'YYYY-MM-DD')">{{ formatDate(calculateDate('0d', paymentTime), 'MMMM DD, YYYY') }}</time></p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Delivery (estimate)</p>
                                </div>
                                <div>
                                <p class=""><time :datetime="formatDate(calculateDate('14d', paymentTime), 'YYYY-MM-DD')">{{ formatDate(calculateDate('14d', paymentTime), 'MMMM DD, YYYY') }}</time></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative"
                    >
                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Shipping address</h2>
                        <div class="grid grid-cols-1 justify-between mb-4">
                            <p class="text-gray-700 ">{{ apartment }}</p>
                            <p class="text-gray-700 ">{{ street }}</p>
                            <p class="text-gray-700 ">{{ city }}</p>
                            <p class="text-gray-700 ">{{ state }}</p>
                            <p class="text-gray-700 ">{{ zipCode }}</p>
                            <p class="text-gray-700 ">{{ countryCode }}</p>
                        </div>

                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Delivery Method</h2>
                        <div class="flex justify-between mb-4">
                            <p class="">Shipping</p>
                        </div>
                    </div>
        
                    <div
                        class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative"
                    >
                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Order summary</h2>
                        <div class="mb-4">
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">{{ totalItems }} {{ totalItems > 1 ? 'Items' : 'Item'}}</p>
                                </div>
                                <div>
                                <p class="font-semibold">$ {{ subTotalAmount }}</p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Shipping</p>
                                </div>
                                <div>
                                <p class="font-semibold">$ {{ shippingRate }}</p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Tax</p>
                                </div>
                                <div>
                                <p class="font-semibold">$ {{ taxAmount }}</p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Order Total</p>
                                </div>
                                <div>
                                <p class="font-semibold">$ {{ totalAmount }}</p>
                                </div>
                            </div>
                        </div>

                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Payment Information</h2>
                        <div class="">
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Method</p>
                                </div>
                                <div>
                                <p class="">PayPal</p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Status</p>
                                </div>
                                <div>
                                <p class="font-semibold text-green-600">Paid</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative bg-white p-8 rounded-lg shadow-md">
                    <div v-for="product in orderproducts" :key="product.id" class="border-b pb-4 mb-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center w-full relative gap-4 sm:gap-10">
                        <div class="grid w-[80px]">
                            <router-link :to="`/product/${product.id}`" class="flex-1 flex flex-col">
                                <img
                                    :src="product.image"
                                    :alt="product.title"
                                    class="w-20 h-auto max-h-full object-cover mt-[0.35rem] self-start"
                                />
                            </router-link>
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="grid w-full grid-cols-1 relative">
                                <router-link :to="`/product/${product.id}`">
                                    <h2 class="text-gray-700 text-lg font-semibold">{{ product.title }}</h2>
                                </router-link>
                                <p
                                    class="text-slate-500 text-ellipsis overflow-hidden break-words max-w-full max-h-12 line-clamp-2"
                                >
                                    {{ product.description }}
                                </p>
                                <div
                                    class="flex gap-4 text-slate-600 flex flex-col sm:flex-row items-center sm:justify-between mt-3"
                                >
                                    <div class="w-full flex flex-col items-left">
                                        <p class="w-full max-w-max ">
                                            Qty: <span class="">{{ product.quantity }} </span>
                                        </p>
                                        <p class="w-full max-w-max font-semibold">
                                            $ {{ product.totalPrice }}
                                        </p>
                                        
                                    </div>
                                    <div
                                        class="w-full flex flex-0 mx-auto items-center justify-between pt-4 sm:pt-0"
                                    >
                                        <div class="flex items-center">
                                        </div>
                                        <div class="inline-flex items-end place-content-center text-xs">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                
            </div>
        </div>
      
          <NoItemFound v-if="totalItems == 0" name="cart" />
    </div>
</template>

