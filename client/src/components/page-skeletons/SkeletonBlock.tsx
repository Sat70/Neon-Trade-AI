/**
 * Reusable skeleton placeholder with neon shimmer. Used by page skeletons.
 */

type SkeletonBlockProps = {
  className?: string
  rounded?: 'none' | 'md' | 'xl' | '2xl' | 'full'
}

const roundedClass = {
  none: '',
  md: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

const SkeletonBlock = ({ className = '', rounded = '2xl' }: SkeletonBlockProps) => {
  return (
    <div
      className={`skeleton-shimmer border border-white/10 bg-white/5 ${roundedClass[rounded]} ${className}`}
      aria-hidden
    />
  )
}

export default SkeletonBlock
