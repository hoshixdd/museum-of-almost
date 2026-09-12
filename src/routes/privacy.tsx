import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <LegalPage title="Privacy Policy" kicker="Policy">
      <p>The museum is designed to collect as little as possible. Last updated September 2026.</p>
      <h2>What we collect</h2>
      <p>Anonymous artifacts you choose to leave: titles, stories, optional city or region, optional year, and reaction counts. We store a visitor cookie on your device so we can rate-limit spam, remember that you already reacted, and keep reports honest. We do not ask for your name, email, or exact address.</p>
      <h2>What we do not collect</h2>
      <p>We do not store IP addresses inside artifacts. We do not expose emails. Locations are city-level only. Favorites and private capsule keys live in your browser unless you choose to write them down.</p>
      <h2>The Curator</h2>
      <p>If you talk to The Curator, your message may be sent to an AI model (xAI) so a matching story can be found. Do not put names or private facts in that box. If the Curator is away, we fall back to a simple keyword search.</p>
      <h2>Storage</h2>
      <p>Public artifacts are stored in a Postgres database (Neon on the live site, a local preview database while building) so other visitors can find them. Private capsules remain locked without the access key issued at sealing. Reports are stored so repeat flags can hide a piece. Seed stories are never auto-hidden.</p>
      <h2>Cookies</h2>
      <p>We use a visitor cookie required to keep the rooms from being flooded. We do not sell personal data. We do not build advertising profiles.</p>
      <h2>Deletion</h2>
      <p>Because submissions are anonymous, we cannot reliably match an artifact to a person later. Keep your claim slip. You may shred a piece from Your desk, or report content that should not remain. Reports are not reviewed by a person 24/7.</p>
    </LegalPage>
  ),
});
