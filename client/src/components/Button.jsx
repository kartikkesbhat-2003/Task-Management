import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variantClasses = {
  primary: 'shadow-soft',
  outline: 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100',
  accent: 'border border-primary/40 bg-white shadow-sm hover:bg-primary/10',
  ghost: 'text-slate-600 hover:bg-slate-100',
  icon: 'border border-slate-200 bg-white text-slate-500 hover:text-primary',
  danger: 'shadow-soft',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
}

const variantStyles = {
  primary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
  },
  accent: {
    color: '#4c6ef5',
  },
  danger: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
  }
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'h-10 w-10 p-0 text-base',
  'icon-sm': 'h-8 w-8 p-0 text-sm'
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, className = '', to, href, children, style, ...props },
  ref
) {
  const Component = to ? Link : href ? 'a' : 'button'
  const resolvedVariant = variantClasses[variant] || variantClasses.primary
  const resolvedSize = sizeClasses[size] || sizeClasses.md
  const classes = [baseClasses, resolvedVariant, resolvedSize, fullWidth ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ')

  const extraProps = {}
  if (Component === 'button' && props.type === undefined) {
    extraProps.type = 'button'
  }

  // Apply inline styles for critical color variants to override any global CSS
  const inlineStyle = {
    ...variantStyles[variant],
    ...style
  }

  return (
    <Component ref={ref} className={classes} style={inlineStyle} to={to} href={href} {...extraProps} {...props}>
      {children}
    </Component>
  )
})

export default Button
