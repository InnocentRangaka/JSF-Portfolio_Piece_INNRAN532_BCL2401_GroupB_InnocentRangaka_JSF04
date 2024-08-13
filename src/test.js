AsyncPlainLayout(layoutName) {
    return defineAsyncComponent({
      loader: () => import(`../components/includes/${layoutName}.vue`),
      delay: 10,
      timeout: 3000,
      suspensible: false, // Disabled suspense to handle loading and error states manually
      onError(error, retry, fail, attempts) {
        console.error(`Error loading component: ${layoutName}`, error);
        if (attempts <= 3) {
          // Retry loading the component up to 3 times
          retry();
        } else {
          // After 3 attempts, fail loading
          fail();
        }
      },
    });
  },
  
  getCachedLayout(layoutName, loader) {
    if (!this.layoutCache[layoutName]) {
      this.layoutCache[layoutName] = shallowRef(markRaw(loader()));
    }
    return this.layoutCache[layoutName];
  },

  updateLayout: async (path) => {
    const appStore = useAppStore();

    let layout = {};

    switch (true) {
      case path.startsWith('/auth'):
        // appStore.currentLayout.component['__name'] = 'PlainLayout';
        layout.name = 'PlainLayout';
        // appStore.currentLayout.component = PlainLayout;
        // layout.component = appStore.getCachedLayout('PlainLayout', () => appStore.AsyncPlainLayout('PlainLayout'));
        break;
      case path.startsWith('/cart'):
      case path.startsWith('/checkout'):
        layout.name = 'PlainLayout';
        layout.component = appStore.getCachedLayout('PlainLayout', () => this.AsyncPlainLayout('PlainLayout'));
        break;
      default:
        layout.name = 'MainLayout';
        // appStore.currentLayout.component = MainLayout;
        // layout.component = appStore.getCachedLayout('MainLayout', () => appStore.AsyncPlainLayout('MainLayout'));
    }

    if (layout.name !== appStore.currentLayout.name) {
      console.log('NEW LAYOUT:', layout.name, layout.component, appStore.currentLayout.name, appStore.currentLayout.component.__name)
      // appStore.currentLayout.name = layout.name;
      // appStore.currentLayout.component = appStore.getCachedLayout(layout.name, () => appStore.AsyncPlainLayout(layout.name));
    }

    appStore.currentLayout.name = layout.name;
      appStore.currentLayout.component = appStore.getCachedLayout(layout.name, () => appStore.AsyncPlainLayout(layout.name));

    // console.log(layout.name, appStore.currentLayout.name, appStore.currentLayout.component, layout.component)
    // console.log(appStore.getCachedLayout('MainLayout', () => appStore.AsyncPlainLayout('MainLayout')))
    return appStore.currentLayout;
  },