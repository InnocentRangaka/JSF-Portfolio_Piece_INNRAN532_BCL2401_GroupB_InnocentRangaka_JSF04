#### JSF-Portfolio_Piece_INNRAN532_BCL2401_GroupB_InnocentRangaka_JSF04

# SwiftCart E-Commerce Store

SwiftCart is an e-commerce web application built with Vue.js 3 and Pinia. It allows users to browse products in a grid layout, view detailed information about individual products, filter and sort products, and navigate seamlessly between product listings and detailed views. All shop data is dynamically loaded from an API.

The user-centric SwiftCart e-commerce application uses variety of modern web technologies, designed to offer a seamless shopping experience. SwiftCart enables users to explore a diverse range of products, manage their shopping carts, and engage with a personalized wishlist feature. With a focus on performance, usability, and aesthetic appeal, SwiftCart is an ideal solution for online retail with robust features and an intuitive interface.

## Table of Contents

- [SwiftCart E-Commerce Store](#swiftcart-e-commerce-store)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Product Browsing and Details](#product-browsing-and-details)
    - [Data Handling](#data-handling)
    - [User Interaction](#user-interaction)
    - [Authentication and User Management](#authentication-and-user-management)
    - [Shopping Cart Functionality](#shopping-cart-functionality)
    - [Wishlist Features](#wishlist-features)
    - [Comparison List](#comparison-list)
    - [Checkout and Payments](#checkout-and-payments)
    - [Discounts and Promotions](#discounts-and-promotions)
    - [Theming and User Experience](#theming-and-user-experience)
  - [Technologies Used](#technologies-used)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [User Stories](#user-stories)
    - [Setup and Deployment](#setup-and-deployment)
    - [UI/UX](#uiux)
    - [Data Fetching and State Management](#data-fetching-and-state-management)
    - [User Interaction](#user-interaction-1)
    - [Logging In](#logging-in)
    - [Shopping Cart](#shopping-cart)
    - [Comparison List](#comparison-list-1)
    - [PayPal Sandbox](#paypal-sandbox)
    - [Theme](#theme)
    - [Discounted Products](#discounted-products)
    - [Dummy Checkout](#dummy-checkout)
    - [Wishlist](#wishlist)
  - [Deployment and Presentation](#deployment-and-presentation)
    - [Deployment](#deployment)
    - [Presentation](#presentation)

## Features

### Product Browsing and Details
- Grid Layout: Browse products through an organized grid layout that showcases product images, titles, prices, categories, and ratings.
- Detailed Views: Clicking on a product image or title navigates users to a detailed page where they can view comprehensive information including title, description, image, price, category, rating, and number of reviews.
- Navigate to detailed product views

### Data Handling
- Dynamic Data Fetching: All product and shop data is fetched from an external API, eliminating the need for hardcoded information and ensuring up-to-date content.
- Loading States: Users experience smooth transitions with loading states indicating data fetching progress.

### User Interaction
- Filtering and Sorting: Users can filter products by category and sort them by not only price (lowest to highest and vice versa). Filters and sorting preferences are maintained even when navigating between views using local storage and url parameters.
- Navigation: Easy navigation between the product grid and detailed views, with the ability to return to the grid from any detailed product page.
- Navigate back to the product grid page from a detailed product view
- Provide a carousel of discounted products on the homepage to logged in users.
- Display discount percentage and original price alongside discounted prices.

### Authentication and User Management
- Login System: Users can securely log in using credentials from the Fake Store API. Passwords are hidden by default with an option to toggle visibility.
- Protected Views: Certain features, such as the shopping cart and comparison list, are accessible only to logged-in users. After logging in, users are redirected to their previous page.

### Shopping Cart Functionality
- Adding Items to Cart: Users can add items to their shopping cart.
- Cart Management: Logged-in users can add, update quantities, remove, and clear items from their shopping cart. The cart's contents are persistent in local storage and updated dynamically across the app.
- Cart Visibility: The number of items and total cost are visible from any view and update in real time.

### Wishlist Features
- Adding Items to Wishlist: Users can add items to their shopping wishlist.
- Wishlist Management: Users can add, view, and manage items in their wishlist. Items can be added to the shopping cart, sorted, filtered, and cleared.
- Wishlist Interface: The wishlist is highlighted as a carousel on the homepage, with the number of items shown on the wishlist icon.

### Comparison List
-Product Comparison: Users can add products to a comparison list, view them side by side in a table format, and manage the list by removing or clearing items.

### Checkout and Payments
- Dummy Checkout: A dummy checkout process is implemented for demonstration purposes, allowing users to simulate a checkout.
- PayPal Integration: SwiftCart supports PayPal payments, allowing users to choose PayPal at checkout, complete transactions, and receive confirmation or error messages based on payment status.
- Dummy Checkout: During the checkout process, users can review their order summary, modify personal information, and view current orders.

### Discounts and Promotions
- Discounted Products Carousel: A carousel on the homepage features products with random discounts, showing original prices, discounted prices, and discount percentages. Users can view details of discounted products and see sale end dates.

### Theming and User Experience
- Theme Switching: Users can toggle between light and dark modes, with their theme preference remembered across sessions. The interface adapts to ensure consistent styling across different themes and devices.

## Technologies Used

- Vue.js 3: For building the user interface and managing application state.
- Pinia (state management)
- Pinia Plugin Persistedstate (persistent storage management)
- Vue Router (routing)
- Tailwind CSS (responsive and styling)
- Axios (HTTP client / HTTP requests to fetch and send data)
- JSONPlaceholder API (dummy API for demonstration purposes)
- PayPal Sandbox (payment processing)
- Real Favicon Generator (custom favicon)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn (v1.22 or higher)

### Installation

1. Clone the repository:

   ```bash
    git clone https://github.com/InnocentRangaka/JSF-Portfolio_Piece_INNRAN532_BCL2401_GroupB_InnocentRangaka_JSF04.git
    cd swiftcart
   ```
2. Install dependencies:
   
   ```bash
    npm install
    # or if you use yarn
    yarn install

   ```
3. Run the development server:

   ```bash
    npm run dev
    # or if you use yarn
    yarn dev
   ```
4. Build the project for production:
   
   ```bash
    npm run build
    # or if you use yarn
    yarn build

   ```

## User Stories

### Setup and Deployment
- As a developer, I deploy the project to a custom Vercel URL.
- As a user, I see a custom icon in the tab window. Favicon information is created and added correctly.
- As a developer, I use Real Favicon Generator for favicon creation and Meta Tags Generator for meta tag information, replacing all URLs with absolute Vercel URLs.

### UI/UX
- As a user, I see a grid of product cards.
- As a user, I see an image of the product when browsing.
- As a user, I see the title of the product when browsing.
- As a user, I see the price of the product when browsing.
- As a user, I see the category of the product when browsing.
- As a user, I can navigate to a detailed view of the product.
- As a user, I can see the title, description, image, price, category, rating, and number of reviews for the product in the detailed view.
- As a user, I can navigate back to the product grid/list page from a detailed product view.

### Data Fetching and State Management
- All shop data is loaded via a fetch call from the API (no hardcoded data).
- Data for a specific product is fetched from its individual API endpoint.
- There is a loading state while initial and new data is being loaded.

### User Interaction
- As a user, I can filter products by category (categories fetched from the API).
- As a user, I can sort products by lowest and highest price.
- As a user, I can reset filters and sorting to default without refreshing the app.
- As a user, I should see my applied filters and sorting after navigating to and from the detailed view.

### Logging In
- As a developer, I can log in any user from Fake Store API via the login endpoint.
- As a user, I have my password hidden when typing and can toggle visibility.
- As a developer, I ensure users can't submit empty username and password.
- As a developer, I notify users while waiting for authentication and if login fails.
- As a user, I am directed to the page I was previously trying to access after logging in.
- As a user, I see an option for logging out.
- As a developer, I store and clear the user's JWT in local storage for authentication.

### Shopping Cart
(Protected View - Only attempt after logging in functionality has been achieved)
- As a logged-in user, I can add products to my shopping cart.
- As a developer, I ensure the shopping cart is persistent in local storage and protected for logged-in users.
- As a logged-in user, I can view, update quantities, remove items, and clear my shopping cart.
- As a logged-in user, I see the number of items and total cost in the cart, which updates dynamically.
- As a developer, I handle multiple additions of cart items effectively.

### Comparison List
(Protected View - Only attempt after logging in functionality has been achieved)
- As a logged-in user, I can add items to and remove items from my comparison list.
- As a developer, I ensure the comparison page is protected and presented in a table format for side-by-side comparison.
- As a developer, I limit the number of items in the comparison list to avoid excessive table width.
- As a logged-in user, I can view product titles, images, descriptions, prices, and ratings side by side.
- As a logged-in user, I can clear my comparison list at once.

### PayPal Sandbox
- As a logged-in user, I can choose PayPal as my payment method during checkout.
- As a logged-in user, I am redirected to PayPal for payment processing and see a confirmation page after successful payment.
- As a logged-in user, I receive error messages for payment failures or cancellations.
- As a store admin, I verify payment status of orders made through PayPal Sandbox.

### Theme
- As a user, I can switch between dark and light modes and have my preference remembered across sessions.
- As a user, I have a default theme on first visit and can easily find and use the theme toggle switch.
- As a developer, I ensure all UI components are correctly styled and theme changes work across devices and screen sizes.

### Discounted Products
- As a developer, I apply random discounts to 5 products and display them in a carousel on the homepage.
- As a user, I see the discount percentage, discounted price, and original price with a strike-through in the carousel.
- As a user, I can view discounted products in detail and see the sale end date.

### Dummy Checkout
- As a logged-in user, I can proceed to the checkout page, modify my information, select PayPal as a payment method, and review my order summary.
- As a logged-in user, I place my order, receive a confirmation message or error message if payment fails, view past orders, and cancel orders if needed.

### Wishlist
- As a user, I can add products to my wishlist and see the number of wishlist items on the wishlist icon.
- As a logged-in user, I can add, view, remove, and clear items in wishlist. I can also add wishlist items to my shopping cart and view detailed information about wishlist products.
- The wishlist can be sorted and filtered.
- As a logged-in user, I can see my wishlist items, highlighted as a carousel on the homepage for easy access.
- As a logged-in user, my wishlist items are saved in local storage and synchronized with API data.

## Deployment and Presentation

### Deployment
The project is deployed to Vercel at [SwiftCart](https://innran532swiftcart.vercel.app/).
- The custom icon in the tab window has been added using Real Favicon Generator.

### Presentation
The project presentation is on YoutTube at [SwiftCart Code Presentation](https://youtu.be/8pcfXPGpKSA).