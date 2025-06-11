
import type { Config } from "tailwindcss";

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
				'fade-in-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'shimmer': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'text-flow': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'gradient-flow': {
					'0%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					},
					'100%': {
						'background-position': '0% 50%'
					}
				},
				'gradient-flow-reverse': {
					'0%': {
						'background-position': '100% 50%'
					},
					'50%': {
						'background-position': '0% 50%'
					},
					'100%': {
						'background-position': '100% 50%'
					}
				},
				'light-ray': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-100vh) scale(0.5)'
					},
					'50%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(100vh) scale(0.5)'
					}
				},
				'text-reveal': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)',
						filter: 'blur(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
						filter: 'blur(0px)'
					}
				},
				'bounce-x': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'50%': {
						transform: 'translateX(5px)'
					}
				},
				'shimmer-wave': {
					'0%': {
						'background-position': '-200% 0'
					},
					'100%': {
						'background-position': '200% 0'
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
				'card-rise': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px) scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'icon-glow': {
					'0%, 100%': {
						'box-shadow': '0 0 10px rgba(236, 72, 153, 0.3)'
					},
					'50%': {
						'box-shadow': '0 0 20px rgba(236, 72, 153, 0.6)'
					}
				},
				'testimonial-float': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px) rotateX(10deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) rotateX(0deg)'
					}
				},
				'star-twinkle': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.5',
						transform: 'scale(1.2)'
					}
				},
				'pricing-slide': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'feature-appear': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'check-mark': {
					'0%': {
						opacity: '0',
						transform: 'scale(0)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.2)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'cta-glow': {
					'0%, 100%': {
						'box-shadow': '0 0 30px rgba(236, 72, 153, 0.2), inset 0 0 30px rgba(147, 51, 234, 0.1)'
					},
					'50%': {
						'box-shadow': '0 0 60px rgba(236, 72, 153, 0.4), inset 0 0 60px rgba(147, 51, 234, 0.2)'
					}
				},
				'crown-bounce': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(0deg)'
					},
					'25%': {
						transform: 'translateY(-10px) rotate(5deg)'
					},
					'75%': {
						transform: 'translateY(-5px) rotate(-5deg)'
					}
				},
				'sparkle': {
					'0%, 100%': {
						transform: 'rotate(0deg) scale(1)'
					},
					'50%': {
						transform: 'rotate(180deg) scale(1.2)'
					}
				},
				'crown-glow': {
					'0%, 100%': {
						'filter': 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))'
					},
					'50%': {
						'filter': 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))'
					}
				},
				'spin-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-down': 'fade-in-down 0.6s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-up': 'slide-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'text-flow': 'text-flow 4s ease-in-out infinite',
				'gradient-flow': 'gradient-flow 6s ease-in-out infinite',
				'gradient-flow-reverse': 'gradient-flow-reverse 6s ease-in-out infinite',
				'light-ray': 'light-ray 8s ease-in-out infinite',
				'text-reveal': 'text-reveal 1s ease-out',
				'bounce-x': 'bounce-x 1s infinite',
				'shimmer-wave': 'shimmer-wave 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'card-rise': 'card-rise 0.8s ease-out',
				'icon-glow': 'icon-glow 2s ease-in-out infinite',
				'testimonial-float': 'testimonial-float 1s ease-out',
				'star-twinkle': 'star-twinkle 1.5s ease-in-out infinite',
				'pricing-slide': 'pricing-slide 0.8s ease-out',
				'feature-appear': 'feature-appear 0.6s ease-out',
				'check-mark': 'check-mark 0.5s ease-out',
				'cta-glow': 'cta-glow 3s ease-in-out infinite',
				'crown-bounce': 'crown-bounce 2s ease-in-out infinite',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'crown-glow': 'crown-glow 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 3s linear infinite'
			},
			backgroundSize: {
				'300%': '300%'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
