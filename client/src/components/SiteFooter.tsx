import { Eye } from "lucide-react";
import { usePublicConfig } from "@/lib/publicConfig";

export default function SiteFooter() {
  const config = usePublicConfig();

  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 py-10 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <Eye className="h-5 w-5 text-cyan-400" />
            {config.businessName}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">
            Self-paced ophthalmic technician education for individuals and clinical teams.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-white">Course</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p><a href="/curriculum" className="hover:text-white">Curriculum</a></p>
            <p><a href="/login" className="hover:text-white">Student sign in</a></p>
            <p><a href="/support" className="hover:text-white">Support</a></p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white">Policies</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p><a href="/terms" className="hover:text-white">Terms of Service</a></p>
            <p><a href="/privacy" className="hover:text-white">Privacy Policy</a></p>
            <p><a href="/refunds" className="hover:text-white">Refund Policy</a></p>
            <p><a href="/disclaimer" className="hover:text-white">Training Disclaimer</a></p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-xs text-slate-300">
        © {new Date().getFullYear()} {config.businessLegalName}. Certificate of completion only; not professional certification or licensure.
      </div>
    </footer>
  );
}
