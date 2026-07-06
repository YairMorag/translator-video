import Link from "next/link";
import {
  ShieldCheck,
  Activity,
  ClipboardCheck,
  HeartHandshake,
  Footprints,
  Building2,
  AlertTriangle,
  Eye,
  UserCheck,
  Ban,
  Salad,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config";
import { computeCoachDashboardStats } from "@/lib/data/metrics";
import { loginAsDemoRole } from "@/lib/auth/actions";
import { DEMO_ACCOUNTS } from "@/lib/auth/demo-accounts";

export default function LandingPage() {
  const coachStats = computeCoachDashboardStats("profile-coach-amir");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <BuiltForFour />
      <Safety />
      <CoachPreview stats={coachStats} />
      <Pilot />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#safety" className="hover:text-foreground">Safety</a>
          <a href="#pilot" className="hover:text-foreground">Pilot program</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/demo">View Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(26,143,76,0.25),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-white/20 text-white/90">
            Player development, between sessions
          </Badge>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            The training session does not end when the player leaves the pitch.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            {APP_DESCRIPTION}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/demo">
                View Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <form action={loginAsDemoRole.bind(null, DEMO_ACCOUNTS[1].email)}>
              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                See Coach Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const questions = [
    "Who practiced between sessions?",
    "Who struggled with a task?",
    "Who is at risk of being overloaded?",
    "Who reported pain that needs follow-up?",
    "Which players need extra attention this week?",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">The problem</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Football schools usually see players only during official sessions.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Between sessions, coaches have limited visibility into what actually happens with each
            player — and parents are left guessing whether their child&apos;s activity is safe and
            age-appropriate.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {questions.map((q) => (
                <li key={q} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive-soft text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Solution() {
  const items = [
    { icon: ClipboardCheck, title: "Coach-approved weekly tasks", desc: "Nothing reaches a player without explicit coach approval." },
    { icon: Activity, title: "Age and position adaptation", desc: "A simple rules engine tailors suggestions — coaches always decide." },
    { icon: HeartHandshake, title: "Parent visibility", desc: "Parents see exactly what was assigned, by whom, and why." },
    { icon: Footprints, title: "Player self-reporting", desc: "Difficulty, fatigue, and pain — reported in under a minute." },
    { icon: Eye, title: "Coach dashboard", desc: "One glance answers: who needs my attention this week?" },
    { icon: Building2, title: "School-level insights", desc: "Engagement, adherence, and safety flags across every team." },
  ];
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">The solution</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A supervised bridge between the pitch and home.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Coach assigns", desc: "The coach picks a focus area; the rules engine suggests safe, age-appropriate tasks." },
    { title: "Coach approves", desc: "The coach reviews, edits, and approves the final weekly plan before anything is visible." },
    { title: "Player performs", desc: "The player sees today's task, completes it, and reports difficulty, fatigue, and pain." },
    { title: "Everyone sees progress", desc: "Parents see safety and consistency. Coaches and admins see adherence and risk flags." },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">How it works</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          From coach plan to player progress, in four steps.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="relative rounded-xl border border-border bg-card p-6">
            <span className="text-3xl font-semibold text-accent/30">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-3 font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BuiltForFour() {
  const roles = [
    { icon: Footprints, role: "Player", quote: "I know what to do today to improve." },
    { icon: HeartHandshake, role: "Parent", quote: "My child is developing safely, with coach supervision." },
    { icon: ClipboardCheck, role: "Coach", quote: "I can see what happens between training sessions." },
    { icon: Building2, role: "Football School", quote: "We provide a more professional development experience." },
  ];
  return (
    <section className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Built for four users</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One platform, four points of view.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r.role} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <r.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold">{r.role}</p>
              <p className="mt-1 text-sm text-white/70">&ldquo;{r.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const dos = [
    "Parental consent required before activation",
    "Coach approval required before any task is visible",
    "Pain reports pause training and flag the coach",
    "High fatigue triggers a recovery-first suggestion",
  ];
  const donts = [
    "No calorie counting or weight tracking",
    "No public rankings or profiles",
    "No social feed, likes, or peer comparison",
    "No medical advice or injury diagnosis",
  ];
  return (
    <section id="safety" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Safety & parent supervision</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for minors, with safety as a first-class feature.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-success">
              <UserCheck className="h-5 w-5" />
              <CardTitle>What the platform always does</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dos.map((d) => (
              <div key={d} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {d}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <Ban className="h-5 w-5" />
              <CardTitle>What we deliberately don&apos;t build</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {donts.map((d) => (
              <div key={d} className="flex items-start gap-3 text-sm">
                <Salad className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                {d}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CoachPreview({ stats }: { stats: ReturnType<typeof computeCoachDashboardStats> }) {
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Coach dashboard preview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {`“${stats.playersNeedingAttention} players need your attention this week.”`}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Live data from our seeded demo school — North Valley Football Academy. Every number
              below comes from the same dashboard a coach sees after logging in.
            </p>
            <form action={loginAsDemoRole.bind(null, DEMO_ACCOUNTS[1].email)} className="mt-6">
              <Button type="submit">
                Open the coach dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Active players" value={stats.activePlayers} icon={Footprints} />
            <StatCard label="Weekly completion" value={`${stats.weeklyCompletionRate}%`} icon={ClipboardCheck} tone="success" />
            <StatCard label="Need attention" value={stats.playersNeedingAttention} icon={AlertTriangle} tone="warning" />
            <StatCard label="Pain reports" value={stats.painReports} icon={Activity} tone="destructive" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pilot() {
  const items = [
    "Player onboarding with parental consent",
    "Coach-approved weekly task plans",
    "Parent visibility into every assignment",
    "Player completion reports",
    "Coach dashboard for daily attention",
    "School engagement report at the end of the pilot",
  ];
  return (
    <section id="pilot" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border-none bg-primary text-white">
        <CardContent className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-white/60">
              <Trophy className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">Pilot program</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Designed for an 8-week paid pilot with football schools.
            </h2>
            <p className="mt-4 text-white/70">
              A focused pilot that proves engagement, safety, and value before a full rollout.
            </p>
          </div>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Turn every football school into a personalized player-development academy.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Explore the full demo — switch between admin, coach, parent, and player in seconds.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/demo">
              View Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>{APP_NAME}</span>
        </div>
        <p>Proof of concept — not for clinical or medical use.</p>
      </div>
    </footer>
  );
}
