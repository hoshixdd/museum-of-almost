import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_RESOURCES } from "@/lib/museum/constants";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/safety")({
  component: () => (
    <LegalPage title="Emotional safety" kicker="Care">
      <p>This platform contains personal stories that may include grief, loss, or difficult experiences. You can leave any room at any time.</p>
      <h2>If you are in danger</h2>
      <p>Contact local emergency services immediately. The museum cannot intervene, locate you, or provide medical care. Writing that describes an intent to die is not published — we ask you to get help first.</p>
      <h2>Support</h2>
      <ul className="list-disc space-y-2 pl-5">
        {SUPPORT_RESOURCES.map((resource) => (
          <li key={resource.href}>
            <a href={resource.href} target="_blank" rel="noreferrer">
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
      <h2>Reporting</h2>
      <p>Every artifact, reply, and exit note can be reported. Repeated reports from different visitors can hide a piece. Seed stories are protected. There is not a human attendant on duty around the clock — if something is urgent, use the helplines above.</p>
    </LegalPage>
  ),
});
