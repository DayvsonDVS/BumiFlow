import { resolve } from 'path'
import { defineConfig } from 'vite'
import BumiFlowPluginCopy3 from './src/plugins/vite-plugin-bumi-flow-property'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [BumiFlowPluginCopy3('../assets/scss/main.scss')],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bumi-flow',
      fileName: 'bumi-flow'
    }
  }
})
