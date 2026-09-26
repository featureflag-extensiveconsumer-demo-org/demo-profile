// The only place this service asks LaunchDarkly for a boolean.
//
// The client is a parameter rather than a module-level singleton: the panels below are then testable
// without an SDK or a network, and there is exactly one call to audit when someone asks how a flag
// reaches the page. The fallback is the value the page must serve when LaunchDarkly cannot be reached,
// so it belongs at the call site and is passed through unchanged.
export async function isEnabled(client, key, context) {
  return client.boolVariation(key, context, false);
}
