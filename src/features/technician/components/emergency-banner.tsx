"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, Play } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { type TechnicianEmergency } from "../server/queries";

function formatRemaining(remainingMs: number): string {
  if (remainingMs <= 0) return "Vencida";
  const total = Math.floor(remainingMs / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * SLA en vivo. Pinta el texto directo en el DOM: un `setNow` por segundo
 * commiteaba un render cada segundo (y el overlay de Next parpadeaba
 * "Rendering") sin necesidad de tocar el árbol de React.
 */
function Countdown({ deadline }: { deadline: number }) {
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = labelRef.current;
    if (!node) return;

    let timer = 0;
    const paint = () => {
      const remainingMs = deadline * 1000 - Date.now();
      if (remainingMs <= 0) {
        node.textContent = "SLA VENCIDO";
        window.clearInterval(timer);
        return;
      }
      node.textContent = `SLA ${formatRemaining(remainingMs)}`;
    };

    paint();
    timer = window.setInterval(paint, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return (
    <span
      ref={labelRef}
      className={cn(
        "mt-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-xs font-black tabular-nums",
        "bg-white/20 text-white"
      )}
    >
      SLA --:--
    </span>
  );
}

export function EmergencyBanner({
  emergencies,
}: {
  emergencies: TechnicianEmergency[];
}) {
  return (
    <div className="space-y-2">
      {emergencies.map((emergency) => (
        <article
          key={emergency.id}
          className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-600 to-red-700 p-3.5 text-white shadow-lg"
        >
          <span className="absolute right-3 top-3 flex size-2.5 animate-pulse rounded-full bg-white/90" />

          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest">
            <AlertTriangle className="size-4" />
            Emergencia activa
          </div>
          <p className="mt-1.5 font-mono text-sm font-bold leading-tight">
            {emergency.otNumber} · {emergency.cost_center_name}
          </p>
          {emergency.cost_center_address && (
            <p className="mt-0.5 text-xs text-white/80 truncate">
              {emergency.cost_center_address}
            </p>
          )}
          <Countdown deadline={emergency.slaDeadline} />

          <Button
            render={
              <Link href={`/technician/work-orders/${emergency.id}`} />
            }
            nativeButton={false}
            className="mt-2.5 w-full min-h-11 gap-1.5 bg-white font-bold text-red-700 hover:bg-white/90"
          >
            <Play className="size-4" />
            Atender
          </Button>
        </article>
      ))}
    </div>
  );
}
