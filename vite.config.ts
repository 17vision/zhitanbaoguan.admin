import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    base: '/admin',
    build: {
        outDir: 'admin',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1500,
    },
    server: {
        host: true,
        open: false,
        hmr: {
            overlay: false,
        },
    },
    resolve: {
        alias: {
            '@': pathSrc
        }
    },
    plugins: [
        vue(),
        AutoImport({
            dts: path.resolve(pathSrc, 'typings/auto-imports.d.ts'),
            resolvers: [ElementPlusResolver({
                importStyle: "sass",
                directives: true
            })],
            imports: ['vue', 'vue-router', 'pinia'],
        }),
        Components({
            dts: path.resolve(pathSrc, 'typings/components.d.ts'),
            resolvers: [
                IconsResolver({
                    prefix: false, // 默认为i,设置为false则不显示前缀
                    enabledCollections: ["ep"],
                    alias: {
                        'icon': "ep", //配置别名
                    }
                }),
                ElementPlusResolver({
                    importStyle: "sass",
                    directives: true
                })
            ],
        }),
        Icons({
            autoInstall: true, // 是否自动安装对应的图标库，默认为true
            scale: 1, // 图标缩放，默认为1
            defaultStyle: "", // 图标style
            defaultClass: "", // 图标class
            compiler: 'vue3', // 编译方式，可选值：'vue2', 'vue3', 'jsx'
            jsx: "react", // jsx风格：'react' or 'preact'
        })
    ]
})