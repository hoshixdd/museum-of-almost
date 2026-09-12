import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_RESOURCES } from "@/lib/museum/constants";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/safety")({
  component: () => (
    <LegalPage title="Emotional safety" kicker="Care">
      <p>This platform contains personal stories that may include grief, loss, or difficult experiences. You can leave any room at any time.</p>
      <h2>If you are in danger</h2>
      <p>Contact local emergency services immediately. The museum cannot intervene, locate you, or provide medical care.</p>
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
      <p>Every artifact can be reported. Repeated reports hide it from the rooms while an attendant reviews the file.</p>
    </LegalPage>
  ),
});
