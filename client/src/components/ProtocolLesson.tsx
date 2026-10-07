import React from 'react';
import { Card } from '@/components/ui/card';
import { getProtocolsForModuleDay } from '@/data/spindelProtocols';

export function ProtocolLesson({day}: {day:number}) {
  const protocols = getProtocolsForModuleDay(day);
  if (!protocols.length) return null;
  return <section aria-label="Required doctor workup protocols" className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Required doctor workup protocols</h2>
    <p className="text-slate-700">Review each doctor and visit type. Use the linked current source and physician order for complete testing requirements.</p>
    {protocols.map(protocol => <Card key={protocol.id} className="p-6 text-slate-100 sm:p-8">
      <h3 className="text-2xl font-bold text-white">{protocol.doctorName}</h3>
      <a href={protocol.source.url} target="_blank" rel="noreferrer" className="break-words text-cyan-200 underline">{protocol.source.label}</a>
      <p className="text-sm text-slate-300">Source reviewed {protocol.source.reviewedOn}. Verify current instructions before clinical use.</p>
      {protocol.visits.map(visit => <section key={visit.visitType} className="space-y-3 rounded-lg bg-slate-900 p-4">
        <h4 className="text-lg font-bold text-white">{visit.visitType}</h4>
        <p className="text-slate-200">{visit.summary}</p>
        <ol className="list-decimal space-y-3 pl-5 text-slate-200">
          {visit.steps.map((step,index) => <li key={`${step.label}-${index}`}><strong className="text-white">{step.label}: </strong>{step.detail}{step.condition && <p className="mt-1 text-cyan-200">When: {step.condition}</p>}</li>)}
        </ol>
      </section>)}
      <ul className="list-disc space-y-2 pl-5 text-slate-200">{protocol.reminders.map(reminder => <li key={reminder}>{reminder}</li>)}</ul>
    </Card>)}
  </section>;
}
