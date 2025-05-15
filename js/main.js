const app = Vue.createApp({
  data() {
      return {
        currentView: 'list' // Default view
      };
    }
  });

app.mount('#eventApp');