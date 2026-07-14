// vite.config.ts
import path from "path";
import { defineConfig } from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/vite@4.5.14_@types+node@18.19.130_sass@1.99.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vi_182e671191ec5821e2060bf2172c2aeb/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/unplugin-auto-import@0.16.7_8daf9c60460987133ca8be41fd7f8679/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/unplugin-vue-components@0.2_525d90fd0fda7364c4c42f59de4c9bf7/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/unplugin-vue-components@0.2_525d90fd0fda7364c4c42f59de4c9bf7/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import Icons from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/unplugin-icons@0.16.6_@vue+_3922ac3d5ba3ecc94537fda09ec0ad28/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///E:/%E6%99%BA%E6%8E%A2%E5%AE%9D%E9%A6%86/zhitanbaoguan.admin/node_modules/.pnpm/unplugin-icons@0.16.6_@vue+_3922ac3d5ba3ecc94537fda09ec0ad28/node_modules/unplugin-icons/dist/resolver.mjs";
var __vite_injected_original_dirname = "E:\\\u667A\u63A2\u5B9D\u9986\\zhitanbaoguan.admin";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  base: "/admin",
  build: {
    outDir: "admin",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500
  },
  server: {
    host: true,
    open: false,
    hmr: {
      overlay: false
    }
  },
  resolve: {
    alias: {
      "@": pathSrc
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        // 2) 强制屏蔽 legacy-js-api 警告
        silenceDeprecations: ["legacy-js-api"]
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      dts: path.resolve(pathSrc, "typings/auto-imports.d.ts"),
      resolvers: [ElementPlusResolver({
        importStyle: "sass",
        directives: true
      })],
      imports: ["vue", "vue-router", "pinia"]
    }),
    Components({
      dts: path.resolve(pathSrc, "typings/components.d.ts"),
      resolvers: [
        IconsResolver({
          prefix: false,
          // 默认为i,设置为false则不显示前缀
          enabledCollections: ["ep"],
          alias: {
            "icon": "ep"
            //配置别名
          }
        }),
        ElementPlusResolver({
          importStyle: "sass",
          directives: true
        })
      ]
    }),
    Icons({
      autoInstall: true,
      // 是否自动安装对应的图标库，默认为true
      scale: 1,
      // 图标缩放，默认为1
      defaultStyle: "",
      // 图标style
      defaultClass: "",
      // 图标class
      compiler: "vue3",
      // 编译方式，可选值：'vue2', 'vue3', 'jsx'
      jsx: "react"
      // jsx风格：'react' or 'preact'
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTY2N0FcdTYzQTJcdTVCOURcdTk5ODZcXFxcemhpdGFuYmFvZ3Vhbi5hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU2NjdBXHU2M0EyXHU1QjlEXHU5OTg2XFxcXHpoaXRhbmJhb2d1YW4uYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFNiU5OSVCQSVFNiU4RSVBMiVFNSVBRSU5RCVFOSVBNiU4Ni96aGl0YW5iYW9ndWFuLmFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCBJY29ucyBmcm9tIFwidW5wbHVnaW4taWNvbnMvdml0ZVwiXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiXHJcblxyXG5jb25zdCBwYXRoU3JjID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogJy9hZG1pbicsXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIG91dERpcjogJ2FkbWluJyxcclxuICAgICAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgICBobXI6IHtcclxuICAgICAgICAgICAgb3ZlcmxheTogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgJ0AnOiBwYXRoU3JjXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICAgICAgICAgIC8vIDIpIFx1NUYzQVx1NTIzNlx1NUM0Rlx1ODUzRCBsZWdhY3ktanMtYXBpIFx1OEI2Nlx1NTQ0QVxyXG4gICAgICAgICAgICAgICAgc2lsZW5jZURlcHJlY2F0aW9uczogWydsZWdhY3ktanMtYXBpJ10sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgICAgICBkdHM6IHBhdGgucmVzb2x2ZShwYXRoU3JjLCAndHlwaW5ncy9hdXRvLWltcG9ydHMuZC50cycpLFxyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgICAgIGltcG9ydFN0eWxlOiBcInNhc3NcIixcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IHRydWVcclxuICAgICAgICAgICAgfSldLFxyXG4gICAgICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsICd0eXBpbmdzL2NvbXBvbmVudHMuZC50cycpLFxyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogZmFsc2UsIC8vIFx1OUVEOFx1OEJBNFx1NEUzQWksXHU4QkJFXHU3RjZFXHU0RTNBZmFsc2VcdTUyMTlcdTRFMERcdTY2M0VcdTc5M0FcdTUyNERcdTdGMDBcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFtcImVwXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdpY29uJzogXCJlcFwiLCAvL1x1OTE0RFx1N0Y2RVx1NTIyQlx1NTQwRFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0U3R5bGU6IFwic2Fzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgSWNvbnMoe1xyXG4gICAgICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU4MUVBXHU1MkE4XHU1Qjg5XHU4OEM1XHU1QkY5XHU1RTk0XHU3Njg0XHU1NkZFXHU2ODA3XHU1RTkzXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBdHJ1ZVxyXG4gICAgICAgICAgICBzY2FsZTogMSwgLy8gXHU1NkZFXHU2ODA3XHU3RjI5XHU2NTNFXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RTNBMVxyXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IFwiXCIsIC8vIFx1NTZGRVx1NjgwN3N0eWxlXHJcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzczogXCJcIiwgLy8gXHU1NkZFXHU2ODA3Y2xhc3NcclxuICAgICAgICAgICAgY29tcGlsZXI6ICd2dWUzJywgLy8gXHU3RjE2XHU4QkQxXHU2NUI5XHU1RjBGXHVGRjBDXHU1M0VGXHU5MDA5XHU1MDNDXHVGRjFBJ3Z1ZTInLCAndnVlMycsICdqc3gnXHJcbiAgICAgICAgICAgIGpzeDogXCJyZWFjdFwiLCAvLyBqc3hcdTk4Q0VcdTY4M0NcdUZGMUEncmVhY3QnIG9yICdwcmVhY3QnXHJcbiAgICAgICAgfSlcclxuICAgIF1cclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlTLE9BQU8sVUFBVTtBQUMxVCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBUDFCLElBQU0sbUNBQW1DO0FBU3pDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUc3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYix1QkFBdUI7QUFBQSxFQUMzQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0QsU0FBUztBQUFBLElBQ2I7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLO0FBQUEsSUFDVDtBQUFBLEVBQ0o7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNELHFCQUFxQjtBQUFBLE1BQ2pCLE1BQU07QUFBQSxRQUNGLEtBQUs7QUFBQTtBQUFBLFFBRUwscUJBQXFCLENBQUMsZUFBZTtBQUFBLE1BQ3pDO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNQLEtBQUssS0FBSyxRQUFRLFNBQVMsMkJBQTJCO0FBQUEsTUFDdEQsV0FBVyxDQUFDLG9CQUFvQjtBQUFBLFFBQzVCLGFBQWE7QUFBQSxRQUNiLFlBQVk7QUFBQSxNQUNoQixDQUFDLENBQUM7QUFBQSxNQUNGLFNBQVMsQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLElBQzFDLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNQLEtBQUssS0FBSyxRQUFRLFNBQVMseUJBQXlCO0FBQUEsTUFDcEQsV0FBVztBQUFBLFFBQ1AsY0FBYztBQUFBLFVBQ1YsUUFBUTtBQUFBO0FBQUEsVUFDUixvQkFBb0IsQ0FBQyxJQUFJO0FBQUEsVUFDekIsT0FBTztBQUFBLFlBQ0gsUUFBUTtBQUFBO0FBQUEsVUFDWjtBQUFBLFFBQ0osQ0FBQztBQUFBLFFBQ0Qsb0JBQW9CO0FBQUEsVUFDaEIsYUFBYTtBQUFBLFVBQ2IsWUFBWTtBQUFBLFFBQ2hCLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDRixhQUFhO0FBQUE7QUFBQSxNQUNiLE9BQU87QUFBQTtBQUFBLE1BQ1AsY0FBYztBQUFBO0FBQUEsTUFDZCxjQUFjO0FBQUE7QUFBQSxNQUNkLFVBQVU7QUFBQTtBQUFBLE1BQ1YsS0FBSztBQUFBO0FBQUEsSUFDVCxDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
