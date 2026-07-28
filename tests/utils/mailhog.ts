const MAILHOG_API_URL = process.env.MAILHOG_API_URL || "http://localhost:8025";

type MailhogMessage = {
  Content: { Headers: Record<string, string[]>; Body: string };
  To: Array<{ Mailbox: string; Domain: string }>;
};

async function fetchMessages(): Promise<MailhogMessage[]> {
  const response = await fetch(`${MAILHOG_API_URL}/api/v2/messages?limit=100`);
  if (!response.ok) {
    throw new Error(
      `MailHog is not reachable at ${MAILHOG_API_URL} (status ${response.status}). ` +
        "Start it with: docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog"
    );
  }
  const data = await response.json();
  return data.items as MailhogMessage[];
}

function addressMatches(message: MailhogMessage, email: string): boolean {
  const [mailbox, domain] = email.split("@");
  return message.To.some(
    (to) => to.Mailbox.toLowerCase() === mailbox.toLowerCase() && to.Domain.toLowerCase() === domain.toLowerCase()
  );
}


export async function waitForEmailTo(
  email: string,
  { timeoutMs = 15_000, intervalMs = 500 } = {}
): Promise<MailhogMessage> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const messages = await fetchMessages();
    const match = messages.find((message) => addressMatches(message, email));
    if (match) return match;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`No email arrived for ${email} within ${timeoutMs}ms`);
}


export function extractResetLink(message: MailhogMessage): string {
  const match = message.Content.Body.match(/href="([^"]*reset-password[^"]*)"/i);
  if (!match) {
    throw new Error("Reset link not found in email body");
  }
  return match[1].replace(/&amp;/g, "&");
}

export async function clearMailhogInbox(): Promise<void> {
  await fetch(`${MAILHOG_API_URL}/api/v1/messages`, { method: "DELETE" });
}
