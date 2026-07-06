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
  ArrowLeft,
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
          <a href="#how-it-works" className="hover:text-foreground">איך זה עובד</a>
          <a href="#safety" className="hover:text-foreground">בטיחות</a>
          <a href="#pilot" className="hover:text-foreground">תוכנית פיילוט</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">התחברות</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/demo">צפייה בהדגמה</Link>
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
            פיתוח שחקנים, בין האימונים
          </Badge>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            האימון לא מסתיים כשהשחקן עוזב את המגרש.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            {APP_DESCRIPTION}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/demo">
                צפייה בהדגמה <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <form action={loginAsDemoRole.bind(null, DEMO_ACCOUNTS[1].email)}>
              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                לוח הבקרה של המאמן
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
    "מי התאמן בין האימונים?",
    "מי התקשה עם משימה?",
    "מי נמצא בסיכון לעומס יתר?",
    "מי דיווח על כאב שדורש מעקב?",
    "אילו שחקנים זקוקים לתשומת לב נוספת השבוע?",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">הבעיה</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            בתי ספר לכדורגל רואים בדרך כלל את השחקנים רק במהלך האימונים הרשמיים.
          </h2>
          <p className="mt-4 text-muted-foreground">
            בין האימונים, למאמנים יש נראות מוגבלת לגבי מה שקורה בפועל עם כל שחקן — וההורים
            נשארים בניחוש האם הפעילות של הילד שלהם בטוחה ומתאימה לגיל.
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
    { icon: ClipboardCheck, title: "משימות שבועיות באישור המאמן", desc: "שום דבר לא מגיע לשחקן ללא אישור מפורש של המאמן." },
    { icon: Activity, title: "התאמה לגיל ולעמדה", desc: "מנוע חוקים פשוט מתאים הצעות — המאמנים תמיד מחליטים." },
    { icon: HeartHandshake, title: "שקיפות להורים", desc: "ההורים רואים בדיוק מה הוקצה, על ידי מי ולמה." },
    { icon: Footprints, title: "דיווח עצמי של השחקן", desc: "קושי, עייפות וכאב — מדווחים תוך פחות מדקה." },
    { icon: Eye, title: "לוח בקרה למאמן", desc: "מבט אחד עונה: מי דורש את תשומת לבי השבוע?" },
    { icon: Building2, title: "תובנות ברמת בית הספר", desc: "מעורבות, עמידה ביעדים ודגלי בטיחות בכל קבוצה." },
  ];
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">הפתרון</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            גשר מפוקח בין המגרש לבית.
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
    { title: "המאמן מקצה", desc: "המאמן בוחר תחום מיקוד; מנוע החוקים מציע משימות בטוחות ומתאימות לגיל." },
    { title: "המאמן מאשר", desc: "המאמן בודק, עורך ומאשר את התוכנית השבועית הסופית לפני שמשהו נחשף." },
    { title: "השחקן מבצע", desc: "השחקן רואה את המשימה של היום, משלים אותה ומדווח על קושי, עייפות וכאב." },
    { title: "כולם רואים התקדמות", desc: "ההורים רואים בטיחות ועקביות. המאמנים והמנהלים רואים עמידה ביעדים ודגלי סיכון." },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">איך זה עובד</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          מתוכנית של המאמן להתקדמות של השחקן, בארבעה צעדים.
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
    { icon: Footprints, role: "שחקן", quote: "אני יודע מה לעשות היום כדי להשתפר." },
    { icon: HeartHandshake, role: "הורה", quote: "הילד שלי מתפתח בבטחה, בפיקוח המאמן." },
    { icon: ClipboardCheck, role: "מאמן", quote: "אני יכול לראות מה קורה בין האימונים." },
    { icon: Building2, role: "בית ספר לכדורגל", quote: "אנחנו מספקים חוויית פיתוח מקצועית יותר." },
  ];
  return (
    <section className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">בנוי לארבעה סוגי משתמשים</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">פלטפורמה אחת, ארבע נקודות מבט.</h2>
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
    "נדרש אישור הורה לפני הפעלה",
    "נדרש אישור מאמן לפני שמשימה כלשהי נחשפת",
    "דיווחי כאב עוצרים את האימון ומתריעים למאמן",
    "עייפות גבוהה מפעילה הצעה שמתמקדת בהתאוששות",
  ];
  const donts = [
    "ללא ספירת קלוריות או מעקב משקל",
    "ללא דירוגים או פרופילים ציבוריים",
    "ללא פיד חברתי, לייקים או השוואה בין שחקנים",
    "ללא ייעוץ רפואי או אבחון פציעות",
  ];
  return (
    <section id="safety" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">בטיחות ופיקוח הורים</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          בנוי לקטינים, כשהבטיחות היא ערך מוביל.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-success">
              <UserCheck className="h-5 w-5" />
              <CardTitle>מה הפלטפורמה תמיד עושה</CardTitle>
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
              <CardTitle>מה שאנחנו בכוונה לא בונים</CardTitle>
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
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">תצוגה מקדימה של לוח הבקרה למאמן</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {`“${stats.playersNeedingAttention} שחקנים דורשים תשומת לב השבוע.”`}
            </h2>
            <p className="mt-4 text-muted-foreground">
              נתונים חיים מבית הספר להדגמה שלנו — North Valley Football Academy. כל מספר למטה
              מגיע מאותו לוח בקרה שמאמן רואה לאחר ההתחברות.
            </p>
            <form action={loginAsDemoRole.bind(null, DEMO_ACCOUNTS[1].email)} className="mt-6">
              <Button type="submit">
                פתיחת לוח הבקרה של המאמן <ArrowLeft className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="שחקנים פעילים" value={stats.activePlayers} icon={Footprints} />
            <StatCard label="השלמה שבועית" value={`${stats.weeklyCompletionRate}%`} icon={ClipboardCheck} tone="success" />
            <StatCard label="דורשים תשומת לב" value={stats.playersNeedingAttention} icon={AlertTriangle} tone="warning" />
            <StatCard label="דיווחי כאב" value={stats.painReports} icon={Activity} tone="destructive" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pilot() {
  const items = [
    "קליטת שחקנים עם אישור הורה",
    "תוכניות משימות שבועיות באישור המאמן",
    "שקיפות להורים בכל הקצאה",
    "דוחות השלמה של שחקנים",
    "לוח בקרה למאמן לתשומת לב יומית",
    "דוח מעורבות בית ספר בסיום הפיילוט",
  ];
  return (
    <section id="pilot" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border-none bg-primary text-white">
        <CardContent className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-white/60">
              <Trophy className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">תוכנית פיילוט</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              מיועד לפיילוט בתשלום של 8 שבועות עם בתי ספר לכדורגל.
            </h2>
            <p className="mt-4 text-white/70">
              פיילוט ממוקד שמוכיח מעורבות, בטיחות וערך לפני השקה מלאה.
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
          הפכו כל בית ספר לכדורגל לאקדמיה מותאמת אישית לפיתוח שחקנים.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          גלו את ההדגמה המלאה — עברו בין מנהל, מאמן, הורה ושחקן תוך שניות.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/demo">
              צפייה בהדגמה <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">התחברות</Link>
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
        <p>הוכחת היתכנות (POC) — לא לשימוש קליני או רפואי.</p>
      </div>
    </footer>
  );
}
