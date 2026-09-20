import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#171512', paper:'#f5f1e8', ember:'#e86c45', moss:'#899b78', fog:'#ded8cb' }, fontFamily:{display:['Georgia','serif'],sans:['Arial','sans-serif']} } }, plugins: [] }
export default config
