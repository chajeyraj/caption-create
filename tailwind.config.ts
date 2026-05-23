import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.9)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'slide-from-right': {
					'0%':   { opacity: '0', transform: 'translateX(28px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'slide-from-left': {
					'0%':   { opacity: '0', transform: 'translateX(-28px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'heartbeat': {
					'0%':   { transform: 'scale(1)' },
					'25%':  { transform: 'scale(1.35)' },
					'50%':  { transform: 'scale(1)' },
					'75%':  { transform: 'scale(1.15)' },
					'100%': { transform: 'scale(1)' },
				},
				'page-enter': {
					'0%':   { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-underline': {
					'0%':   { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' },
				},
				'icon-swap': {
					'0%':   { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
				},
				'wobble': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'20%':      { transform: 'rotate(-12deg)' },
					'40%':      { transform: 'rotate(10deg)' },
					'60%':      { transform: 'rotate(-6deg)' },
					'80%':      { transform: 'rotate(4deg)' },
				},
				'shimmer-slide': {
					'0%':   { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(300%)' },
				},
				'count-flip-up': {
					'0%':   { opacity: '0', transform: 'translateY(60%)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out both',
				'float': 'float 3s ease-in-out infinite',
				'scale-in': 'scale-in 0.3s ease-out both',
				'shimmer': 'shimmer 2s linear infinite',
				'slide-from-right': 'slide-from-right 0.22s ease-out both',
				'slide-from-left':  'slide-from-left  0.22s ease-out both',
				'heartbeat': 'heartbeat 0.4s ease-out',
				'page-enter': 'page-enter 0.25s ease-out both',
				'icon-swap': 'icon-swap 0.2s ease-out both',
				'wobble': 'wobble 0.5s ease-in-out',
				'shimmer-slide': 'shimmer-slide 1.5s ease-in-out infinite',
				'count-flip-up': 'count-flip-up 0.2s ease-out both',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
			}
		}
	},
	plugins: [animate],
} satisfies Config;
