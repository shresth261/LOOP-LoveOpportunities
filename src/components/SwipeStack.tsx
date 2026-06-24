import { useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Heart, X, RotateCcw, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categoryColor, type Opportunity } from "@/lib/opportunities";
import { matchScore, useInterested, usePassed, useProfile } from "@/lib/local-store";
import { MatchPie } from "./MatchPie";
import { differenceInDays } from "date-fns";

export function SwipeStack({ opps }: { opps: Opportunity[] }) {
  const { profile } = useProfile();
  const { add: addInterested } = useInterested();
  const { passed, add: addPassed } = usePassed();
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<{ id: string; dir: "left" | "right" }[]>([]);

  const queue = useMemo(
    () => opps.filter((o) => !passed.includes(o.id)).slice(0, 25),
    [opps, passed],
  );

  const current = queue[index];
  const next = queue[index + 1];

  if (!current) {
    return (
      <div className="border-2 border-dashed border-foreground/20 rounded-[28px] p-10 text-center">
        <p className="font-display text-3xl uppercase">You're all caught up.</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-2">
          Scroll down for the full feed.
        </p>
      </div>
    );
  }

  const onSwipe = (dir: "left" | "right") => {
    if (dir === "right") addInterested(current.id);
    else addPassed(current.id);
    setHistory((h) => [...h, { id: current.id, dir }]);
    setIndex((i) => i + 1);
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            For you · swipe to triage
          </div>
          <div className="font-display text-2xl uppercase leading-none mt-1">
            Card {index + 1} <span className="text-muted-foreground">/ {queue.length}</span>
          </div>
        </div>
        <button
          disabled={!history.length}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setHistory((h) => h.slice(0, -1));
          }}
          className="p-2.5 border-2 border-foreground rounded-xl disabled:opacity-30 hover:bg-accent"
          aria-label="Undo"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div className="relative h-[420px]">
        {next && <CardShell opp={next} score={matchScore(profile, next.tags)} stacked />}
        <AnimatePresence>
          <SwipeCard
            key={current.id}
            opp={current}
            score={matchScore(profile, current.tags)}
            onSwipe={onSwipe}
          />
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 mt-5">
        <button
          onClick={() => onSwipe("left")}
          className="size-14 rounded-full bg-card border-2 border-foreground shadow-stamp flex items-center justify-center hover:-translate-y-1 transition-transform"
          aria-label="Pass"
        >
          <X className="size-6" />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          ← pass · save →
        </div>
        <button
          onClick={() => onSwipe("right")}
          className="size-14 rounded-full bg-primary text-primary-foreground border-2 border-foreground shadow-stamp flex items-center justify-center hover:-translate-y-1 transition-transform"
          aria-label="Interested"
        >
          <Heart className="size-6 fill-current" />
        </button>
      </div>
    </div>
  );
}

function SwipeCard({
  opp,
  score,
  onSwipe,
}: {
  opp: Opportunity;
  score: number;
  onSwipe: (d: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120 || info.velocity.x > 600) onSwipe("right");
    else if (info.offset.x < -120 || info.velocity.x < -600) onSwipe("left");
  };

  const daysLeft = differenceInDays(new Date(opp.deadline), new Date());

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onEnd}
      style={{ x, rotate }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 600 : -600, opacity: 0, transition: { duration: 0.25 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      whileTap={{ cursor: "grabbing" }}
    >
      <CardShell opp={opp} score={score}>
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 px-3 py-1 border-4 border-primary text-primary font-display text-3xl uppercase rotate-[-12deg] rounded-lg"
        >
          Interested
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-6 right-6 px-3 py-1 border-4 border-foreground text-foreground font-display text-3xl uppercase rotate-[12deg] rounded-lg"
        >
          Pass
        </motion.div>
        <div className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {daysLeft <= 0 ? "Closes today" : `${daysLeft}d left`}
        </div>
      </CardShell>
    </motion.div>
  );
}

function CardShell({
  opp,
  score,
  stacked,
  children,
}: {
  opp: Opportunity;
  score: number;
  stacked?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 bg-card border-2 border-foreground rounded-[28px] shadow-stamp-lg overflow-hidden ${stacked ? "scale-[0.94] translate-y-3 opacity-60 pointer-events-none" : ""}`}
    >
      <div
        className={`px-5 py-2 ${categoryColor[opp.category]} font-mono text-[10px] font-bold uppercase tracking-wider`}
      >
        {opp.category} · {opp.organization}
      </div>
      <div className="p-6 md:p-8 h-full flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] flex-1 text-balance">
            {opp.title}
          </h3>
          <MatchPie score={score} size={86} />
        </div>
        <p className="text-sm text-foreground/75 mt-4 line-clamp-2">{opp.description}</p>

        <div className="mt-auto pt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {opp.location}
          </span>
          <div className="flex flex-wrap gap-1">
            {opp.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 border border-foreground/15 rounded-full font-mono text-[10px] uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/opportunity/$id"
          params={{ id: opp.id }}
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-foreground hover:text-primary self-start"
        >
          Tap for full details <ArrowRight className="size-3.5" />
        </Link>

        {children}
      </div>
    </div>
  );
}
