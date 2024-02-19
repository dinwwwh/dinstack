<p><a target="_blank" href="https://app.eraser.io/workspace/jIezh0PVuL6ZxKpHAHZb" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

# Setup
This document contains all services and requirements to ensure this repo can run properly in `local`, `preview`, and `production` environments.



![Infastructure Figure](/.eraser/jIezh0PVuL6ZxKpHAHZb___6dmrbQuO6UUieKrtFHFzHdoYXQu1___---figure---zwzCOVwgA0OaR9cStm3aU---figure---GB8qMfkzlfJepOqHN_zkTQ.png "Infastructure Figure")



## Posthog
---

Required for `@api` , `@content` , and `@web` . Used for analytics feature.

> Create 3 projects respectively for local, preview, and production environments



- [ ] Enable `Session Replay`  feature
![image.png](/.eraser/jIezh0PVuL6ZxKpHAHZb___6dmrbQuO6UUieKrtFHFzHdoYXQu1___6lYL5kjlXI5bHhVqpcu4p.png "image.png")



## Turnstile
---

Required for `@api` , and `@web`  (`Turnstile`  does not support browser extensions right now). Used for bot protection feature.

> Create 2 turnstile sites respectively for preview, and production environments (local should use testing mode)



## Knock notification
---

Required for `@api`  and `@web` . Used for notification feature.



> Use `Knock's production`  for production and `Knock's development`  for local and preview environments



- [ ] Enable `Enhanced security mode` 


## Lemon squeezy
---

Required for `@api`  and `@web` . Used for billing feature.



> Create 3 stores respectively for local, preview, and production environments



- [ ] Setup webhook
- URL: `<API_BASE_URL>/billing/webhook` 
- Events: `order_created` , `order_refunded` 


## Clerk
---

Required for `@api` , `@web` , and `@extension` . Used for authentication feature.



- [ ] Use `Clerk's production`  for production and `Clerk's development`  for local and preview environments


- [ ] Allow organization feature


- [ ] Create a `browser-extension` JWT template.
- Name: `browser-extension` 
- Token lifetime: `604800`  seconds
- Claims:
```json
{
  "org_id": "{{org.id}}",
  "org_role": "{{org.role}}",
  "org_slug": "{{org.slug}}",
  "org_permissions": "{{org_membership.permissions}}"
}
```


- [ ] Create a `knock` JWT template.
- Name: `knock` 
- Token lifetime: `86400`  seconds
- Custom signing key: `turn on` 
- Signing algorithm: `RS256` 
- Signing key: get it from `knock`  in `Application signing keys` -> `Advanced` 
- Claims:
```json
{}
```


- [ ] Setup webhook
- URL: `<API_BASE_URL>/auth/webhook` 
- Events: `user.created` , `user.updated` , `user.deleted` 


## Cloudflare
---

Required for `@api`  `@content`  `@web`  `Github Action` . Used for deploying



- [ ] Ensure you fully prepare the required environment variables contains in the files: `@api/.dev.example.vars` , `@api/.env.example` , `@api/wrangler.toml` , `@web/.env.local` , `@web/.env.preview` , `@web/.env.production` 
> For example files please duplicate and remove `.example`  in file names.



- [ ] Create the following Cloudflare Pages with names: `dinstack-content-preview` , `dinstack-content-production` , `dinstack-web-preview` , and `dinstack-web-production` 
> `Workers & Pages`  -> `Pages`  -> `Create using direct upload` -> `Create Project` 

> `Pages` need to create mannually but `Workers` will be auto-create when run deploy command



- [ ] Create Cloudflare's API token with the below permission and save it to `CLOUDFLARE_API_TOKEN`  Github action secrets
![image.png](/.eraser/jIezh0PVuL6ZxKpHAHZb___6dmrbQuO6UUieKrtFHFzHdoYXQu1___BurCwjK0QQJH3kkWvUP1_.png "image.png")

`Github Action`  will use this token for auto-deployment to preview and production environments.



- [ ] Check it works and auto-create worker projects by running `pnpm -w  deploy:preview`  and  `pnpm -w deploy:production` 


- [ ] Setup `domains` for workers and pages


- [ ] Setup `environment variables` for workers (ensure encrypt value)
![image.png](/.eraser/jIezh0PVuL6ZxKpHAHZb___6dmrbQuO6UUieKrtFHFzHdoYXQu1___yeJnDOO2PS2U9VOYSebfK.png "image.png")






<!--- Eraser file: https://app.eraser.io/workspace/jIezh0PVuL6ZxKpHAHZb --->