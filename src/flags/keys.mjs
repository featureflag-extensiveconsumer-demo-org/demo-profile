// Every flag key this service knows, spelled once. Call sites import the constant, so renaming a key
// is one edit and a reader can see at a glance what the profile page still asks LaunchDarkly about.
export const IDENTITY_PASSKEYS = 'demo-identity-passkeys';
export const PROFILE_PREFERENCES = 'demo-profile-preferences';
