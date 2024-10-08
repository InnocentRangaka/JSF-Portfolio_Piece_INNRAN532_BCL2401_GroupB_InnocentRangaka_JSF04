import { defineStore } from 'pinia';
import { defineAsyncComponent, markRaw, reactive, shallowRef, ref } from 'vue'
import { fetchCategories, fetchSingleProduct, fetchProducts, fetchFavourites, fetchCompareListItems } from '../api/api';
import { calculateSubTotalAmount, calculateTaxAmount, calculateCartTotal, parseObjectToArray, promptUserForConfirmation } from '../utils/utils'
import MainLayout from '../components/includes/MainLayout.vue'
import PlainLayout from '../components/includes/PlainLayout.vue'
import { useUserStore } from '../stores/userStore'

/**
 * App store definition using Pinia.
 * @type {import('pinia').StoreDefinition}
 */
export const useAppStore = defineStore('appStore', {
  state: () => ({

    // Products and loading state
    /**
     * Array to hold the products for view.
     * @type {Array<Object>}
     */
    viewProduct: [],

    /**
     * Array to hold all products.
     * @type {Array<Object>}
     */
    products: [],

    /**
     * Array to hold original products for reference.
     * @type {Array<Object>}
     */
    originalProducts: [],

    /**
     * Object to hold the selected product details.
     * @type {Object}
     */
    selectedProduct: {},

    discountedProducts: [],

    /**
     * Loading states for different parts of the application.
     * @type {Object}
     */
    loading: {
      /**
       * Loading state for products.
       * @type {boolean}
       */
      products: true,

      /**
       * Loading state for cart actions.
       * @type {boolean}
       */
      cart: false,

      /**
       * Loading state for page transitions.
       * @type {boolean}
       */
      page: true,
    },

    /**
     * Error message or object for application errors.
     * @type {string|null}
     */
    error: null,

    /**
     * Overall page loading state.
     * @type {boolean}
     */
    pageLoading: true,

    // Sorting and filtering
    /**
     * Current sorting method.
     * @type {string}
     */
    sorting: 'default',

    /**
     * Current search term for filtering products.
     * @type {string}
     */
    searchTerm: '',

    /**
     * Current filter item (e.g., category).
     * @type {string}
     */
    filterItem: 'All categories',

    /**
     * List of product categories.
     * @type {Array<Object>}
     */
    categories: [],

    // UI state
    /**
     * State of the dropdown menu (open/closed).
     * @type {boolean}
     */
    dropdownOpen: false,

    /**
     * CSS class for disabled state.
     * @type {string}
     */
    disabledClass: 'disabled:opacity-75',

    /**
     * CSS class for pointer cursor.
     * @type {string}
     */
    cursorPointerClass: 'cursor-pointer',

    /**
     * CSS class for not-allowed cursor.
     * @type {string}
     */
    cursorNotAllowed: 'cursor-not-allowed',

    // Cart management
    /**
     * Currency symbol used in the application.
     * @type {string}
     */
    currency: '$',

    /**
     * Tax rate applied to purchases.
     * @type {number}
     */
    taxRate: Number(15),

    /**
     * Current shipping rate.
     * @type {number}
     */
    shippingRate: 0,

    /**
     * Shipping cost options.
     * @type {Object}
     */
    shippingCost: {
      /**
       * Standard shipping cost.
       * @type {number}
       */
      standard: Number(5),

      /**
       * Express shipping cost.
       * @type {number}
       */
      express: Number(16.00)
    },

    paymentMethod: 'paypal',

    paymentMethods: [
      { id: 'paypal', label: 'PayPal' },
      { id: 'credit-card', label: 'Credit Card' },
    ],

    payment: {},

    /**
     * Cart management object.
     * @type {Object}
     */
    cart: reactive({
      /**
       * Flag indicating if an item is being added to the cart.
       * @type {boolean}
       */
      isAddingToCart: false,

      /**
       * Text displayed on the add to cart button.
       * @type {string}
       */
      addToCartText: 'Add To Cart',

      /**
       * Current shipping rate for the cart.
       * @type {number}
       */
      shippingRate: 0,

      /**
       * Selected shipping method for the cart.
       * @type {string}
       */
      shippingMethod: 'standard',

      payment: {},

      /**
       * Items in the cart.
       * @type {Object}
       */
      cartItems: {},

      /**
       * Total number of items in the cart.
       * @type {number}
       */
      totalItems: 0,

      /**
       * Subtotal amount for the items in the cart.
       * @type {number}
       */
      subTotalAmount: 0,

      /**
       * Tax amount for the items in the cart.
       * @type {number}
       */
      taxAmount: 0,

      /**
       * Total amount for the cart including tax and shipping.
       * @type {number}
       */
      totalAmount: 0,

      paymentMethod: '',

      status: '',
    }),

    carts: {},

    order: {},

    orders: {},

    confirmOrderId: '',
    confirmOrderStatus: '',

    // Wishlist management
    /**
     * Wishlist management object.
     * @type {Object}
     */
    wishList: {
      /**
       * Items in the wishlist.
       * @type {Object}
       */
      items: {},

      products: {},

      /**
       * Total number of items in the wishlist.
       * @type {number}
       */
      totalItems: 0
    },

    wishLists: {},

    compareList: {
      /**
       * Items in the wishlist.
       * @type {Object}
       */
      items: {},

      products: {},

      /**
       * Total number of items in the wishlist.
       * @type {number}
       */
      totalItems: 0
    },

    compareLists: {},

    // Page navigation
    /**
     * Current page name.
     * @type {string|null}
     */
    pageName: null,

    /**
     * Object containing arrays of different page categories.
     * @type {Object}
     */
    pages: {
      /**
       * Product-related pages.
       * @type {Array<string>}
       */
      productPages: ['home', 'wishlist', 'products', 'product'],

      /**
       * Authentication-related pages.
       * @type {Array<string>}
       */
      authPages: ['login', 'signup'],

      /**
       * Cart-related pages.
       * @type {Array<string>}
       */
      cartPages: ['cart', 'checkout'],
    },

    /**
     * Object containing current location details.
     * @type {Object}
     */
    currentLocation: {
      /**
       * Current path.
       * @type {string}
       */
      path: '',

      /**
       * Current URL parameters.
       * @type {string}
       */
      params: '',

      /**
       * Current URL query string.
       * @type {string}
       */
      query: '',

      /**
       * Current route name.
       * @type {string}
       */
      route: '',

      /**
       * User data related to the current location.
       * @type {string}
       */
      userData: '',

      /**
       * Current component name.
       * @type {string}
       */
      componentName: '',

      redirectedFrom: '',

      /**
       * Object containing previous location details.
       * @type {Object}
       */
      previous: {
        /**
         * Previous path.
         * @type {string}
         */
        path: '',

        /**
         * Previous URL parameters.
         * @type {string}
         */
        params: '',

        /**
         * Previous URL query string.
         * @type {string}
         */
        query: '',

        /**
         * Previous route name.
         * @type {string}
         */
        route: '',

        /**
         * User data related to the previous location.
         * @type {string}
         */
        userData: '',

        /**
         * Previous component name.
         * @type {string}
         */
        componentName: '',
      }
    },

    currentLayout: {
      name: 'MainLayout',
      component: shallowRef(markRaw(MainLayout)),
    },

    /**
     * Toast object for notifications.
     * @type {Object}
     */
    toast: {
      /**
       * Flag indicating toast visibility.
       * @type {boolean}
       */
      visible: false,

      /**
       * Toast delay in milliseconds.
       * @type {number}
       */
      delay: 5000,

      /**
       * Toast progress percentage.
       * @type {number}
       */
      percent: 0,

      /**
       * Toast interval ID.
       * @type {number|null}
       */
      interval: null,

      /**
       * Toast message.
       * @type {string|null}
       */
      message: null,

      /**
       * Toast display component.
       * @type {string|null}
       */
      display: null,
    },
    errorToast: {
      /**
       * Flag indicating toast visibility.
       * @type {boolean}
       */
      visible: false,

      /**
       * Toast delay in milliseconds.
       * @type {number}
       */
      delay: 5000,

      /**
       * Toast progress percentage.
       * @type {number}
       */
      percent: 0,

      /**
       * Toast interval ID.
       * @type {number|null}
       */
      interval: null,

      /**
       * Toast message.
       * @type {string|null}
       */
      message: null,

      /**
       * Toast display component.
       * @type {string|null}
       */
      display: null,
    },
  }),

  actions: {
    updateLayout(path) {
      let layout = { name: '', component: null };

      switch (true) {
        case path.startsWith('/auth'):
          layout.name = 'PlainLayout';
          layout.component = shallowRef(markRaw(PlainLayout));
          break;
        case path.startsWith('/cart'):  
          layout.name = 'PlainLayout';
          layout.component=  shallowRef(markRaw(PlainLayout));
          break;
        case path.startsWith('/checkout'):
          layout.name = 'PlainLayout';
          layout.component=  shallowRef(markRaw(PlainLayout));
          break;
        default:
          layout.name = 'MainLayout';
          layout.component = shallowRef(markRaw(MainLayout));
          // console.log('Default:',layout.name, layout, this.currentLayout)
      }

      if (layout.name !== this.currentLayout.name) {
        this.currentLayout = layout;
        // console.log('NEW LAYOUT:', layout.name, layout.component, this.currentLayout)
      }

      // console.log(path, path.startsWith('/auth/'), this.currentLayout.component['__name'])
    },

    /**
     * Formats a given price to two decimal places.
     * @param {number} price - The price to format.
     * @returns {string} - The formatted price.
     */
    formatPrice: (price) => price.toFixed(2),

    /**
     * Sets the categories in the state.
     * @param {Array<Object>} categories - The categories to set.
     */
    setCategories(categories) {
      this.categories = categories;
    },

    /**
     * Sets the products in the state.
     * @param {Array<Object>} products - The products to set.
     */
    setProducts(products) {
      this.products = products;
    },

    /**
     * Sets the original products in the state.
     * @param {Array<Object>} products - The original products to set.
     */
    setOriginalProducts(products) {
      this.originalProducts = products;
    },

    /**
     * Sets the product to view in the state.
     * @param {Object} product - The product to set for viewing.
     */
    setViewProduct(product) {
      this.viewProduct = product;
    },

    /**
     * Sets the loading state.
     * @param {Object} loading - The loading state to set.
     */
    setLoading(loading) {
      this.loading = loading;
    },

    /**
     * Sets the loading state for products.
     * @param {boolean} loading - The loading state for products.
     */
    setProductsLoading(loading) {
      if (typeof this.loading !== 'object') {
        this.loading = {
          products: true,
          cart: false,
          page: true,
        };
      }
      this.loading.products = loading;
    },

    /**
     * Sets the error state.
     * @param {string} error - The error message to set.
     */
    setError(error) {
      this.error = error;
    },

    /**
     * Sets the page loading state.
     * @param {boolean} pageLoading - The page loading state to set.
     */
    setPageLoading(pageLoading) {
      this.pageLoading = pageLoading;
    },

    /**
     * Fetches categories and updates the state.
     * @returns {Promise<void>}
     */
    async fetchCategories() {
      await fetchCategories(this);
    },

    /**
     * Fetches a single product by ID and updates the state.
     * @param {number|string} id - The ID of the product to fetch.
     * @returns {Promise<void>}
     */
    async fetchSingleProduct(id) {
      await fetchSingleProduct(id, this);
    },

    /**
     * Fetches all products and updates the state.
     * @returns {Promise<void>}
     */
    async fetchProducts() {
      const { data, error, fetching, fetchData } = await fetchProducts(this);
      return { data, error, fetching, fetchData };
    },

    applyDiscounts(app, products) {
      const originalPrices = ref({});
      let discountTimeout;
    
      const applyDiscount = () => {
        // Reset previous discounts if any
        if (discountTimeout) {
          clearTimeout(discountTimeout);
          products.forEach((product) => {
            if (originalPrices.value[product.id]) {
              product.price = originalPrices.value[product.id];
            }
          });
        }
    
        // Select 5 random products
        while (app.discountedProducts.length < 5 && products.length > 0) {
          const randomIndex = Math.floor(Math.random() * products.length);
          const product = products[randomIndex];
    
          // If the product isn't already discounted
          if (!originalPrices.value[product.id]) {
            originalPrices.value[product.id] = product.price;

            product.originalPrice = product.price;
            product.discount = '10%';
            product.price = (product.price * 0.9).toFixed(2);
            product.saveAmount = parseFloat((product.price - (product.price * 0.9))).toFixed(2); // Apply 10% discount
            
            app.discountedProducts.push(product);

            // Replace product in products with discounted product
            // const index = products.findIndex((p) => p.id === product.id);
            // if (index !== -1) {
            //   products[index] = product;
            // }
          }
        }
    
        // Set timeout to reselect products after an hour (3600000 ms)
        discountTimeout = setTimeout(() => {
          applyDiscount();
        }, 3600000);

        const filteredProducts = products.filter(product =>
          !app.discountedProducts.some(discounted => discounted.id === product.id)
        );

        // Array to store the final products
        const finalProducts = [];
        const productsTotal = Object.values(products).length;

        // Loop from 1 to 20
        for (let i = 1; i <= productsTotal; i++) {
          // Find the product in the products object
          const product = Object.values(filteredProducts).find(p => p.id === i);

          // Check if the product exists in discountedProducts
          const discountedProduct = Object.values(app.discountedProducts).find(dp => dp.id === i);

          if (discountedProduct) {
            // If discounted product exists, add it to the finalProducts array
            finalProducts.push(discountedProduct);
          } else if (product) {
            // If no discounted product but product exists, add the product to finalProducts
            finalProducts.push(product);
          }
        }

        return finalProducts;
      };
    
      // Call the discount function initially
      return applyDiscount();
    },

    mergeProductsWithPriority(products, discountedProducts) {
      const mergedProducts = [];
      const productMap = new Map(); // Map for efficient duplicate handling
    
      // Add products with priority to originals
      products.forEach((product) => {
        const existingProduct = productMap.get(product.id);
        if (!existingProduct || (existingProduct && !existingProduct.originalPrice)) {
          mergedProducts.push(product);
          productMap.set(product.id, product);
        }
      });

      // Convert non-array discountedProducts to an array (if necessary)
      discountedProducts = Array.isArray(discountedProducts) ? discountedProducts : Array.from(discountedProducts);
    
      // Add discounted products (excluding duplicates)
      discountedProducts.forEach((product) => {
        if (!productMap.has(product.id)) {
          mergedProducts.push(product);
          productMap.set(product.id, product);
        }
      });

      // console.log(mergedProducts)
    
      return mergedProducts;
    },

    /**
     * Fetches favourite products and updates the state.
     * @param {Array<Object>} objectArray - The array of favourite products to fetch.
     * @returns {Promise<void>}
     */
    async fetchFavourites(objectArray) {
      await fetchFavourites(objectArray, this);
    },

    /**
     * Adds or removes a product from the wishlist.
     * @param {number|string} id - The ID of the product to add or remove.
     */
    addToFavourites(id) {
      const newWishList = { ...this.wishList.items };
      if (newWishList[id]) {
        delete newWishList[id];
      } else {
        newWishList[id] = true;
      }

      this.showToast('Product added to wishlist!');

      this.wishList = {
        ...this.wishList,
        items: newWishList, 
        totalItems: Object.entries(newWishList).length
      };
    },

    saveFavourites(userId, wishlist){
      if(userId && Object.values(wishlist.items).length > 0){
        this.wishLists = {
          ...this.wishLists,
          [userId]: wishlist
        }
  
        this.wishList = {
          items: {},
          products: {},
          totalItems: 0
        }
      }
    },

    updateFavourites(newWishList) {
      this.wishList = {
        ...this.wishList,
        ...newWishList,
        items: newWishList.items,
        products: newWishList.products, 
        totalItems: Object.values(newWishList).length
      };
    },

    removeAllFavourites(){
      this.wishList = {}
    },

    setFavourites(products) {
      this.wishList.products = products;
    },

    addToCompareList(id) {
      const newCompareList = { ...this.compareList.items };
      if (newCompareList[id]) {
        delete newCompareList[id];
        this.showErrorToast('Product removed to compare list!');
      } else {
        newCompareList[id] = true;
        this.showToast('Product added to compare list!');
      }

      this.compareList = {
        ...this.compareList,
        items: newCompareList, 
        totalItems: Object.entries(newCompareList).length,
        removeItem: false,
      };
    },

    async fetchCompareListItems(objectArray) {
      await fetchCompareListItems(objectArray, this);
    },

    saveCompareList(userId, comparelist){
      if(userId && Object.values(comparelist.items).length > 0){
        this.compareLists = {
          ...this.compareLists,
          [userId]: comparelist
        }
  
        this.compareList = {
          items: {},
          products: {},
          totalItems: 0
        }
      }
    },

    updateCompareList(comparelist) {
      this.compareList = {
        ...this.compareList,
        ...comparelist,
        items: comparelist.items,
        products: comparelist.products, 
        totalItems: Object.values(comparelist).length
      };
    },

    setCompareList(products) {
      this.compareList.products = products;
    },

    removeCompareListItem(item, el){
      if (el.hasAttribute('disabled')) return;
    
      this.disableElement(el);

      const parsedObject = parseObjectToArray(this.compareList.products);
      const findItemInCompare = Object.values(parsedObject).find(product => product.id === item.id) || false;
      
      if (findItemInCompare) {
        const compareItems = Object.values(parseObjectToArray(this.compareList.products));
        const index = compareItems.indexOf(findItemInCompare);
        compareItems[index].removeItem = true;

        setTimeout(() => {
          const newCompareListItems = [...compareItems];
          const newIndex = newCompareListItems.indexOf(findItemInCompare);
          newCompareListItems.splice(newIndex, 1);

          const newCompareListIds = this.compareList.items
          if (newCompareListIds.hasOwnProperty(item.id)) {
            delete newCompareListIds[item.id];
          }
          this.disableElement(el, false);

          const createCompareList = {
            items: newCompareListIds,
            products: newCompareListItems, 
            totalItems: Object.values(newCompareListIds).length
          }

          // this.updateCompareList(createCompareList);
          this.compareList = createCompareList;

          if (compareItems[index]) {
            compareItems[index].removeItem = false;
          }
        }, 2000);
      }
    },

    removeAllCompareListItems(){
      this.compareList = {
        items: {},
        products: {},
        totalItems: 0
      }

      this.products = [];
    },

    /**
     * Sets the search term for product filtering.
     * @param {string} term - The search term to set.
     */
    setSearchTerm(term){
      this.searchTerm = term;
    },

    /**
     * Sets the filter item for product filtering.
     * @param {string} term - The filter item to set.
     */
    setFilterItem(term){
      this.filterItem = term;
    },

    /**
     * Sets the sorting term for products.
     * @param {string} term - The sorting term to set.
     */
    setSorting(term){
      this.sorting = term;
    },

    /**
     * Sorts the products based on the current sorting term.
     */
    sortProducts() {
      const sortingTerm = this.sorting;
      switch (sortingTerm) {
        case 'low':
        case 'high':
          this.products = Object.values(this.products).sort((a, b) => sortingTerm === 'low' ? a.price - b.price : b.price - a.price);
          break;
        case 'A-Z':
        case 'Z-A':
          this.products = Object.values(this.products).sort((a, b) => sortingTerm === 'A-Z' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
          break;
        case 'lowRating':
        case 'highRating':
          this.products = Object.values(this.products).sort((a, b) => sortingTerm === 'lowRating' ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate);
          break;
        case 'categoryA-Z':
        case 'categoryZ-A':
          this.products = Object.values(this.products).sort((a, b) => sortingTerm === 'categoryA-Z' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category));
          break;
        case 'default':
          this.products = JSON.parse(JSON.stringify(this.originalProducts));
          break;
        default:
          // Error unexpected sortingTerm values
          this.error = {
            status: 'invalid value',
            message: `Invalid sortingTerm: '${sortingTerm}'`,
            type: 'sorting',
          };
          break;
      }      
    },

    /**
     * Searches for products based on the current search term.
     */
    searchProducts() {
      const searchTerm = this.searchTerm;
      const thisProducts = this.getOriginalProducts;
      const term = searchTerm.toString().toLowerCase();
      let searchedProducts;

      if(term.trim() !== ''){
        const filteredProducts = Object.values(thisProducts).filter((product) => product.title.toLowerCase().includes(term));
        searchedProducts = JSON.parse(JSON.stringify(filteredProducts));
      } else {
        searchedProducts = JSON.parse(JSON.stringify(thisProducts));
      }

      this.products = searchedProducts;
    },

    /**
     * Shows a toast notification with a given message.
     * @param {string} message - The message to display in the toast.
     */
    showToast(message) {
      if(this.toast.visible || this.toast.display){
        this.toast.visible = false;
        this.toast.display = false;
        this.toast.message = '';
      }

      this.toast.message = message;
      this.toast.visible = true;
      this.toast.display = true;
      
      if (this.toast.interval) {
        clearInterval(this.toast.interval);
        this.toast.interval = null;
      }
  
      if (this.toast.timeout) {
        clearTimeout(this.toast.timeout);
        this.toast.timeout = null;
      }

      this.toast.timeout = setTimeout(() => {
        this.toast.visible = false;
        this.toast.timeout = null;
      }, this.toast.delay);
  
      const startDate = Date.now();
      const futureDate = startDate + this.toast.delay;

      this.toast.interval = setInterval(() => {
        const dateNow = Date.now();
        this.toast.percent = Math.floor((dateNow - startDate) * 100 / (futureDate - startDate));
        if (this.toast.percent >= 100) {
          clearInterval(this.toast.interval);
          this.toast.interval = null;
        }
      }, 30);
    },

    showErrorToast(message) {
      if(this.errorToast.visible || this.errorToast.display){
        this.errorToast.visible = false;
        this.errorToast.display = false;
        this.errorToast.message = '';
      }

      this.errorToast.message = message;
      this.errorToast.visible = true;
      this.errorToast.display = true;
      
      if (this.errorToast.interval) {
        clearInterval(this.errorToast.interval);
        this.errorToast.interval = null;
      }
  
      if (this.errorToast.timeout) {
        clearTimeout(this.errorToast.timeout);
        this.errorToast.timeout = null;
      }

      this.errorToast.timeout = setTimeout(() => {
        this.errorToast.visible = false;
        this.errorToast.timeout = null;
      }, this.errorToast.delay);
  
      const startDate = Date.now();
      const futureDate = startDate + this.errorToast.delay;

      this.errorToast.interval = setInterval(() => {
        const dateNow = Date.now();
        this.errorToast.percent = Math.floor((dateNow - startDate) * 100 / (futureDate - startDate));
        if (this.errorToast.percent >= 100) {
          clearInterval(this.errorToast.interval);
          this.errorToast.interval = null;
        }
      }, 30);
    },

    /**
     * Closes the currently visible toast notification.
     */
    closeToast() {
      this.toast.visible = false;
      clearInterval(this.toast.interval);
      this.toast.interval = null;
    },

    placeOrder(userId, userCart, userPaymentInfo, userShippingAddress){
      return this.saveOrder(userId, userCart, userPaymentInfo, userShippingAddress)
    },

    saveOrder(userId, userCart, userPaymentInfo, userShippingAddress){
      if(Object.values(userCart.cartItems).length > 0){
        const cart = {
          shippingRate: userCart?.shippingRate,
          shippingMethod: userCart?.shippingMethod,
          cartItems: userCart?.cartItems,
          totalItems: userCart?.totalItems,
          subTotalAmount: userCart?.subTotalAmount,
          taxAmount: userCart?.taxAmount,
          totalAmount: userCart?.totalAmount,
        }

        this.order = {
          payment: {
            ...userPaymentInfo,
          },
          cart: {
            ...cart,
          },
          shippingAddress: {
            ...userShippingAddress,
          },
        }

        this.orders = {
          ...this.orders,
          [userId]: {
            ...this.orders[userId],
            [userPaymentInfo.id]: {
              payment: {
                ...userPaymentInfo,
              },
              cart: {
                ...cart,
              },
              shippingAddress: {
                ...userShippingAddress,
              },
            },
          },
        }
  
        this.cart = {
          isAddingToCart: false,
          addToCartText: 'Add To Cart',
          shippingRate: 0,
          shippingMethod: 'standard',
          payment: {},
          cartItems: {},
          totalItems: 0,
          subTotalAmount: 0,
          taxAmount: 0,
          totalAmount: 0,
          paymentMethod: '',
          status: '',
        };

        if (this.carts[userId]) {
          delete this.carts[userId];
        }
        this.closeToast();

        return true
      }
      return false
    },

    findOrder(userId, orderId){
      if(this.orders[userId] && this.orders[userId][orderId]){
        this.order = this.orders[userId][orderId];
      }
      return this.order;
    },
    
    saveCart(userId, cart){
        this.carts = {
          ...this.carts,
          [userId]: cart
        }
  
        this.cart = {
          isAddingToCart: false,
          addToCartText: 'Add To Cart',
          shippingRate: 0,
          shippingMethod: 'standard',
          payment: {},
          cartItems: {},
          totalItems: 0,
          subTotalAmount: 0,
          taxAmount: 0,
          totalAmount: 0,
          paymentMethod: '',
          status: '',
        };
    },

    /**
     * Adds an item to the cart.
     * @param {Object} item - The item to add to the cart.
     */
    addToCart(item) {
      const newCartItems = { ...this.cart.cartItems };
      if (newCartItems[item.id]) {
        newCartItems[item.id].quantity += 1;
        newCartItems[item.id].totalPrice = newCartItems[item.id].quantity * item.price;
      } else {
        const hasQuantity = item.quantity ? item.quantity : 1;
        newCartItems[item.id] = { 
          ...item, 
          quantity: hasQuantity, 
          totalPrice: item.price,
          quantityUpdating: false,
          removeItem: false,
        };
      }

      this.updateCart(newCartItems, 'Product added to cart!');
    },

    /**
     * Updates the cart with new items and optionally shows a toast message.
     * @param {Object} newCartItems - The new cart items.
     * @param {string} [toastMessage=''] - The message to display in the toast.
     */
    updateCart(newCartItems, toastMessage='') {
      const cartTotalItems = Object.keys(newCartItems).length;
      const cartSubTotalAmount = calculateSubTotalAmount(newCartItems);
      const cartShippingRate = this.shippingRate;
      const cartTaxAmount = calculateTaxAmount(newCartItems, this.taxRate, cartShippingRate);
      const cartTotalAmount = calculateCartTotal(newCartItems, this.taxRate, cartShippingRate);

      if(toastMessage){this.showToast(toastMessage);}
      const userStore = useUserStore()
      const userId = userStore.user?.id ? userStore.user.id : 0

      this.cart = { 
        ...this.cart,
        cartItems: newCartItems,
        totalItems: cartTotalItems,
        subTotalAmount: cartSubTotalAmount,
        taxAmount: cartTaxAmount,
        shippingRate: cartShippingRate,
        totalAmount: cartTotalAmount,
        paymentMethod: this.paymentMethod,
        user: userId
      };
    },

    /**
     * Removes an item from the cart after a delay.
     * @param {Object} item - The item to remove from the cart.
     * @param {HTMLElement} el - The HTML element associated with the removal action.
     */
    removeCartItem(item, el){
      if (el.hasAttribute('disabled')) return;
    
      this.disableElement(el);
      
      const findItemInCart = this.isInCartItems(item.id, this.cart.cartItems);

      if (findItemInCart) {
        const cartItems = Object.values(parseObjectToArray(this.cart.cartItems));
        const index = cartItems.indexOf(findItemInCart);
        cartItems[index].removeItem = true;

        setTimeout(() => {
          const newCartItems = [...cartItems];
          newCartItems.splice(newCartItems.indexOf(item), 1);
          this.disableElement(el, false);

          this.updateCart(newCartItems, 'Item removed successfully!');

          if (cartItems[index]) {
            cartItems[index].removeItem = false;
          }
        }, 2000);
      }
    },

    removeAllCartItems() {
      if (confirm("Are you sure you want to remove all products from the cart?")) {
        const newCartItems = [];
        this.updateCart(newCartItems, 'All items removed successfully!');
      }
    },

    /**
     * Checks if an item is in the cart.
     * @param {number|string} id - The ID of the item to check.
     * @param {Object} object - The cart items object.
     * @returns {Object|boolean} - The item if found, otherwise false.
     */
    isInCartItems: (id, object) => {
      const parsedObject = parseObjectToArray(object);
      return Object.values(parsedObject).find(item => item.id === id) || false;
    },

    updateShipping(method, app){
      // console.log(shippingCost)
      const cost = method == 'express' ? this.shippingCost.express : this.shippingCost.standard;
      app.shippingMethod = method
      app.shippingRate = cost;
    },

    updatePaymentMethod(method, app){
      app.paymentMethod = method
    },

    /**
     * Disables or enables an HTML element.
     * @param {HTMLElement} el - The element to disable or enable.
     * @param {boolean} [boolean=true] - Whether to disable (true) or enable (false) the element.
     */
    disableElement(el, boolean = true){
      if(!boolean){
        el.removeAttribute('disabled');
        el.classList.remove(this.disabledClass);
        el.classList.remove(this.cursorNotAllowed);
        el.classList.remove(this.cursorPointerClass);
        return;
      }

      el.setAttribute('disabled', true);
      el.classList.toggle(this.disabledClass);
      el.classList.toggle(this.cursorNotAllowed);
      el.classList.toggle(this.cursorPointerClass);
    },
  },
  getters: {
    /**
     * Gets all categories.
     * @param {Object} state - The state object.
     * @returns {Array<Object>} - The categories.
     */
    getCategories: (state) => {
      return state.categories;
    },

    /**
     * Gets a specific category based on the URL category.
     * @param {Object} state - The state object.
     * @returns {Function} - A function that takes a URL category and returns the category.
     */
    getCategory: (state) => (urlCategory) => {
      return state.getCategories
        ? state.getCategories.find((categoryName) => categoryName.startsWith(urlCategory))
        : undefined;
    },

    /**
     * Gets products by category.
     * @param {Object} state - The state object.
     * @returns {Function} - A function that takes a category and returns the products in that category.
     */
    getProductsByCategory: (state) => (category) => {
      return state.products.filter((product) => product.category === category);
    },

    /**
     * Gets all products or filters them by category.
     * @param {Object} state - The state object.
     * @returns {Array<Object>} - The products.
     */
    getProducts: (state) => {
      if (state.filterItem === 'All categories') {
        return state.products;
      } else {
        return state.products.filter((product) => product.category === state.filterItem);
      }
    },

    getDiscountedProducts: (state) => {
      if (state.filterItem === 'All categories') {
        return state.discountedProducts;
      } else {
        return state.discountedProducts.filter((product) => product.category === state.filterItem);
      }
    },

    /**
     * Gets the original products.
     * @param {Object} state - The state object.
     * @returns {Array<Object>} - The original products.
     */
    getOriginalProducts: (state) => {
      return state.originalProducts;
    },

    /**
     * Gets a single product for viewing.
     * @param {Object} state - The state object.
     * @returns {Object} - The product to view.
     */
    getSingleProduct: (state) => {
      return state.viewProduct;
    },

    /**
     * Gets the cart.
     * @param {Object} state - The state object.
     * @returns {Object} - The cart.
     */
    getCart: (state) => (userId) => {
      const savedCart = state.carts[userId],
      currentCart = state.cart;

      // console.log(savedCart)

      const bothCart = savedCart?.cartItems && currentCart?.cartItems

      if(!bothCart){return}

      const savedCartHasItems = Object.values(savedCart.cartItems).length > 0 ? true : false,
      currentCartHasItems = Object.values(currentCart.cartItems).length > 0 ? true : false;

      if(!currentCartHasItems && savedCartHasItems){
        state.updateCart(savedCart.cartItems);
      }
      if(currentCartHasItems && !savedCartHasItems){
        state.updateCart(currentCart.cartItems);
      }
      if(currentCartHasItems && savedCartHasItems){
        promptUserForConfirmation("You have items in both your saved cart and your guest cart. Do you want to merge them?")
        .then((merge) => {
          if(merge){
            const mergedCartItems = {...currentCart.cartItems, ...savedCart.cartItems}
            state.updateCart(mergedCartItems, "Your carts have been merged!")
          }
          else {
            promptUserForConfirmation("Would you like to continue with your guest cart instead of your saved cart?")
            .then((useGuestCart) => {
              if(useGuestCart){
                state.updateCart(currentCart.cartItems, "You are now using your guest cart.")
              }
              else {
                state.updateCart(savedCart.cartItems, "You are now using your saved cart.")
              }
            })
          }
        })
      }

      return state.cart;
    },

    /**
     * Gets the total number of items in the cart.
     * @param {Object} state - The state object.
     * @returns {number} - The total number of items in the cart.
     */
    getCartTotal: (state) => {
      return state.cart.totalItems;
    },

    /**
     * Gets the total price of items in the cart.
     * @param {Object} state - The state object.
     * @returns {number} - The total price of items in the cart.
     */
    getCartTotalPrice: (state) => {
      return state.cart.totalPrice;
    },

    /**
     * Gets the favourite products.
     * @param {Object} state - The state object.
     * @returns {Array<Object>} - The favourite products.
     */
    getFavourites: (state) => {
      return state.products.filter((product) => state.wishList.items[product.id]);
    },

    /**
     * Gets the wishlist.
     * @param {Object} state - The state object.
     * @returns {Object} - The wishlist.
     */
    getWishList: (state) => {
      return state.wishList;
    },

    /**
     * Checks if a product is in the wishlist.
     * @param {Object} state - The state object.
     * @returns {Function} - A function that takes a product ID and returns true if the product is in the wishlist, otherwise false.
     */
    getWhishList: (state) => (userId) => {
      const savedWhishList = state.wishLists[userId],
      currentWishList = state.wishList;

      const bothWishList = savedWhishList?.items && currentWishList?.items

      if(!bothWishList){return}

      const savedWishListHasItems = Object.values(savedWhishList.items).length > 0 ? true : false,
      currentWishListHasItems = Object.values(currentWishList.items).length > 0 ? true : false;

      if(!currentWishListHasItems && savedWishListHasItems){
        state.updateFavourites(savedWhishList);
      }
      if(currentWishListHasItems && !savedWishListHasItems){
        state.updateFavourites(currentWishList);
      }
      if(currentWishListHasItems && savedWishListHasItems){
        promptUserForConfirmation("You have items in both your saved wishlist and your guest wishlist. Do you want to merge them?")
        .then((merge) => {
          if(merge){
            const mergedWishListItems = {...currentWishList.items, ...savedWhishList.items}
            state.wishList = {
              ...mergedWishListItems,
              items: mergedWishListItems.items,
              products: mergedWishListItems.products,  
              totalItems: Object.entries(mergedWishListItems.items).length
            }
          }
          else {
            promptUserForConfirmation("Would you like to continue with your guest whishlist instead of your saved whishlist?")
            .then((currentWishList) => {
              if(currentWishList){
                state.wishList = {
                  ...currentWishList,
                  items: currentWishList.items,
                  products: currentWishList.products,
                  totalItems: Object.entries(currentWishList.items).length
                }
              }
              else {
                if(savedWhishList){
                  state.wishList = {
                    ...savedWhishList,
                    items: savedWhishList.items,
                    products: savedWhishList.products,
                    totalItems: Object.entries(savedWhishList.items).length
                  }
                }
              }
            })
          }
        })
      }

      return state.wishList;
    },

    isInWishList: (state) => (id) => {
      return Object.prototype.hasOwnProperty.call(state.wishList.items, id);
    },

    /**
     * Gets the total number of items in the wishlist.
     * @param {Object} state - The state object.
     * @returns {number} - The total number of items in the wishlist.
     */
    getWishListTotal: (state) => {
      return state.wishList.totalItems;
    },

    /**
     * Gets the total price of items in the wishlist.
     * @param {Object} state - The state object.
     * @returns {number} - The total price of items in the wishlist.
     */
    getWishListTotalPrice: (state) => {
      return state.wishList.totalPrice;
    },

    getCompareList: (state) => (userId) => {
      const savedCompareList = state.compareLists[userId],
      currentCompareList = state.compareList;

      const bothCompareList = savedCompareList?.items && currentCompareList?.items

      if(!bothCompareList){return}

      const savedCompareListHasItems = Object.values(savedCompareList.items).length > 0 ? true : false,
      currentCompareListHasItems = Object.values(currentCompareList.items).length > 0 ? true : false;

      if(!currentCompareListHasItems && savedCompareListHasItems){
        state.updateCompareList(savedCompareList);
      }
      if(currentCompareListHasItems && !savedCompareListHasItems){
        state.updateCompareList(currentCompareList);
      }
      if(currentCompareListHasItems && savedCompareListHasItems){
        promptUserForConfirmation("You have items in both your saved wishlist and your guest wishlist. Do you want to merge them?")
        .then((merge) => {
          if(merge){
            const mergedCompareListItems = {...currentCompareList.items, ...savedCompareList.items}
            state.compareList = {
              ...mergedCompareListItems,
              items: mergedCompareListItems.items,
              products: mergedCompareListItems.products,  
              totalItems: Object.entries(mergedCompareListItems.items).length
            }
          }
          else {
            promptUserForConfirmation("Would you like to continue with your guest whishlist instead of your saved whishlist?")
            .then((currentCompareList) => {
              if(currentCompareList){
                state.compareList = {
                  ...currentCompareList,
                  items: currentCompareList.items,
                  products: currentCompareList.products,
                  totalItems: Object.entries(currentCompareList.items).length
                }
              }
              else {
                if(savedCompareList){
                  state.compareList = {
                    ...savedCompareList,
                    items: savedCompareList.items,
                    products: savedCompareList.products,
                    totalItems: Object.entries(savedCompareList.items).length
                  }
                }
              }
            })
          }
        })
      }

      return state.compareList;
    },

    isInCompareList: (state) => (id) => {
      return Object.prototype.hasOwnProperty.call(state.compareList.items, id);
    },

    /**
     * Gets the loading state.
     * @param {Object} state - The state object.
     * @returns {Object} - The loading state.
     */
    getLoading: (state) => {
      return state.loading;
    },

    /**
     * Gets the error state.
     * @param {Object} state - The state object.
     * @returns {string} - The error message.
     */
    getError: (state) => {
      return state.error;
    },

    /**
     * Gets the page loading state.
     * @param {Object} state - The state object.
     * @returns {boolean} - The page loading state.
     */
    getPageLoading: (state) => {
      return state.pageLoading;
    },

    /**
     * Gets the pages configuration.
     * @param {Object} state - The state object.
     * @returns {Object} - The pages configuration.
     */
    getPages: (state) => {
      return state.pages;
    },

    /**
     * Gets the current location.
     * @param {Object} state - The state object.
     * @returns {Object} - The current location.
     */
    getCurrentLocation: (state) => {
      return state.currentLocation;
    },

    /**
     * Gets the current page name.
     * @param {Object} state - The state object.
     * @returns {string|null} - The current page name.
     */
    getPageName: (state) => {
      return state.pageName;
    },

    /**
     * Gets the current filter item.
     * @param {Object} state - The state object.
     * @returns {string} - The current filter item.
    */
    getFilterItem: (state) => {
      return state.filterItem;
    },

    /**
     * Gets the current sorting term.
     * @param {Object} state - The state object.
     * @returns {string} - The current sorting term.
    */
    getSorting: (state) => {
      return state.sorting;
    },
  },

  /**
   * Configuration for persistence of the store state.
   *
   * This configuration enables persistence of the store's state using the specified storage strategy.
   * The `enabled` property determines whether state persistence is enabled, and the `strategies` array 
   * specifies the storage options and keys for persisting the state.
   *
   * @type {Object}
   * @property {boolean} enabled - Whether state persistence is enabled.
   * @property {Array} strategies - An array of strategies for persisting the state.
   * @property {Object} strategies[].key - The key under which the state is stored in the specified storage.
   * @property {Storage} strategies[].storage - The storage mechanism used for persisting the state (e.g., localStorage).
  */

  persist: {
    enabled: true,
    strategies: [
      { key: 'appStore', storage: localStorage },
    ],
  },
});
