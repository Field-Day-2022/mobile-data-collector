/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'asu-maroon': '#8C1D40',
                'asu-gold': '#FFC627',
            },
            fontFamily: {
                openSans: ['Open\\ Sans', 'sans-serif'],
            },
            backgroundImage: () => ({
                'gradient-radial-to-tr':
                    'radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))',
                'gradient-radial-to-tl':
                    'radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))',
                'gradient-radial-to-br':
                    'radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))',
                'gradient-radial-to-bl':
                    'radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }),
        },
    },
    daisyui: {
        // themes: false,
        themes: [
            {
                mytheme: {
                    primary: '#FFC627',
                    secondary: '#8C1D40',
                    accent: '#1FB2A6',
                    neutral: '#191D24',
                    'base-100': '#2A303C',
                    info: '#3ABFF8',
                    success: '#36D399',
                    warning: '#FBBD23',
                    error: '#F87272',
                },
            },
        ],
    },
    plugins: [require('daisyui'), require('tailwind-scrollbar')({ nocompatible: true })],
};
