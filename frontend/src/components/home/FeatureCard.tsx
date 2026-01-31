// Tipos
import type { Feature } from "@/lib/types";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
  iconBgColor,
}: Feature) {
  return (
    <article className="bg-white border border-slate-100 p-8 h-full rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 ${iconBgColor} group-hover:rotate-12 transition-all duration-300`}
        aria-hidden="true"
      >
        <Icon className={`size-6 ${iconColor}`} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </article>
  );
}
