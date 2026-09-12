import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <LegalPage title="Privacy Policy" kicker="Policy">
      <p>The museum is designed to collect as little as possible.</p>
      <h2>What we collect</h2>
      <p>Anonymous artifacts you choose to leave: titles, stories, optional city or region, optional year, and reaction counts. We generate a local visitor token in your browser. We do not ask for your name, email, or exact address.</p>
      <h2>What we do not collect</h2>
      <p>We do not store IP addresses in artifacts. We do not expose emails. Locations are city-level only. Favorites and private capsule keys live in your browser unless you choose to write them down.</p>
      <h2>Storage</h2>
      <p>Public artifacts are stored in the museum database so other visitors can find them. Private capsules remain locked without the access key issued at sealing.</p>
      <h2>Cookies and analytics</h2>
      <p>We use only what is required to keep the rooms working. We may count visits to rooms and artifacts. We do not sell personal data. We do not build advertising profiles.</p>
      <h2>Deletion</h2>
      <p>Because submissions are anonymous, we cannot reliably match an artifact to a person later. If you have a library card or capsule key, keep it; it is the only proof of authorship we can honor. You may report content that should not remain.</p>
    </LegalPage>
  ),
});
