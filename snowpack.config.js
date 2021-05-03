/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: { url: '/src' },
    public: { url: '/', static: true },
  },
  plugins: ['@snowpack/plugin-babel', '@snowpack/plugin-dotenv'],
  optimize: { minify: true },
  buildOptions: {
    sourcemap: true,
  },
  exclude: ['*.d.ts'],
};
