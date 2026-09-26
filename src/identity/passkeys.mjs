import { IDENTITY_PASSKEYS } from '../flags/keys.mjs';
import { isEnabled } from '../flags/client.mjs';

// The sign-in panel. While the passkey rollout runs, some customers are offered the passkey challenge
// alongside the password form and the rest see the password form alone.
export async function renderSignIn(client, context) {
  const passkeyOffered = await isEnabled(client, IDENTITY_PASSKEYS, context);
  return {
    passkeyOffered,
    methods: passkeyOffered ? ['passkey', 'password'] : ['password']
  };
}
