<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

const currentCartItems = ref(appStore.cart.cartItems),
totalItems = ref(appStore.cart.totalItems),
subTotalAmount = ref(appStore.cart.subTotalAmount),
shippingRate = ref(appStore.cart.shippingRate),
taxAmount = ref(appStore.cart.taxAmount),
totalAmount = ref(appStore.cart.totalAmount),
user = ref(appStore.user),
loading = ref(true);

const address1 = user.value ? `${user.value.address.number} ${user.value.address.street}` : '';
// console.log(user)

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);

})


</script>

<template>
    
    <!-- Order Header -->
    <div class="bg-gray-100 mb-10">
        <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
          <h1 class="text-gray-800 text-xl font-bold my-2">Order #54879</h1>
          <div class="mb-2 text-xs text-right flex items-end ml-auto">
            <div class="cursor-pointer text-gray-900 hover:text-cyan-900 hover:underline">
              <span class="flex h-full items-center text-xs text-right">
                <span class="mb-[0.1rem]">Order placed <time datetime="2021-03-22">March 22, 2021</time></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>

        <div v-if="totalItems > 0" class="container mx-auto mb-4">
            <div class="grid grid-cols-1 gap-3 relative">
                <div class="grid grid-cols-1 md:grid-cols-3 h-fit gap-3 relative">
                    <div
                        class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative"
                    >
                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Order status</h2>
                        <p class="text-gray-500">Preparing to ship on <time datetime="2021-03-24">March 24, 2021</time></p>
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
                                <p class=""><time datetime="2021-03-24">March 24, 2021</time></p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Paid</p>
                                </div>
                                <div>
                                <p class=""><time datetime="2021-03-24">March 24, 2021</time></p>
                                </div>
                            </div>
                            <div class="flex justify-between mb-0">
                                <div>
                                <p class="">Delivery (estimated)</p>
                                </div>
                                <div>
                                <p class=""><time datetime="2021-03-24">March 24, 2021</time></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative"
                    >
                        <h2 class="text-gray-700 text-lg font-semibold mb-4">Shipping address</h2>
                        <div class="grid grid-cols-1 justify-between mb-4">
                            <p class="text-gray-700 ">{{ address1 }}</p>
                            <p class="text-gray-700 ">$ {{ subTotalAmount }}</p>
                            <p class="text-gray-700 ">$ {{ subTotalAmount }}</p>
                            <p class="text-gray-700 ">$ {{ subTotalAmount }}</p>
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
                    <div v-for="cartItem in currentCartItems" :key="cartItem.id" class="border-b pb-4 mb-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center w-full relative gap-4 sm:gap-10">
                        <div class="grid w-[80px]">
                            <img
                                :src="cartItem.image"
                                :alt="cartItem.title"
                                class="w-auto h-20 max-h-full object-cover mt-[0.35rem] self-start"
                            />
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="grid w-full grid-cols-1 relative">
                            <h2 class="text-gray-700 text-lg font-semibold">{{ cartItem.title }}</h2>
                            <p
                                class="text-slate-500 text-ellipsis overflow-hidden break-words max-w-full max-h-12 line-clamp-2"
                            >
                                {{ cartItem.description }}
                            </p>
                            <div
                                class="flex gap-4 text-slate-600 flex flex-col sm:flex-row items-center sm:justify-between mt-3"
                            >
                                <div class="w-full flex flex-row items-center">
                                <p class="w-full max-w-max text-lg font-semibold">
                                    $ {{ cartItem.totalPrice }}
                                </p>
                                
                                </div>
                                <div
                                class="w-full flex flex-0 mx-auto items-center justify-between pt-4 sm:pt-0"
                                >
                                <div class="flex items-center">
                                    <p class="w-full max-w-max text-lg ">
                                        Qty: <span class="font-semibold">{{ cartItem.quantity }} </span>
                                    </p>
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
      
          <!-- <NoItemFound v-if="totalItems == 0" name="cart" /> -->
      </div>
</template>

