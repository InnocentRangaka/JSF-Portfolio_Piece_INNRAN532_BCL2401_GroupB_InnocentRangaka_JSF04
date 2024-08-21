import { watch, watchEffect } from 'vue';
import { useFetch } from '../utils/useFetch';
import { decodeJWTUserData } from '../utils/useSecurity'

/**
 * Fetches categories from the Fake Store API.
 * @returns {Promise<{response: string[], error: null} | {error: any, response: null}>} An object containing the response data or an error.
 */
export const fetchCategories = async (app) => {
  const { data, error, fetching } = await useFetch(`/products/categories`);
  while (fetching.value) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  watchEffect(() => {
    if (!fetching.value) {
      if (error.value) {
        app.setError({
          status: error.status,
          message: 'Data fetching failed :( , please check your network connection and reload.',
          type: 'network/fetch',
        })

        return;
      }
      
      if (data.value) {
        app.setCategories(data.value)
        // app.setLoading(false)
      }
    }
  })

  return {data, error, fetching };
};
  
/**
 * Fetches a single product by ID from the Fake Store API.
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<{response: Object, error: null} | {error: any, response: null}>} An object containing the product data or an error.
 */
export const fetchSingleProduct = async (id, app) => {
  app.setViewProduct([]);
  app.setProductsLoading(true);

  const { data, error, fetching } = await useFetch(`/products/${id}`);
  while (fetching.value) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  watchEffect(() => {
    if (!fetching.value) {
      if (error.value) {
        app.setError({
          status: error.status,
          message: 'Data fetching failed :( , please check your network connection and reload.',
          type: 'network/fetch',
        })

        return;
      }
      
      if (data.value) {
        // console.log(data.value)
        app.setViewProduct(data.value);
        app.setProductsLoading(false);
        setTimeout(() => {
          app.setPageLoading(false);
        }, 1000);
      }
    }
  })

  return {data, error, fetching };
};
  
/**
 * Fetches products from the Fake Store API based on the selected category or all products if no category is selected.
 * @param {Object} app - The application state object.
 * @returns {Promise<void>} Updates the application state with fetched products and handles loading state.
 */
export const fetchProducts = async (app) => {
  app.setProductsLoading(true);

  const url = app.filterItem !== 'All categories'
    ? `/category/${app.filterItem}`
    : `/`;

  const { data, error, fetching } = await useFetch(`/products/${url}`);
  let DataProducts = null;

  // Watch fetching to detect when the request is completed
  watch(fetching, async (isFetching) => {
    if (!isFetching) {
      if (error.value) {
        app.setError({
          status: error.value.status,
          message: 'Data fetching failed :( , please check your network connection and reload.',
          type: 'network/fetch',
        });
      } else if (data.value) {
        DataProducts = app.applyDiscounts(app, data.value.slice());
        
        app.setProducts(DataProducts);
        app.setOriginalProducts(JSON.parse(JSON.stringify(DataProducts)));
        app.searchProducts();
        app.sortProducts();
      }
    }
  });

  // Return data, error, and fetching for further use if needed
  return { data: DataProducts, error, fetching };
};

  
/**
 * Fetches favourite products by their IDs, updates the app's state with the fetched data,
 * and handles loading and error states.
 *
 * @param {Object} objectArray - An object containing the product IDs to fetch.
 * @param {Object} app - The app instance with methods to update the app's state.
 * @returns {Promise<Object>} A promise that resolves to an object containing the list of fetched products and a boolean indicating if an error occurred.
 */
