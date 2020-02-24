module.exports = {
  mode: 'spa', // or 'universal'
  head: {
    title: 'Porchegg'
  },
  loading: false,
  plugins: [
    {ssr: true, src: '@/plugins/icons.js'},
    
    {ssr: true, src: '@/plugins/element.js'},
  ],
  buildModules: [
    
  ],
  modules: [
    
  ],
  env: {
    SERVER_API: 'http://localhost:9000',
  }
};
