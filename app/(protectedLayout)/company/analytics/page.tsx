"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/app/utils/api";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { analyticsTranslations } from "@/app/translations/analytics";

const Pie = dynamic(() => import("../../../components/AnalyticsCharts").then(mod => mod.Pie), { ssr: false });
const Bar = dynamic(() => import("../../../components/AnalyticsCharts").then(mod => mod.Bar), { ssr: false });
const Line = dynamic(() => import("../../../components/AnalyticsCharts").then(mod => mod.Line), { ssr: false });

type OverviewResponse = {
  total_opportunities: number;
  open_opportunities: number;
  closed_opportunities: number;
  completed_opportunities: number;
  total_applicants: number;
  pending_applicants: number;
  accepted_applicants: number;
  rejected_applicants: number;
  attended_applicants?: number;
  acceptance_rate: number;
};

type ApplicantsStatusItem = {
  status: string;
  total: number;
};

type CategoryItem = {
  category_id: number;
  category_name: string;
  total: number;
};

type TrendItem = {
  day: string;
  total: number;
};

type TopOpportunityItem = {
  id: number;
  title: string;
  applicants_count: number;
};

export default function Analytics() {
  const { lang } = useLang();
  const t = analyticsTranslations[lang];

  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [applicantsStatus, setApplicantsStatus] = useState<ApplicantsStatusItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [topOpportunities, setTopOpportunities] = useState<TopOpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          overviewRes,
          applicantsStatusRes,
          categoriesRes,
          trendRes,
          topOpportunitiesRes,
        ] = await Promise.all([
          api.get("/company/overview"),
          api.get("/company/applicants-status"),
          api.get("/company/opportunities-by-category"),
          api.get("/company/applications-trend"),
          api.get("/company/top-opportunities"),
        ]);

        setOverview(overviewRes.data);
        setApplicantsStatus(applicantsStatusRes.data || []);
        setCategories(categoriesRes.data || []);
        setTrend(trendRes.data || []);
        setTopOpportunities(topOpportunitiesRes.data || []);
      } catch (err: any) {
        console.log(err);
        setError(
          err?.response?.data?.details ||
            err?.response?.data?.error ||
            t.errors.failedToLoad
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [t.errors.failedToLoad]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(num);
  };

  const applicantsStatusData = useMemo(() => {
    return {
      labels: applicantsStatus.map((item) => item.status),
      datasets: [
        {
          label: t.labels.applicants,
          data: applicantsStatus.map((item) => item.total),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(139, 92, 246, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [applicantsStatus, t.labels.applicants]);

  const opportunitiesByCategoryData = useMemo(() => {
    return {
      labels: categories.map((item) => item.category_name),
      datasets: [
        {
          label: t.labels.opportunities,
          data: categories.map((item) => item.total),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderRadius: 8,
        },
      ],
    };
  }, [categories, t.labels.opportunities]);

  const applicationsTrendData = useMemo(() => {
    return {
      labels: trend.map((item) => item.day),
      datasets: [
        {
          label: t.labels.applications,
          data: trend.map((item) => item.total),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [trend, t.labels.applications]);

  const topOpportunitiesData = useMemo(() => {
    return {
      labels: topOpportunities.map((item) => item.title),
      datasets: [
        {
          label: t.labels.applicantsCount,
          data: topOpportunities.map((item) => item.applicants_count),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderRadius: 8,
        },
      ],
    };
  }, [topOpportunities, t.labels.applicantsCount]);

  if (loading) {
    return (
      <section
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="space-y-6 p-6"
      >
        <h1 className="text-2xl font-bold">{t.title}</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-foreground/10 bg-foreground/5"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-[360px] animate-pulse rounded-2xl border border-foreground/10 bg-foreground/5" />
          <div className="h-[360px] animate-pulse rounded-2xl border border-foreground/10 bg-foreground/5" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-[380px] animate-pulse rounded-2xl border border-foreground/10 bg-foreground/5" />
          <div className="h-[380px] animate-pulse rounded-2xl border border-foreground/10 bg-foreground/5" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="p-6"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="space-y-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="mt-1 text-sm text-foreground/60">{t.description}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <StatCard
          title={t.cards.totalOpportunities}
          value={formatNumber(overview?.total_opportunities ?? 0)}
        />
        <StatCard
          title={t.cards.openOpportunities}
          value={formatNumber(overview?.open_opportunities ?? 0)}
        />
        <StatCard
          title={t.cards.totalApplicants}
          value={formatNumber(overview?.total_applicants ?? 0)}
        />
        <StatCard
          title={t.cards.acceptanceRate}
          value={`${formatNumber(overview?.acceptance_rate ?? 0)}%`}
        />
        <StatCard
          title={t.cards.pendingApplicants}
          value={formatNumber(overview?.pending_applicants ?? 0)}
        />
        <StatCard
          title={t.cards.acceptedApplicants}
          value={formatNumber(overview?.accepted_applicants ?? 0)}
        />
        <StatCard
          title={t.cards.rejectedApplicants}
          value={formatNumber(overview?.rejected_applicants ?? 0)}
        />
        <StatCard
          title={t.cards.completedOpportunities}
          value={formatNumber(overview?.completed_opportunities ?? 0)}
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title={t.charts.applicantsByStatus}>
          {applicantsStatus.length > 0 ? (
            <div className="h-[320px]">
              <Pie
                data={applicantsStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState text={t.empty.applicants} />
          )}
        </ChartCard>

        <ChartCard title={t.charts.opportunitiesByCategory}>
          {categories.length > 0 ? (
            <div className="h-[320px]">
              <Bar
                data={opportunitiesByCategoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState text={t.empty.categories} />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title={t.charts.applicationsTrend}>
          {trend.length > 0 ? (
            <div className="h-[340px]">
              <Line
                data={applicationsTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState text={t.empty.trend} />
          )}
        </ChartCard>

        <ChartCard title={t.charts.topOpportunities}>
          {topOpportunities.length > 0 ? (
            <div className="h-[340px]">
              <Bar
                data={topOpportunitiesData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState text={t.empty.opportunities} />
          )}
        </ChartCard>
      </div>
    </motion.section>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <motion.article
      className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -5 }}
    >
      <p className="text-sm text-foreground/60">{title}</p>
      <motion.h2
        className="mt-3 text-3xl font-bold text-foreground"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.h2>
    </motion.article>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <h2 className="mb-4 text-lg font-bold text-foreground">{title}</h2>
      {children}
    </motion.article>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-foreground/15 text-sm text-foreground/50">
      {text}
    </div>
  );
}