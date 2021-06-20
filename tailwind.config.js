const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const Color = require('color')

module.exports = {
    prefix: '',
    purge: {
      content: [
        './src/**/*.{html,ts,css,scss,sass,less,styl}',
      ]
    },
    theme: {
      themeVariants: ['dark'],
      customForms: (theme) => ({
        default: {
          'input, textarea': {
            '&::placeholder': {
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        gray: {
          '50': '#f9fafb',
          '100': '#f4f5f7',
          '200': '#e5e7eb',
          '300': '#d5d6d7',
          '400': '#9e9e9e',
          '500': '#707275',
          '600': '#4c4f52',
          '700': '#24262d',
          '800': '#1a1c23',
          '900': '#121317',
        },
        'cool-gray': {
          '50': '#fbfdfe',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cfd8e3',
          '400': '#97a6ba',
          '500': '#64748b',
          '600': '#475569',
          '700': '#364152',
          '800': '#27303f',
          '900': '#1a202e',
        },
        red: {
          '50': '#e8d1d1',
          '100': '#ffd8d8',
          '200': '#fcbbbb',
          '300': '#f8a3a3',
          '400': '#fb7e7e',
          '500': '#ff5757',
          '600': '#fb3c3c',
          '700': '#f52525',
          '800': '#cb1111',
          '900': '#920909',
        },
        orange: {
          '50': '#fbe9e5',
          '100': '#f9d3ca',
          '200': '#f5b0a0',
          '300': '#f5917a',
          '400': '#FC7C5E',
          '500': '#ff6643',
          '600': '#fb4d2a',
          '700': '#da3818',
          '800': '#bb2a0b',
          '900': '#962206',
        },
        yellow: {
          '50': '#fcf8f1',
          '100': '#fbeadf',
          '200': '#f9d5ba',
          '300': '#f8cb90',
          '400': '#FFC168',
          '500': '#f9bd4e',
          '600': '#eda91c',
          '700': '#c98d0f',
          '800': '#a77408',
          '900': '#674602',
        },
        green: {
          '50': '#e5fbf0',
          '100': '#c9fbdf',
          '200': '#a3ffd7',
          '300': '#6bf4bf',
          '400': '#2fd99c',
          '500': '#17b07c',
          '600': '#098b61',
          '700': '#046646',
          '800': '#024c33',
          '900': '#013d28',
        },
        teal: {
          '50': '#edfafa',
          '100': '#d5f5f6',
          '200': '#afecef',
          '300': '#7edce2',
          '400': '#19CAD3',
          '500': '#109fa7',
          '600': '#047481',
          '700': '#036672',
          '800': '#05505c',
          '900': '#014451',
        },
        blue: {
          '50': '#ebf5ff',
          '100': '#e1effe',
          '200': '#c3ddfd',
          '300': '#a4cafe',
          '400': '#76a9fa',
          '500': '#3f83f8',
          '600': '#1c64f2',
          '700': '#1a56db',
          '800': '#1e429f',
          '900': '#233876',
        },
        indigo: {
          '50': '#f0f5ff',
          '100': '#e5edff',
          '200': '#cddbfe',
          '300': '#b4c6fc',
          '400': '#8da2fb',
          '500': '#6875f5',
          '600': '#5850ec',
          '700': '#5145cd',
          '800': '#42389d',
          '900': '#362f78',
        },
        purple: {
          '50': '#f6f5ff',
          '100': '#edebfe',
          '200': '#dcd7fe',
          '300': '#cabffd',
          '400': '#ac94fa',
          '500': '#9061f9',
          '600': '#7e3af2',
          '700': '#6c2bd9',
          '800': '#5521b5',
          '900': '#4a1d96',
        },
        pink: {
          '50': '#fee9ed',
          '100': '#fbdde6',
          '200': '#fec9d3',
          '300': '#f8a6b5',
          '400': '#fe859d',
          '500': '#F85D7C',
          '600': '#f84166',
          '700': '#f12953',
          '800': '#b70d34',
          '900': '#8d0723',
        },
      },
      extend: {
        maxHeight: {
          '0': '0',
          xl: '36rem',
        },
        fontFamily: {
          sans: ['Inter', ...defaultTheme.fontFamily.sans]
        },
      },
    },
  variants: {
    backgroundColor: [
      'hover',
      'focus',
      'active',
      'odd',
      'dark',
      'dark:hover',
      'dark:focus',
      'dark:active',
      'dark:odd',
    ],
    display: ['responsive', 'dark'],
    textColor: [
      'focus-within',
      'hover',
      'active',
      'dark',
      'dark:focus-within',
      'dark:hover',
      'dark:active',
    ],
    placeholderColor: ['focus', 'dark', 'dark:focus'],
    borderColor: ['focus', 'hover', 'dark', 'dark:focus', 'dark:hover'],
    divideColor: ['dark'],
    boxShadow: ['focus', 'dark:focus'],
  },
    plugins: [
      require('tailwindcss-multi-theme'),
      require('@tailwindcss/custom-forms'),
      plugin(({ addUtilities, e, theme, variants }) => {
        const newUtilities = {}
        Object.entries(theme('colors')).map(([name, value]) => {
          if (name === 'transparent' || name === 'current') return;
          const color = value[300] ? value[300] : value;
          const hsla = Color(color).alpha(0.45).hsl().string();

          newUtilities[`.shadow-outline-${name}`] = {
            'box-shadow': `0 0 0 3px ${hsla}`,
          }
        })

        addUtilities(newUtilities, variants('boxShadow'));
      }),
    ],
};
