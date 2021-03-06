import { ComponentPropsWithoutRef, forwardRef, PropsWithChildren } from 'react'

type LinkProps = ComponentPropsWithoutRef<'a'>

const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<LinkProps>>(function Link(props, ref) {
  return (
    <a
      tabIndex={0}
      sx={{
        margin: 0,
        cursor: 'pointer',
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline 2px var(--color-accent)'
        }
      }}
      ref={ref}
      {...props}
    >
      {props.children}
    </a>
  )
})

export default Link