export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`w-full min-w-0 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 ${className}`}>
      {children}
    </div>
  )
}
