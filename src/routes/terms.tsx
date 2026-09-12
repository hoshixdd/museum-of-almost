import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/terms")({
  component: () => (
    <LegalPage title="Terms of Service" kicker="Policy">
      <p>By entering The Museum of Almost you agree to use it as an anonymous archive, not as a social network, marketplace, or private messaging service. Last updated September 2026.</p>
      <h2>Age</h2>
      <p>You must be 16 or older to leave writing here. The rooms are not designed for children.</p>
      <h2>Your responsibility</h2>
      <p>You are responsible for what you submit. Do not include names, contact details, or private facts about other people. Submissions are anonymous but not secret from the people who run the museum or, if required, the law.</p>
      <h2>Prohibited content</h2>
      <p>You may not submit harassment, hate speech, threats, sexual content involving minors, illegal activity, spam, impersonation, or material intended to harm. We may hide artifacts after visitor reports. There is not a person reading every report in real time.</p>
      <h2>Intellectual property</h2>
      <p>You keep whatever rights you have in your writing. You grant the museum a non-exclusive license to display it anonymously in these rooms. Seeded works are original to the museum and may not be republished as your own.</p>
      <h2>Claim slips</h2>
      <p>When you leave a piece, this device stores a claim slip. That slip is the only way to shred it. We cannot match a person to a letter later.</p>
      <h2>Platform limitations</h2>
      <p>The museum is provided as-is. Rooms may close, artifacts may be rotated, and we do not guarantee that a capsule will open on a particular device or date. We are not a backup service, therapist, or emergency resource.</p>
    </LegalPage>
  ),
});
