import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Loader2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SpindelLogo } from '@/components/SpindelLogo';
import { ApiError, apiRequest } from '@/lib/api';
import { OCULAR_CATEGORIES, type OcularEducationVideo } from '@shared/ocularEducation';

export default function OcularEducation() {
  const [videos, setVideos] = useState<OcularEducationVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All videos');
  const [playing, setPlaying] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest<{ videos: OcularEducationVideo[] }>('/api/course/ocular-education')
      .then(result => { if (active) setVideos(result.videos); })
      .catch(requestError => {
        if (!active) return;
        if (requestError instanceof ApiError && requestError.status === 401) {
          window.location.assign('/spindel/login');
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load videos.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = videos.filter(video => (category === 'All videos' || video.category === category) &&
    `${video.title} ${video.creator} ${video.category}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-blue-900 to-cyan-900 text-white">
      <header className="border-b border-white/10 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <SpindelLogo className="h-11 w-40" />
          <a href="/course" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to onboarding</a>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">Optional exploration</p>
        <h1 className="mt-2 text-4xl font-bold">Ocular Education — Explore & Enjoy</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-100">Take a curiosity break. Discover the eye through short animations, fascinating procedures, and everyday eye care.</p>
        <p className="mt-3 max-w-3xl text-sm text-slate-200">Watch at your own pace. These creator videos are for entertainment and general education; clinical training and supervisor guidance remain your references for patient care. No quiz or completion requirement.</p>
        {loading ? <p role="status" className="mt-10 flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading the video library…</p> : error ?
          <div role="alert" className="mt-8 rounded-xl border border-amber-200/40 bg-slate-950/60 p-6"><p>{error}</p><Button onClick={() => window.location.reload()} className="mt-4">Try again</Button></div> : (
          <>
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Video topics">
              {['All videos', ...OCULAR_CATEGORIES].map(topic => <Button key={topic} aria-pressed={category === topic} onClick={() => { setCategory(topic); setPlaying(null); }} className={category === topic ? 'bg-cyan-200 text-slate-950 hover:bg-cyan-100' : 'border border-white/30 bg-slate-950/40 text-white hover:bg-white/20'}>{topic}</Button>)}
            </div>
            <label className="mt-5 block max-w-md text-sm font-medium">Find a video
              <input value={query} onChange={event => { setQuery(event.target.value); setPlaying(null); }} type="search" placeholder="Search titles or creators" className="mt-2 w-full rounded-lg border border-white/30 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-300 focus:outline-2 focus:outline-cyan-200" />
            </label>
            <p aria-live="polite" className="my-5 text-sm text-slate-200">{filtered.length} {filtered.length === 1 ? 'video' : 'videos'}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(video => <Card key={video.driveFileId} className="overflow-hidden border-white/10 bg-white text-slate-900 shadow-lg">
                {playing === video.driveFileId ? <div><iframe title={video.title} src={video.embedUrl} allow="autoplay; fullscreen" allowFullScreen className="h-80 w-full border-0 bg-slate-950" /><button onClick={() => setPlaying(null)} className="w-full bg-slate-100 py-2 text-sm font-semibold text-blue-800">Close player</button></div> :
                  <button onClick={() => setPlaying(video.driveFileId)} aria-label={`Play ${video.title}`} className="group relative block h-64 w-full overflow-hidden bg-slate-900">
                    <img src={video.thumbnailUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain opacity-90 transition group-hover:opacity-100" />
                    <span className="absolute inset-0 flex items-center justify-center"><PlayCircle className="h-14 w-14 rounded-full bg-slate-950/70 text-white" /></span>
                  </button>}
                <div className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{video.category}</p><h2 className="mt-2 text-xl font-bold">{video.title}</h2><p className="mt-2 text-sm text-slate-600">By {video.creator}</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-blue-800"><a href={video.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">Open in Drive <ExternalLink className="h-3 w-3" /></a><a href={video.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Original reel</a></div>
                </div>
              </Card>)}
            </div>
            {filtered.length === 0 && <p className="rounded-xl bg-slate-950/40 p-6">No videos match your search. Try another title or topic.</p>}
          </>
        )}
      </main>
    </div>
  );
}
