// components/loaders/ToolSkeleton.js
export default function ToolSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-title shimmer" />
      <div className="skeleton-subtitle shimmer" />
      <div className="skeleton-box shimmer" />
      <div className="skeleton-box shimmer" />
    </div>
  );
}
