import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/museum/legal";

export const Route = createFileRoute("/guidelines")({
  component: () => (
    <LegalPage title="Community Guidelines" kicker="Policy">
      <p>This is a museum of almosts, not a forum. Write as if a stranger will hold what you leave with both hands.</p>
      <h2>Do not</h2>
      <p>Harass. Use hate speech. Threaten. Share explicit sexual content. Describe illegal activity in a way that invites it. Publish personal information. Impersonate. Offer diagnosis or punishment on the Stranger Wall.</p>
      <h2>Do</h2>
      <p>Stay anonymous. Speak from your own life. Leave replies that recognize rather than correct. Report what should not be here. Take a walk if a room becomes too much.</p>
      <h2>The Stranger Wall</h2>
      <p>Replies such as “I understand” belong. Advice, arguments, and moral scorekeeping do not. The wall will refuse some sentences on purpose.</p>
      <h2>How to report</h2>
      <p>Open the piece, tap Report, and choose a reason. One visitor cannot wipe the museum. Seed stories stay. If you need a piece you wrote removed, use the claim slip on Your desk.</p>
    </LegalPage>
  ),
});
