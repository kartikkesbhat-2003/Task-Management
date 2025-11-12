import React from 'react'
import Button from './Button'

export default function AuthLayout({ children, heading, subheading, ctaHref, ctaText }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Task</p>
            <p className="text-xs text-slate-400">Task Management</p>
          </div>
        </div>
        {ctaHref && (
          <Button variant="outline" to={ctaHref}>
            {ctaText}
          </Button>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-center lg:gap-20 lg:px-12">
        <section className="max-w-xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            Trusted by productive teams
          </span>
          <h1 className="text-4xl font-bold text-slate-900 lg:text-5xl">{heading}</h1>
          <p className="text-lg text-slate-600">{subheading}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <span className="text-2xl">🚀</span>
              <p className="mt-3 text-base font-semibold text-slate-900">Launch faster</p>
              <p className="text-sm text-slate-600">Automate onboarding and cut weekly busywork in half.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
              <span className="text-2xl">✨</span>
              <p className="mt-3 text-base font-semibold text-slate-900">Delight teams</p>
              <p className="text-sm text-slate-600">Give every teammate clarity on what matters most.</p>
            </div>
          </div>
        </section>
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">{children}</section>
      </div>
    </div>
  )
}
