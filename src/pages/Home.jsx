import { ArrowRight } from 'lucide-react'
import PageContainer from '../components/PageContainer'

const FEATURES = [
  { label: 'Projects', detail: 'Build IT job makret relevent projects from your first year of college/university' },
  { label: 'Certificates', detail: 'A few, valuable and alligned with your targeted job roles certificates attract more job offers' },
  { label: 'Experiences', detail: 'Get a few experiences, either through internships, freelancing, or side projects, that are relevant to your targeted job roles. ScalePBG helps you get these opportunities at first, based on your skills and interests.' },
]

function FeatureList({ className = '' }) {
  return (
    <div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
      {FEATURES.map((item) => (
        <div
          key={item.label}
          className="border-l-2 border-primary/30 pl-4 py-1"
        >
          <p className="text-base sm:text-lg font-semibold text-black">{item.label}</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.detail}</p>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative w-full flex-1 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,31,92,0.06),_transparent_55%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#eef2f7_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <PageContainer className="relative flex-1 py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">
              Featured partner
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black inline-flex items-baseline gap-2 flex-wrap">
              ScalePBG
              <span className="text-sm sm:text-base font-medium text-slate-700 tracking-normal">
                only for Engineers
              </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-700 font-medium leading-snug">
              Turn AI into leverage for the career you deserve.
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              There are 100s of job roles in the market and 1000s of new job roles are being created every year, but if you are not aware of the latest job roles and the skills required for them, and not chasing for specific job roles, then you are likely to be unemployed. 
            </p>
            <div className="mt-7">
              <a
                href="https://scalepbg.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 h-11 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition shadow-sm"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <FeatureList className="mt-8 lg:hidden" />
          </div>

          <FeatureList className="hidden lg:flex shrink-0 w-[300px] xl:w-[360px] xl:mr-4 2xl:mr-8" />
        </div>
      </PageContainer>
    </div>
  )
}
