export default function PropertySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-video w-full bg-gray-200" />

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />

        {/* Stats */}
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded-lg w-16" />
          <div className="h-4 bg-gray-200 rounded-lg w-16" />
          <div className="h-4 bg-gray-200 rounded-lg w-16" />
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded-lg w-1/3 mt-1" />

        {/* Footer */}
        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
          <div className="flex-1 h-9 bg-gray-200 rounded-xl" />
          <div className="w-10 h-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
