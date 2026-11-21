import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Megaphone, Camera, X, Save, MessageSquare, Inbox, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { useGeolocation } from "@/hooks/use-geolocation";
import { newId, type IncidentItem } from "@/lib/queue";
import { buildIncidentMessage, formatCoords, formatTime, smsHref } from "@/lib/messages";
import { PageHeader } from "@/components/app/PageHeader";
import { LocationStatus } from "@/components/app/LocationStatus";
import { SyncPill } from "@/components/app/SyncPill";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an incident offline — Northeast Connect" },
      { name: "description", content: "Report floods, landslides and road blocks with GPS location. Saved offline and sent when you reconnect, or by SMS." },
      { property: "og:title", content: "Report an incident — Northeast Connect" },
      { property: "og:description", content: "Offline incident reports with GPS location and SMS sending." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

const TYPES = [
  { id: "flood", label: "Flood" },
  { id: "landslide", label: "Landslide" },
  { id: "earthquake", label: "Earthquake damage" },
  { id: "cloudburst", label: "Cloudburst / flash flood" },
  { id: "road", label: "Road blocked" },
  { id: "trapped", label: "People trapped" },
  { id: "medical", label: "Medical emergency" },
  { id: "other", label: "Other" },
] as const;

const SEVERITIES = [
  { id: "minor", label: "Minor", tone: "peer-checked:bg-caution peer-checked:text-caution-foreground peer-checked:border-caution" },
  { id: "serious", label: "Serious", tone: "peer-checked:bg-warning peer-checked:text-warning-foreground peer-checked:border-warning" },
  { id: "critical", label: "Life-threatening", tone: "peer-checked:bg-sos peer-checked:text-sos-foreground peer-checked:border-sos" },
] as const;

const typeLabel = (id: string) => TYPES.find((x) => x.id === id)?.label ?? id;
const sevLabel = (id: string) => SEVERITIES.find((x) => x.id === id)?.label ?? id;

/** Shrink photos so they fit in phone storage and send quickly on weak networks. */
async function compressPhoto(file: File, max = 800): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.6);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ReportPage() {
  const { t, addToQueue, queue, queueLoaded } = useApp();
  const geo = useGeolocation();
  const [type, setType] = useState<string>("landslide");
  const [severity, setSeverity] = useState<IncidentItem["severity"]>("serious");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { locate } = geo;

  useEffect(() => {
    void locate();
  }, [locate]);

  const reports = queue.filter((q): q is IncidentItem => q.kind === "incident");

  const currentMessage = () =>
    buildIncidentMessage({
      typeLabel: typeLabel(type),
      severityLabel: sevLabel(severity),
      description,
      createdAt: new Date().toISOString(),
      location: geo.point,
    });

  const onPhoto = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await compressPhoto(file));
    } catch {
      toast.error("Could not read that photo. Try another one.");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe what you see.");
      return;
    }
    setSaving(true);
    const item: IncidentItem = {
      id: newId(),
      kind: "incident",
      createdAt: new Date().toISOString(),
      status: "pending",
      incidentType: type,
      severity,
      description: description.trim(),
      ...(photo ? { photo } : {}),
      ...(geo.point ? { location: geo.point } : {}),
    };
    try {
      await addToQueue(item);
      toast.success(navigator.onLine ? "Report saved. Syncing now…" : "Report saved on this phone. It will sync when you are back online.");
      setDescription("");
      setPhoto(undefined);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Could not save. Phone storage may be full.");
    } finally {
      setSaving(false);
    }
  };

  const fieldset = "space-y-2";
  const legend = "mb-2 text-lg font-bold";

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <PageHeader icon={Megaphone} title={t("report.title")}>
        Saved on your phone first. Sent automatically when you have network.
      </PageHeader>

      <form onSubmit={onSubmit} className="space-y-5">
        <fieldset className={fieldset}>
          <legend className={legend}>{t("report.type")}</legend>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name="type" value={x.id} checked={type === x.id} onChange={() => setType(x.id)} className="peer sr-only" />
                <span className="flex min-h-12 items-center rounded-xl border-2 bg-card px-3 py-2 text-base font-bold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-3 peer-focus-visible:outline-ring">
                  {x.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={fieldset}>
          <legend className={legend}>{t("report.severity")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {SEVERITIES.map((s) => (
              <label key={s.id} className="cursor-pointer">
                <input type="radio" name="severity" value={s.id} checked={severity === s.id} onChange={() => setSeverity(s.id)} className="peer sr-only" />
                <span className={`flex min-h-14 items-center justify-center rounded-xl border-2 bg-card px-2 text-center text-base leading-tight font-bold peer-focus-visible:outline-3 peer-focus-visible:outline-ring ${s.tone}`}>
                  {s.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="desc" className={legend + " block"}>
            {t("report.description")}
          </label>
          <textarea
            id="desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Big landslide on the road near the school. Two houses damaged. 6 people need help."
            className="w-full rounded-xl border border-input bg-card p-3 text-base"
          />
        </div>

        <div>
          <span className={legend + " block"}>{t("report.photo")}</span>
          {photo ? (
            <div className="relative inline-block">
              <img src={photo} alt="Selected incident photo" className="max-h-56 rounded-xl border" />
              <button
                type="button"
                onClick={() => {
                  setPhoto(undefined);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                aria-label="Remove photo"
                className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : (
            <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-card px-4 text-base font-bold text-primary">
              <Camera className="h-5 w-5" aria-hidden />
              {t("report.photo")}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void onPhoto(e.target.files?.[0])} />
            </label>
          )}
        </div>

        <LocationStatus geo={geo} />

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground shadow-tile active:scale-[0.98] disabled:opacity-60"
          >
            <Save className="h-5 w-5" aria-hidden />
            {t("report.save")}
          </button>
          <a
            href={smsHref(currentMessage())}
            onClick={(e) => {
              // Rebuild at tap time so the time and location are current.
              e.currentTarget.href = smsHref(currentMessage());
            }}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-card px-4 text-lg font-bold text-primary active:scale-[0.98]"
          >
            <MessageSquare className="h-5 w-5" aria-hidden />
            {t("report.sms")}
          </a>
        </div>
      </form>

      <section aria-labelledby="saved">
        <h2 id="saved" className="mb-3 text-xl font-bold">
          {t("report.saved")} {reports.length > 0 && <span className="text-muted-foreground">({reports.length})</span>}
        </h2>
        {queueLoaded && reports.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center text-muted-foreground">
            <Inbox className="h-9 w-9" aria-hidden />
            <p className="text-base">{t("report.empty")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="flex gap-3 rounded-xl border bg-card p-3">
                {r.photo && <img src={r.photo} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold">{typeLabel(r.incidentType)}</span>
                    <span className="text-sm text-muted-foreground">· {sevLabel(r.severity)}</span>
                    <span className="ml-auto">
                      <SyncPill status={r.status} />
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-base">{r.description}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                    <span>{formatTime(r.createdAt)}</span>
                    {r.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden />
                        {formatCoords(r.location)}
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
