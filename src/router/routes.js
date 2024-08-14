import Home from '../views/HomeView.vue'
import NotFound from '../views/NotFoundView.vue';
import { useUserStore } from '../stores/userStore';

const isUserAuthenticated = (to, from, callBack) => {

  const userStore = useUserStore();

  userStore.setCurrentProtectedLocation(to, from)

  if (userStore.userIsAuthenticated && userStore.user) { // Check if user is authenticated
    callBack();
  } else {
    callBack({ name: 'Login' }); // Redirect to Login if not authenticated
  }
}

/**
 * The routes for the application.
 * @type {Array<Object>}
 */
const routes = [
    /**
     * Home page route.
     * @type {Object}
     * @property {string} path - The URL path.
     * @property {string} name - The route name.
     * @property {Object} component - The component to render.
     */
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    /**
     * Product detail page route.
     * @type {Object}
     * @property {string} path - The URL path with product ID parameter.
     * @property {string} name - The route name.
     * @property {Function} component - The component to render (lazy-loaded).
     */
    {
      path: '/product/:id',
      name: 'ProductDetailView',
      component: () => import('../views/ProductDetailView.vue'),
    },
    /**
     * Products by category page route.
     * @type {Object}
     * @property {string} path - The URL path with category parameter.
     * @property {string} name - The route name.
     * @property {Function} component - The component to render (lazy-loaded).
     * @property {boolean} props - Pass route params as props to the component.
     */
    {
      path: '/products/category/:category',
      name: 'Products',
      component: () => import('../views/ProductsView.vue'),
      props: true,
    },
    /**
     * Cart page route.
     * @type {Object}
     * @property {string} path - The URL path.
     * @property {string} name - The route name.
     * @property {Function} component - The component to render (lazy-loaded).
     */
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true }, // meta field to identify protected routes
      beforeEnter: (to, from, next) => {
        // console.log('to:',to.path, 'from:',from.name)
        isUserAuthenticated(to, from, next)
      },
    },
    /**
     * Wishlist page route.
     * @type {Object}
     * @property {string} path - The URL path.
     * @property {string} name - The route name.
     * @property {Function} component - The component to render (lazy-loaded).
     */
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import('../views/WishlistView.vue'),
    },
    /**
     * Login page route.
     * @type {Object}
     * @property {string} path - The URL path.
     * @property {string} name - The route name.
     * @property {Function} component - The component to render (lazy-loaded).
     */
    {
      path: '/auth/login',
      name: 'Login',
      component: () => import('../views/auth/LoginView.vue'),
      // meta: { requiresAuth: true }, // meta field to identify protected routes
      // beforeEnter: (to, from, next) => {
      //   isUserAuthenticated(to, from, next)
      // },
    },
    /**
     * Catch-all route for undefined paths (404 Not Found).
     * @type {Object}
     * @property {string} path - The catch-all path pattern.
     * @property {string} name - The route name.
     * @property {Object} component - The component to render.
     */
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
    },
];

export default routes;
