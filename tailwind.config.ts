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
			fontFamily: {
				sans: ['DM Sans', 'system-ui', 'sans-serif'],
				serif: ['Lora', 'Georgia', 'serif'],
				display: ['Playfair Display', 'Georgia', 'serif'],
			},
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
				},
				amber: {
					ink: 'hsl(38, 90%, 54%)',
					glow: 'hsl(38, 90%, 65%)',
					dim: 'hsl(38, 90%, 40%)',
				},
				violet: {
					soft: 'hsl(271, 60%, 70%)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				'3xl': 'calc(var(--radius) + 16px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(32px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-14px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.92)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
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
					'25%':  { transform: 'scale(1.38)' },
					'50%':  { transform: 'scale(1)' },
					'75%':  { transform: 'scale(1.18)' },
					'100%': { transform: 'scale(1)' },
				},
				'page-enter': {
					'0%':   { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
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
				/* Spring + liquid + ripple keyframes */
				'spring-in': {
					'0%':   { transform: 'scale(0.86) translateY(24px)', opacity: '0' },
					'50%':  { transform: 'scale(1.03) translateY(-5px)', opacity: '1' },
					'70%':  { transform: 'scale(0.98) translateY(3px)' },
					'85%':  { transform: 'scale(1.01) translateY(-1px)' },
					'100%': { transform: 'scale(1)    translateY(0)' },
				},
				'like-ripple': {
					'0%':   { transform: 'scale(0.5)', opacity: '0.5' },
					'100%': { transform: 'scale(3)',   opacity: '0'   },
				},
				'word-unmask': {
					'from': { clipPath: 'inset(100% 0 0 0)', transform: 'translateY(10px)', opacity: '0' },
					'to':   { clipPath: 'inset(0% 0 0 0)',   transform: 'translateY(0)',    opacity: '1' },
				},
				'digit-roll': {
					'from': { transform: 'translateY(0)' },
					'to':   { transform: 'translateY(var(--digit-offset))' },
				},
				/* New Ink & Amber keyframes */
				'word-in': {
					'0%':   { opacity: '0', transform: 'translateY(14px) scale(0.96)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
				},
				'word-out': {
					'0%':   { opacity: '1', transform: 'translateY(0) scale(1)' },
					'100%': { opacity: '0', transform: 'translateY(-14px) scale(0.96)' },
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%':      { opacity: '0' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(38 90% 54% / 0.25)' },
					'50%':      { boxShadow: '0 0 50px hsl(38 90% 54% / 0.55), 0 0 80px hsl(38 90% 54% / 0.15)' },
				},
				'gradient-drift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%':      { backgroundPosition: '100% 50%' },
				},
				'slide-up-fade': {
					'0%':   { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-underline': {
					'0%':   { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.55s ease-out both',
				'fade-up': 'fade-up 0.6s ease-out both',
				'float': 'float 4s ease-in-out infinite',
				'scale-in': 'scale-in 0.35s ease-out both',
				'shimmer': 'shimmer 2s linear infinite',
				'slide-from-right': 'slide-from-right 0.22s ease-out both',
				'slide-from-left':  'slide-from-left  0.22s ease-out both',
				'heartbeat': 'heartbeat 0.4s ease-out',
				'page-enter': 'page-enter 0.28s ease-out both',
				'icon-swap': 'icon-swap 0.2s ease-out both',
				'wobble': 'wobble 0.5s ease-in-out',
				'shimmer-slide': 'shimmer-slide 1.6s ease-in-out infinite',
				'count-flip-up': 'count-flip-up 0.22s ease-out both',
				'spring-in': 'spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
				'like-ripple': 'like-ripple 0.55s cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
				'word-unmask': 'word-unmask 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
				/* New */
				'word-in': 'word-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
				'word-out': 'word-out 0.22s ease-in both',
				'blink': 'blink 1.1s step-start infinite',
				'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
				'gradient-drift': 'gradient-drift 6s ease infinite',
				'slide-up-fade': 'slide-up-fade 0.5s ease-out both',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
				'amber-sm': '0 0 16px hsl(38 90% 54% / 0.2)',
				'amber-md': '0 0 30px hsl(38 90% 54% / 0.35)',
				'amber-lg': '0 0 60px hsl(38 90% 54% / 0.4)',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
			}
		}
	},
	plugins: [animate],
} satisfies Config;
