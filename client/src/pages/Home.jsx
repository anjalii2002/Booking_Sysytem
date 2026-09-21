import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarCheck,
  Monitor,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 animate-fade-in pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 text-white shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Book Your Perfect Workspace <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-white">
              In Seconds
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Reserve individual desks, executive meeting rooms, and collaborative hubs at CoWork Hub. Check real-time availability, manage bookings, and boost your daily productivity.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/spaces"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-teal-500/25 active:scale-98"
            >
              <span>Browse Spaces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {user ? (
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all"
              >
                <span>My Bookings</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all"
              >
                <span>Create Free Account</span>
              </Link>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Real-time Slot Verification
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Instant Approvals
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Flexible Schedule
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Designed for Seamless Collaboration
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need for a frictionless work experience, whether you need quiet deep work or team brainstorms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Individual Desks',
              desc: 'Quiet ergonomic desks equipped with dual monitors, high-speed Wi-Fi, and power outlets.',
              icon: Monitor,
              accent: 'bg-teal-50 text-teal-600 border-teal-200/80',
            },
            {
              title: 'Meeting Rooms',
              desc: 'Fully tech-equipped conference rooms for client pitches, team standups, and workshops.',
              icon: Users,
              accent: 'bg-teal-50 text-teal-600 border-teal-200/80',
            },
            {
              title: 'Real-Time Availability',
              desc: 'Instant visual slot availability checking prevent double-booking or scheduling conflicts.',
              icon: CalendarCheck,
              accent: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
            },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${item.accent}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link to="/spaces" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">
                    <span>Explore options</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Real-time Sync</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">24/7</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Instant Reservation</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">HD</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Equipped Rooms</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">Zero</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Booking Friction</div>
          </div>
        </div>
      </section>
    </div>
  );
}
