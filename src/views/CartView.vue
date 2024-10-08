<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useUserStore } from '../stores/userStore'
import { parseObjectToArray } from '../utils/utils'

import NoItemFound from '../components/includes/NoItemFound.vue'
import CartSkeleton from '../components/cart/CartSkeleton.vue'

const appStore = useAppStore()
const { cart, isInCartItems, updateCart, removeCartItem, removeAllCartItems, getCart } = appStore

const userStore = useUserStore()
const { user } = userStore

const loading = ref(true)

const subTotalAmount = computed(() => appStore.cart.subTotalAmount),
  totalAmount = computed(() => appStore.cart.totalAmount),
  totalItems = computed(() => appStore.cart.totalItems),
  currentCartItems = computed(() => appStore.cart.cartItems)

const initiateCart = () => {
  const { cartItems, totalItems, subTotalAmount, taxAmount, totalAmount } = cart
  // cart.addToCartText = cart.addToCartText
  // cart.shippingRate = cart.shippingRate
  // cart.shippingMethod = cart.shippingMethod
  cart.cartItems = cartItems
  cart.totalItems = totalItems
  cart.subTotalAmount = subTotalAmount
  cart.taxAmount = taxAmount
  cart.totalAmount = totalAmount
}

const updateQuantity = (event, item) => {
  const quantity = event.target.value
  const findItemInCart = isInCartItems(item.id, appStore.cart.cartItems)

  if (findItemInCart) {
    const cartItems = Object.values(parseObjectToArray(cart.cartItems))
    const index = cartItems.indexOf(findItemInCart)
    cartItems[index].quantityUpdating = true

    setTimeout(() => {
      const newCartItems = [...cartItems]

      if (newCartItems[index]) {
        newCartItems[index].quantity = quantity
        newCartItems[index].totalPrice = (quantity * newCartItems[index].price).toFixed(2)
      }

      updateCart(newCartItems)

      cartItems[index].quantityUpdating = false
    }, 2000)
  }
}

onMounted(() => {
  setTimeout(() => {
    getCart(user.id)
  }, 1000);
  
  initiateCart()

  setTimeout(() => {
    loading.value = false;
  }, 2000);
})

watch(
  currentCartItems,
  () => {
    appStore.cart
    initiateCart()
  },
  { deep: true }
)
</script>

<template>
  <div v-show="user">
    <CartSkeleton  v-if="loading" />

    <div v-show="!loading">
      <div class="bg-background mb-10">
        <div
          class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]"
        >
          <h1 class="text-gray-800 text-xl font-bold my-2">Shopping Cart ({{ totalItems }})</h1>
          <div class="mb-2 text-xs text-right flex items-end ml-auto">
            <a href="/" class="cursor-pointer text-gray-700 hover:text-cyan-900 hover:underline">
              <span class="flex h-full items-center text-xs text-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </svg>
                <span class="mb-[0.1rem]">Continue shopping</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div v-if="totalItems > 0" class="container mx-auto mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
          <div class="col-span-2 relative bg-background-secondary p-8 rounded-lg shadow-md">
            <div v-for="cartItem in currentCartItems" :key="cartItem.id" class="border-b pb-4 mb-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center w-full relative gap-4 sm:gap-10">
                  <img
                    :src="cartItem.image"
                    :alt="cartItem.title"
                    class="w-20 h-20 max-h-full object-cover mt-[0.35rem] bg-white self-start"
                  />
                  <div class="flex flex-col">
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
                          <p class="w-full max-w-max text-lg font-bold">
                            $ {{ cartItem.totalPrice }}
                          </p>
                          <p
                            v-if="cartItem.id !== 1 && cartItem.id !== 5"
                            class="text-green-500 flex items-center ml-5 text-xs"
                          >
                            <svg
                              class="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            In stock
                          </p>
                          <p v-else class="text-yellow-500 flex items-center ml-5 text-xs">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 -960 960 960"
                              class="w-4 h-4 mr-1"
                              fill="currentColor"
                              stroke="currentColor"
                            >
                              <path
                                d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
                              />
                            </svg>
                            Ships in 3-4 weeks
                          </p>
                        </div>
                        <div
                          class="w-full flex flex-0 mx-auto items-center justify-between pt-4 sm:pt-0"
                        >
                          <div class="flex items-center">
                            <div class="border rounded-lg pl-2 pr-1 py-1 relative">
                              <input
                                class="w-[20px] absolute left-3 z-0 bg-background-secondary"
                                type="text"
                                :value="cartItem.quantity"
                                readonly
                              />
                              <select
                                class="w-[40px] z-1 bg-background-secondary"
                                @change="updateQuantity($event, cartItem)"
                                :value="cartItem.quantity"
                                :disabled="cartItem.quantityUpdating"
                              >
                                <option
                                  v-for="i in 10"
                                  :key="i"
                                  :value="i"
                                  :selected="i === cartItem.quantity"
                                >
                                  {{ i }}
                                </option>
                              </select>
                            </div>
                            <div v-if="cartItem.quantityUpdating" class="ml-2">Updating...</div>
                          </div>
                          <div class="inline-flex items-end place-content-center text-xs">
                            <div v-if="cartItem.removeItem">Removing item...</div>
                            <button
                              v-else
                              @click="(event) => removeCartItem(cartItem, event.target)"
                              class="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div
              class="col-span-2 sm:col-span-1 h-fit text-slate-600 bg-background-secondary p-8 rounded-lg shadow-md relative sm:sitcky"
            >
              <h2 class="text-gray-700 text-lg font-semibold mb-4">Order summary</h2>
              <div class="flex justify-between mb-2">
                <span>Subtotal</span>
                <span class="text-gray-700">$ {{ subTotalAmount }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Shipping estimate</span>
                <span class="text-gray-700">$ 0.00</span>
              </div>
              <div class="flex justify-between font-semibold text-lg mb-8">
                <span>Order total</span>
                <span class="text-gray-700">$ {{ totalAmount }}</span>
              </div>
              <a
                href="/checkout"
                class="flex justify-center bg-cyan-700 hover:bg-cyan-900 w-full font-bold text-white py-2 px-4 rounded"
              >
                <span>Checkout</span>
              </a>
    
            </div>

            <div
              class="flex justify-center mt-10"
            >
              <button
                @click="() => removeAllCartItems()"
                class="text-xs text-gray-700 hover:text-cyan-900 hover:underline"
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <NoItemFound v-if="totalItems == 0" name="cart" />
    </div>
  </div>
</template>
