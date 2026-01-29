// Componentes
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FeatureCard } from "./components/home/FeatureCard";
import { Features } from "./lib/constants";
import { useEffect } from "react";
import { fadeLeft, fadeUp, fadeUpScale } from "./lib/animations";

function App() {
  useEffect(() => {
    fadeUp(".hero-text", {
      duration: 0.7,
      delay: 0,
      stagger: 0.2,
      trigger: ".container",
    });
    fadeLeft(".image");
    fadeUpScale(".feature-card", {
      duration: 0.6,
      stagger: 0.2,
      trigger: ".feature-grid",
      once: false,
    });
    fadeLeft(".cta", {
      delay: 1,
      stagger: 0.2,
      trigger: ".cta-container",
      once: false,
    });
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="py-16 px-6 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-between gap-10"
        aria-label="Introducción a Worklyst"
      >
        <div className="container flex-1 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Potenciado por IA
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 
            leading-tight mb-6 hero-text"
          >
            Gestión de tareas{" "}
            <span className="text-blue-400">Inteligentes</span> para equipos
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-8 leading-relaxed max-w-lg hero-text">
            Potencia la colaboración de tu equipo con IA. Organiza, asigna y
            completa proyectos de manera más eficiente que nunca.
          </p>
          <div className="flex flex-wrap gap-4 hero-text">
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              aria-label="Comenzar gratis con Worklyst"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full max-w-xl">
          <div className="relative image">
            <img
              src="/images/IA-en-clase.webp"
              alt="Ilustración de equipo colaborando con IA en una oficina moderna"
              className="w-full h-auto rounded-2xl shadow-xl bg-purple-400 p-1.5"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-6 md:px-20 lg:px-32 bg-white"
        aria-labelledby="features-title"
      >
        <div className="text-center md-16">
          <h2
            id="features-title"
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 m-1"
          >
            Todo lo que necesitas para ser productivo.
          </h2>
          <p className="text-slate-500 text-lg m-3">
            Herramientas inteligentes que se adaptan a tu forma de trabajo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 feature-grid">
          {Features.map((feature) => (
            <div key={feature.id} className="feature-card" aria-hidden="true">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.iconColor}
                iconBgColor={feature.iconBgColor}
              />
            </div>
          ))}

          <article
            className="md:col-span-1 lg:col-span-3 bg-white
            p-8 rounded-2xl flex flex-col justify-center items-start cta-container"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-2 cta">
              ¿Listo para transformar tu productividad?
            </h3>
            <p className="text-slate-500 mb-6 cta">
              Únete a miles de equipos que ya estan trabajando de manera más
              inteligente.
            </p>
            <div aria-hidden="true" className="cta">
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg
              font-medium transition-all flex items-center gap-2"
                aria-label="Comenzar ahora registrándote"
              >
                Comenzar ahora
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
