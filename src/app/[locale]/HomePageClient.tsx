"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Dna,
  ExternalLink,
  Gem,
  Gift,
  GraduationCap,
  Info,
  Layers,
  MapPin,
  Rocket,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.animeuniversetowerdefense.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime Universe Tower Defense Wiki",
        description:
          "Complete Anime Universe Tower Defense Wiki covering codes, units, tier lists, traits, evolutions, builds, raids, and update guides for the anime tower defense game on Roblox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Universe Tower Defense - Anime Strategy Tower Defense on Roblox",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime Universe Tower Defense Wiki",
        alternateName: "Anime Universe Tower Defense",
        url: siteUrl,
        description:
          "Complete Anime Universe Tower Defense Wiki resource hub for codes, units, tier lists, traits, evolutions, builds, and raid guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Universe Tower Defense Wiki - Anime Strategy Tower Defense on Roblox",
        },
        sameAs: [
          "https://www.roblox.com/games/133410800847665/Universal-Tower-Defense-Z",
          "https://discord.com/invite/universaltd",
          "https://x.com/universal_td",
          "https://www.youtube.com/@Universal-TD",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime Universe Tower Defense",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Strategy", "Tower Defense", "Anime", "Co-op"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/133410800847665/Universal-Tower-Defense-Z",
        },
      },
      {
        "@type": "VideoObject",
        name: "Anime Universe Tower Defense - Update 4.0 Official Trailer",
        description:
          "Official Anime Universe Tower Defense Update 4.0 trailer showcasing new units, raids, extractions, evolutions, and seasonal content.",
        uploadDate: "2026-07-09",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/hevoQi1OR-Y",
        url: "https://www.youtube.com/watch?v=hevoQi1OR-Y",
      },
    ],
  };

  // Accordion / interaction states
  const [modeExpanded, setModeExpanded] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopiedCode(code);
          window.setTimeout(() => setCopiedCode(null), 1500);
        })
        .catch(() => {});
    }
  };

  // Tools Grid 卡片锚点 → section id（与下方 8 个独立 section 一一对应）
  const toolSectionIds = [
    "codes",
    "beginner-guide",
    "unit-tier-list",
    "best-units-and-teams",
    "traits-and-rerolls-guide",
    "evolution-and-etherealize-guide",
    "game-modes-and-farming-guide",
    "update-4-guide",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/133410800847665/Universal-Tower-Defense-Z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="hevoQi1OR-Y"
              title="Anime Universe Tower Defense - Update 4.0 Official Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolSectionIds[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                             flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gift className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdCodes"]} locale={locale}>
                  {t.modules.autdCodes.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdCodes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdCodes.intro}
            </p>
          </div>

          {/* How to Redeem */}
          <div className="scroll-reveal mb-8 md:mb-10 p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">How to Redeem</h3>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {t.modules.autdCodes.howToRedeem.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Active Codes */}
          <h3 className="sr-only">Active Codes</h3>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
            {t.modules.autdCodes.activeCodes.map((c: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code className="text-sm md:text-base font-mono font-semibold text-[hsl(var(--nav-theme-light))] break-all">
                    {c.code}
                  </code>
                  <button
                    onClick={() => copyCode(c.code)}
                    aria-label={`Copy code ${c.code}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <ul className="space-y-1">
                  {c.rewards.map((r: string, ri: number) => (
                    <li key={ri} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Expired Codes */}
          <div className="scroll-reveal p-4 md:p-6 bg-white/[0.02] border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-bold text-base md:text-lg text-muted-foreground">Expired Codes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.modules.autdCodes.expiredCodes.map((code: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-border font-mono text-muted-foreground line-through"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>

          <div className="scroll-reveal mt-6 flex items-start gap-2 p-4 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <Info className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{t.modules.autdCodes.tip}</p>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <GraduationCap className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdBeginnerGuide"]} locale={locale}>
                  {t.modules.autdBeginnerGuide.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.autdBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`autdBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">{step.instructions}</p>
                  <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))]">
                    <Check className="w-4 h-4 inline mr-1" />
                    {step.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Unit Tier List */}
      <section id="unit-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdUnitTierList"]} locale={locale}>
                  {t.modules.autdUnitTierList.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdUnitTierList.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdUnitTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4 md:space-y-6">
            {t.modules.autdUnitTierList.tiers.map((tier: any, ti: number) => {
              // 用主题色不同透明度区分层级（不硬编码颜色）
              const tierOpacity = ["0.9", "0.7", "0.5", "0.35"][ti] ?? "0.5";
              return (
                <div key={ti} className="p-4 md:p-5 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-bold text-lg"
                      style={{ backgroundColor: `hsl(var(--nav-theme)/${tierOpacity})`, color: "white" }}
                    >
                      {tier.tier}
                    </span>
                    <div>
                      <h3 className="font-bold text-base md:text-lg">{tier.label}</h3>
                      <p className="text-xs text-muted-foreground">{tier.units.length} units</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                    {tier.units.map((u: any, ui: number) => (
                      <div
                        key={ui}
                        className="p-3 bg-white/[0.03] border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <p className="font-semibold text-sm leading-snug">{u.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                            {u.role}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">
                            {u.element}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">{u.bestFor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 4: Best Units and Teams */}
      <section id="best-units-and-teams" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Swords className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdBestUnits"]} locale={locale}>
                  {t.modules.autdBestUnits.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdBestUnits.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdBestUnits.intro}
            </p>
          </div>

          {/* Featured Roles */}
          <h3 className="sr-only">Best Units by Role</h3>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
            {t.modules.autdBestUnits.roles.map((role: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-base md:text-lg">{role.name}</h3>
                </div>
                <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-2">{role.purpose}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {role.units.map((u: string, ui: number) => (
                    <span key={ui} className="text-xs px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {u}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{role.usage}</p>
              </div>
            ))}
          </div>

          {/* Team Templates */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.autdBestUnits.teams.map((team: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-base md:text-lg">{team.name}</h3>
                </div>
                <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-3">{team.purpose}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {team.slots.map((slot: any, si: number) => (
                    <div key={si} className="p-2 bg-white/[0.03] border border-border rounded-lg">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{slot.role}</p>
                      <p className="text-sm font-semibold leading-snug">{slot.unit}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{team.playstyle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Traits and Rerolls */}
      <section id="traits-and-rerolls-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Dna className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdTraitsRerolls"]} locale={locale}>
                  {t.modules.autdTraitsRerolls.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdTraitsRerolls.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdTraitsRerolls.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {t.modules.autdTraitsRerolls.traits.map((trait: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">{trait.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {trait.rollChance}
                  </span>
                </div>
                <ul className="space-y-1 mb-3">
                  {trait.effects.map((e: string, ei: number) => (
                    <li key={ei} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mb-2"><span className="font-semibold">Best for:</span> <span className="text-muted-foreground">{trait.bestFor}</span></p>
                <p className="text-sm flex items-start gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{trait.drawback}</span>
                </p>
                <p className="text-sm"><span className="font-semibold">Priority:</span> <span className="text-muted-foreground">{trait.rerollPriority}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Evolution and Etherealize */}
      <section id="evolution-and-etherealize-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gem className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdEvolutionEtherealize"]} locale={locale}>
                  {t.modules.autdEvolutionEtherealize.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdEvolutionEtherealize.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdEvolutionEtherealize.intro}
            </p>
          </div>

          {/* Desktop table / mobile cards */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-semibold">Evolution</th>
                  <th className="text-left p-3 font-semibold">Takedowns</th>
                  <th className="text-left p-3 font-semibold">Materials</th>
                  <th className="text-left p-3 font-semibold">Sources</th>
                  <th className="text-left p-3 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.autdEvolutionEtherealize.evolutions.map((evo: any, index: number) => (
                  <tr key={index} className="border-t border-border align-top">
                    <td className="p-3">
                      <p className="font-semibold">{evo.baseUnit}</p>
                      <p className="flex items-center gap-1 text-[hsl(var(--nav-theme-light))]">
                        <ArrowRight className="w-3.5 h-3.5" /> {evo.evolvedForm}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{evo.notes}</p>
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{evo.takedowns}</td>
                    <td className="p-3">
                      <ul className="space-y-0.5">
                        {evo.materials.map((m: string, mi: number) => (
                          <li key={mi} className="text-xs text-muted-foreground">{m}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-muted-foreground">{evo.mainSources}</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                        {evo.investmentPriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.autdEvolutionEtherealize.evolutions.map((evo: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <p className="font-semibold">{evo.baseUnit}</p>
                <p className="flex items-center gap-1 text-sm text-[hsl(var(--nav-theme-light))] mb-2">
                  <ArrowRight className="w-3.5 h-3.5" /> {evo.evolvedForm}
                </p>
                <p className="text-xs text-muted-foreground mb-2">Takedowns: {evo.takedowns}</p>
                <ul className="space-y-0.5 mb-2">
                  {evo.materials.map((m: string, mi: number) => (
                    <li key={mi} className="text-xs text-muted-foreground">{m}</li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mb-2">Sources: {evo.mainSources}</p>
                <p className="text-xs text-muted-foreground mb-2">{evo.notes}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                  {evo.investmentPriority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Game Modes and Farming */}
      <section id="game-modes-and-farming-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Layers className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdGameModes"]} locale={locale}>
                  {t.modules.autdGameModes.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdGameModes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdGameModes.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 md:space-y-3">
            {t.modules.autdGameModes.modes.map((mode: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/[0.03]"
              >
                <button
                  onClick={() => setModeExpanded(modeExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {mode.category}
                    </span>
                    <span className="font-semibold text-sm md:text-base truncate">{mode.mode}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform ${modeExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {modeExpanded === index && (
                  <div className="px-4 md:px-5 pb-5 text-sm">
                    <p className="text-muted-foreground mb-2">
                      <span className="font-semibold text-foreground">Difficulty:</span> {mode.difficulty}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {mode.primaryRewards.map((r: string, ri: number) => (
                        <span key={ri} className="text-xs px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-2">
                      <span className="font-semibold text-foreground">Best for:</span> {mode.bestFor}
                    </p>
                    <p className="text-muted-foreground flex items-start gap-1.5 mb-2">
                      <MapPin className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                      <span><span className="font-semibold text-foreground">Route:</span> {mode.farmingRoute}</span>
                    </p>
                    <p className="text-muted-foreground text-xs italic">{mode.keyNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Update 4.0 */}
      <section id="update-4-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Rocket className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap["autdUpdate4"]} locale={locale}>
                  {t.modules.autdUpdate4.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.autdUpdate4.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mt-3">
              {t.modules.autdUpdate4.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.autdUpdate4.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {entry.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {entry.date}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1.5">{entry.headline}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{entry.details}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.featuredContent.map((f: string, fi: number) => (
                      <span key={fi} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal mt-8 text-center">
            <a
              href="https://www.roblox.com/games/133410800847665/Universal-Tower-Defense-Z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white font-semibold transition-colors"
            >
              {t.cta.joinGame}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/universaltd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/universal_td"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@Universal-TD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/133410800847665/Universal-Tower-Defense-Z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
