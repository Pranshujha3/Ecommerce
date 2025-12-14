/** @type {import('tailwindcss').config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors : {
                "primary-200" : "#ffbf00",
                "primary-100" : "#ffc929",
                "secondry-200" : "#00b050",
                "secondry-100" : "#0b1a78"        
            
            }
    },
},
plugins : [],
}