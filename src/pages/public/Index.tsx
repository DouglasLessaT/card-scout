import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, BarChart2, FolderOpen, Star, Check, Weight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoSvg from '@/assets/logo.svg';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';


// ─── Phone Mockup ────────────────────────────────────────────────────────────
function PhoneMockup({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div
      className="relative rounded-2xl border flex flex-col items-center justify-end pb-4"
      style={{
        width: 110,
        height: 190,
        background: 'rgba(255,255,255,0.04)',
        borderColor: accent ? '#f97316' : 'rgba(255,255,255,0.1)',
        boxShadow: accent ? '0 0 24px rgba(249,115,22,0.25)' : undefined,
      }}
    >
      {/* screen content placeholder */}
      <div className="absolute top-4 left-3 right-3 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md"
            style={{
              height: 28,
              background: accent
                ? 'rgba(249,115,22,0.35)'
                : 'rgba(255,255,255,0.07)',
            }}
          />
        ))}
      </div>
      <span
        className="text-xs font-semibold tracking-wide"
        style={{ color: accent ? '#f97316' : 'rgba(255,255,255,0.45)' }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Feature row ─────────────────────────────────────────────────────────────
function FeatureRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(249,115,22,0.15)' }}
      >
        <Icon className="w-4 h-4" style={{ color: '#f97316' }} />
      </div>
      <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
        <span className="font-semibold text-white">{title}:</span> {desc}
      </p>
    </div>
  );
}

// ─── Plan Card ───────────────────────────────────────────────────────────────
function PlanCard({
  name,
  subtitle,
  price,
  period,
  features,
  cta,
  popular,
  accent,
}: {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: accent ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${accent ? '#f97316' : 'rgba(255,255,255,0.1)'}`,
        flex: 1,
        minWidth: 0,
      }}
    >
      {popular && (
        <div
          className="absolute -top-3 right-5 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: '#f97316', color: '#fff' }}
        >
          <Star className="w-3 h-3 fill-white" />
          Popular
        </div>
      )}

      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: '#f97316' }}
        >
          Plano
        </p>
        <h3 className="text-3xl font-bold text-white">{name}</h3>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {subtitle}
        </p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-white">{price}</span>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {period}
        </span>
      </div>

      <ul className="space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <Check
              className="w-4 h-4 shrink-0"
              style={{ color: accent ? '#f97316' : 'rgba(255,255,255,0.4)' }}
            />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <button
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={
            accent
              ? { background: '#f97316', color: '#fff' }
              : {
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                }
          }
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Index() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0d0d14', color: '#fff', fontFamily: 'inherit' }}
    >
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(13, 13, 20, 0.1)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)',flexDirection: 'row-reverse' }}>
        <Link to="/login">
          <button
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
          >
            Login
          </button>
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <ParticleCanvas />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
          <div>
            <img src={logoSvg} alt="OracleTgc Logo" style={{ width: '400px', height: '400px' }} />
          </div>
          <p className="text-base max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Magic &amp; Pokémon identificados com OCR. Veja preços em USD, BRL e BTC em tempo real.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/scanner-test">
              <button
                className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                style={{ background: '#f97316', color: '#fff' }}
              >
                <Camera className="w-4 h-4" />
                Teste o Scanner
              </button>
            </Link>
            <a href="#planos">
              <button
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Ver Planos
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section
        className="px-6 py-20"
        style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          {/* Text */}
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#f97316' }}>
                Como Funciona
              </p>
              <h2 className="text-3xl font-extrabold leading-tight">
                Três telas.
                <br />
                Uma experiência completa.
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Escaneie com a câmera, veja o dashboard com o valor da sua coleção e organize tudo em
              listas personalizadas — suporte a Magic e Pokémon.
            </p>
            <div className="space-y-4">
              <FeatureRow icon={Camera} title="Scanner com OCR" desc="Aponte a câmera e identifique qualquer carta em menos de 1 segundo" />
              <FeatureRow icon={BarChart2} title="Dashboard" desc="Veja o valor total em USD, BRL e BTC em tempo real" />
              <FeatureRow icon={FolderOpen} title="Coleções" desc="Organize por set, formato ou listas personalizadas" />
            </div>
          </div>

          {/* Phone mockups */}
          <div className="flex items-end gap-3 shrink-0">
            <div style={{ transform: 'translateY(16px)' }}>
              <PhoneMockup label="Scanner" accent />
            </div>
            <div style={{ transform: 'translateY(-8px)' }}>
              <PhoneMockup label="Coleções" />
            </div>
            <div style={{ transform: 'translateY(8px)' }}>
              <PhoneMockup label="Dashboard" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANOS ────────────────────────────────────────────────────────── */}
      <section id="planos" className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#f97316' }}>
              Planos
            </p>
            <h2 className="text-3xl font-extrabold">Simples e transparente</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Comece grátis, faça upgrade quando precisar
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <PlanCard
              name="Free"
              subtitle="Para começar sua jornada"
              price="R$0"
              period="/mês"
              features={['5 scans por dia', 'Magic & Pokémon', '1 coleção por jogo', 'Histórico 7 dias', 'Acesso a Comunidade Interna', 'Marcketplace', 'Preços USD']}
              cta="Começar grátis"
            />
            <PlanCard
              name="Premium"
              subtitle="Para colecionadores sérios"
              price="R$19"
              period="/mês"
              features={['Scans ilimitados', 'OCR avançado', 'Coleções ilimitadas', 'Histórico completo', 'Preços USD, BRL e BTC', 'Exportar coleção']}
              cta="Assinar Premium"
              popular
              accent
            />
          </div>
        </div>
      </section>

      {/* ── TESTE O SCANNER ───────────────────────────────────────────────── */}
      <section
        className="px-6 py-16"
        style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Curioso? Experimente agora sem criar conta.
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              Teste o scanner gratuitamente
            </p>
          </div>
          <Link to="/scanner-test">
            <button
              className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shrink-0 transition-all"
              style={{ background: '#f97316', color: '#fff' }}
            >
              <Camera className="w-4 h-4" />
              Teste o Scanner
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0a0a10' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-8 justify-between">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#f97316' }}>
                <img src={logoSvg} alt="OracleTgc Logo" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <span className="font-bold text-white tracking-tight">OracleTgc</span>
            </div>
            <p className="text-xs max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              O scanner de cartas TGC mais preciso. Magic &amp; Pokémon identificados com IA.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-white">Produto</p>
              {['Funcionalidades', 'Planos', 'Novidades'].map((l) => (
                <p key={l} style={{ color: 'rgba(255,255,255,0.4)' }} className="cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white">Suporte</p>
              {['Central de ajuda', 'Contato', 'Status'].map((l) => (
                <p key={l} style={{ color: 'rgba(255,255,255,0.4)' }} className="cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white">Legal</p>
              {['Privacidade', 'Termos'].map((l) => (
                <p key={l} style={{ color: 'rgba(255,255,255,0.4)' }} className="cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 OracleTgc. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Feito para colecionadores ✦
          </p>
        </div>
      </footer>
    </div>
  );
}
