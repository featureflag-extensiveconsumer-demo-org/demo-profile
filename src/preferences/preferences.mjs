import { PROFILE_PREFERENCES } from '../flags/keys.mjs';
import { isEnabled } from '../flags/client.mjs';

// The preferences panel: one consolidated page, or the two separate pages it replaced.
export async function renderPreferences(client, context) {
  const consolidated = await isEnabled(client, PROFILE_PREFERENCES, context);
  return {
    consolidated,
    panels: consolidated ? ['preferences'] : ['notifications', 'privacy']
  };
}
