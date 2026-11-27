interface SkeletonProps {
  className?: string
}

/** Bloque gris mientras llegan los datos; el estado lo anuncia el contenedor. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-md bg-fill animate-pulse motion-reduce:animate-none ${className}`}
    />
  )
}