export const fetchFavourites = async (objectArray, app) => {
  app.setProductsLoading(true);

  const ids = [...new Set(Object.values(objectArray))];
  const promises = ids.map(id => useFetch(`/products/${id}`));

  const results = await Promise.all(promises);

  let list = [];
  let errorOccurred = false;

  await Promise.all(
    results.map(async ({ data, error, fetching }) => {
      return new Promise((resolve) => {
        watch(fetching, (isFetching) => {
          if (!isFetching) {
            if (error.value) {
              errorOccurred = true;
              app.setError({
                status: error.value.status,
                message: 'Data fetching failed :( , please check your network connection and reload.',
                type: 'network/fetch',
              });
            } else if (data.value) {
              list.push(data.value);
            }
            resolve();
          }
        });
      });
    })
  );

  
  let DataProducts = null;

  if (!errorOccurred && list.length > 0) {
    if(app.discountedProducts.length > 0){
      const isDiscounted = list.map((listItem) => {
        return app.discountedProducts.find((product) => product.id === listItem.id)
      })

      const cleanDiscounted = isDiscounted.filter((product) => product !== undefined)
      if(cleanDiscounted.length > 0){
        DataProducts = {
          ...list,
          ...cleanDiscounted,
        }
      }
      else {
        DataProducts = {...list};
      }
    }
    DataProducts = DataProducts.sort((a, b) => DataProducts.indexOf(a) - DataProducts.indexOf(b));
    app.setFavourites(DataProducts)
    app.setProducts(DataProducts);
    app.setOriginalProducts(JSON.parse(JSON.stringify(DataProducts)));
    app.searchProducts();
    app.sortProducts();
  }

  app.setProductsLoading(false);

  setTimeout(() => {
    app.pageLoading = false;
  }, 1000);

  return { list: DataProducts, error: errorOccurred };
};

export const fetchUserDataByToken = async (token) => {
  
  let fetchData = null,
  fetchError = null,
  fetchLoading = false;

  if (token) {
    const decodedToken = decodeJWTUserData(token);
    const { data, error, fetching } = await useFetch(`users/${decodedToken.sub}`)

    while (fetching.value) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    fetchData = data;
    fetchError = error;
    fetchLoading = fetching;

  } else {
    fetchError = {
      status: 'No Token',
      message: 'We could not authenticate your credentials',
      type: 'Auth/Credentials',
    }
  }

  // Return the entire response data for further usage
  return { data: fetchData, error: fetchError, loading: fetchLoading};
}

export const fetchCompareListItems = async (objectArray, app) => {
  app.setProductsLoading(true);

  const ids = [...new Set(Object.values(objectArray))];
  const promises = ids.map(id => useFetch(`/products/${id}`));

  const results = await Promise.all(promises);

  let list = [];
  let errorOccurred = false;

  await Promise.all(
    results.map(async ({ data, error, fetching }) => {
      return new Promise((resolve) => {
        watch(fetching, (isFetching) => {
          if (!isFetching) {
            if (error.value) {
              errorOccurred = true;
              app.setError({
                status: error.value.status,
                message: 'Data fetching failed :( , please check your network connection and reload.',
                type: 'network/fetch',
              });
            } else if (data.value) {
              list.push(data.value);
            }
            resolve();
          }
        });
      });
    })
  );
  
  let DataProducts = null;

  if (!errorOccurred && list.length > 0) {
    if(app.discountedProducts.length > 0){
      const isDiscounted = list.map((listItem) => {
        return app.discountedProducts.find((product) => product.id === listItem.id)
      })

      const cleanDiscounted = isDiscounted.filter((product) => product !== undefined)
      if(cleanDiscounted.length > 0){
        DataProducts = {
          ...list,
          ...cleanDiscounted,
        }
      }
      else {
        DataProducts = {...list};
      }
      
    }
    DataProducts = DataProducts.sort((a, b) => DataProducts.indexOf(a) - DataProducts.indexOf(b));
    app.setCompareList(DataProducts)
    app.setProducts(DataProducts);
    app.setOriginalProducts(JSON.parse(JSON.stringify(DataProducts)));
    app.searchProducts();
    app.sortProducts();
  }

  app.setProductsLoading(false);

  setTimeout(() => {
    app.pageLoading = false;
  }, 1000);

  return { list, error: errorOccurred };
};