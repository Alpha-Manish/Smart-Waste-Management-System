import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Truck, 
  Users, 
  Globe2, 
  ArrowRight,
  Recycle,
  Server,
  Cloud,
  Smartphone,
  BrainCircuit,
  BarChart4,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-200">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/40 mix-blend-overlay" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 mt-8">
            Smart Urban Waste <br className="hidden md:block" />
            Management System
          </h1>
          
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Empowering modern cities with AI-based prediction, real-time analytics, and optimized routing for a cleaner, sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/citizen" 
              className="group flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#overview" 
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Explore Features
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </section>

      {/* 2. Project Overview */}
      <section id="overview" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-slate-200 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-white border border-slate-100 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <BrainCircuit className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">The Intelligence Layer</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Traditional waste management is reactive. Our system uses advanced machine learning algorithms to analyze historical fill-levels, weather patterns, and local events to predict when bins will be full before they overflow.
                </p>
                <div className="space-y-4">
                  {[
                    "Reduces collection costs by up to 30%",
                    "Minimizes carbon footprint from fleet operations",
                    "Eliminates overflowing bins in public spaces"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Project Overview</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
                Transforming Cities Through Smart Infrastructure
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We integrate IoT sensors, artificial intelligence, and cloud computing to create a seamless, efficient waste management ecosystem. Our platform connects municipal authorities, collection fleets, and citizens on a single unified interface.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-extrabold text-emerald-600 mb-2">98%</div>
                  <div className="text-slate-600 font-medium">Prediction Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-emerald-600 mb-2">40%</div>
                  <div className="text-slate-600 font-medium">Route Optimization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Core Capabilities</h2>
            <h3 className="text-4xl font-extrabold text-slate-900">Designed for Modern Municipalities</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Predictive Analytics",
                description: "Machine learning models forecast waste generation patterns based on historical data.",
                icon: BrainCircuit,
                color: "text-emerald-600",
                bg: "bg-teal-50"
              },
              {
                title: "Dynamic Route Optimization",
                description: "Real-time generation of the most efficient collection routes to save fuel and time.",
                icon: Truck,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Real-time IoT Monitoring",
                description: "Smart sensors provide live updates on bin fill-levels and operational status.",
                icon: Activity,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Citizen Engagement App",
                description: "Empowers residents to report issues, track collections, and learn recycling tips.",
                icon: Users,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Actionable Insights",
                description: "Comprehensive dashboards for administrators to track KPIs and performance metrics.",
                icon: BarChart4,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Sustainability Tracking",
                description: "Monitor and report on carbon emission reductions and recycling rates.",
                icon: Leaf,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SDG Impact */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-emerald-300 font-bold tracking-wide uppercase text-sm mb-3">Global Impact</h2>
            <h3 className="text-4xl font-extrabold mb-6">Advancing UN Sustainable Development Goals</h3>
            <p className="text-teal-100 text-lg">Our technology directly contributes to key global sustainability targets by optimizing resources and reducing urban pollution.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <SDGCard 
              number="11"
              title="Sustainable Cities"
              description="Making cities inclusive, safe, resilient, and sustainable through intelligent waste infrastructure."
              icon={Globe2}
            />
            <SDGCard 
              number="12"
              title="Responsible Consumption"
              description="Ensuring sustainable consumption and production patterns by maximizing recycling efficiency."
              icon={Recycle}
            />
            <SDGCard 
              number="13"
              title="Climate Action"
              description="Taking urgent action to combat climate change by reducing fleet carbon emissions."
              icon={Leaf}
            />
          </div>
        </div>
      </section>

      {/* 5. Technology Stack */}
      <section className="py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-emerald-400 font-bold tracking-wide uppercase text-sm mb-3">Architecture</h2>
          <h3 className="text-4xl font-extrabold text-white mb-16">Powered by Modern Technologies</h3>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            <TechBadge icon={Cloud} name="Cloud Infrastructure" />
            <TechBadge icon={Smartphone} name="React Web Apps" />
            <TechBadge icon={Server} name="Node.js Backend" />
            <TechBadge icon={BrainCircuit} name="Python ML Models" />
            <TechBadge icon={Activity} name="IoT Sensor Network" />
          </div>
        </div>
      </section>

      {/* 6. Call To Action */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Ready to see the future <br className="hidden sm:block" />of urban sanitation?</h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
            Explore the dashboards to see how predictive analytics can transform city operations and citizen engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/admin" 
              className="group flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1"
            >
              View Admin Portal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/citizen" 
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              View Citizen Portal
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xl font-bold text-white mb-4">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <span>SmartWaste</span>
          </div>
          <p>© {new Date().getFullYear()} Smart Urban Waste Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SDGCard({ number, title, description, icon: Icon }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <Icon className="w-10 h-10 text-emerald-300" />
        <span className="text-3xl font-black text-white/20">#{number}</span>
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-emerald-50">{description}</p>
    </div>
  );
}

function TechBadge({ icon: Icon, name }: any) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="w-10 h-10 text-slate-400 group-hover:text-emerald-300 transition-colors duration-300 relative z-10" />
      </div>
      <span className="font-semibold text-slate-400 group-hover:text-white transition-colors duration-300">{name}</span>
    </div>
  );
}
