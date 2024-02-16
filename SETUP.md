# Setup

## Clerk authentication

1. Allow organization feature

2. Create browser-extension JWT template

- Name: `browser-extension`
- Token lifetime: `604800` seconds
- Claims:

```json
{
  "org_id": "{{org.id}}",
  "org_role": "{{org.role}}",
  "org_slug": "{{org.slug}}",
  "org_permissions": "{{org_membership.permissions}}"
}
```

3. Create a knock JWT template

- Name: `knock`
- Token lifetime: `86400` seconds
- Custom signing key: `turn on`
- Signing algorithm: `RS256`
- Signing key: get it from `knock` in advanced
- Claims:

```json
{}
```

## Knock notification

1. Enable `Enhanced security mode`
