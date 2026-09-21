import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Clock,
  Wrench,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function AdminDashboard() {
  const links = [
    {
      to: '/admin/spaces',
      title: 'Space Inventory',
      desc: 'Create, inspect, edit, or deactivate desks and meeting rooms.',
      icon: Building2,
      accent: 'bg-teal-50 text-teal-600 border-teal-200/80',
    },
    {
      to: '/admin/bookings',
      title: 'Booking Master Log',
      desc: 'View, filter, and audit all member reservations across dates.',
      icon: Calendar,
      accent: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
    {
      to: '/admin/approvals',
      title: 'Pending Approvals Queue',
      desc: 'Review, accept, or reject incoming reservation requests.',
      icon: Clock,
      accent: 'bg-amber-50 text-amber-600 border-amber-200/80',
    },
    {
      to: '/admin/maintenance',
      title: 'Maintenance Scheduler',
      desc: 'Block out space date/time ranges for repairs or cleaning.',
      icon: Wrench,
      accent: 'bg-rose-50 text-rose-600 border-rose-200/80',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized hub for workspace operations, bookings control, and maintenance scheduling.
          </p>
        </div>

        <Link
          to="/admin/spaces/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Space</span>
        </Link>
      </div>

      {/* Grid of Command Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((l) => {
          const IconComponent = l.icon;
          return (
            <Link key={l.to} to={l.to} className="group block">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${l.accent}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5">
                    {l.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{l.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                  <span>Open Console</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
