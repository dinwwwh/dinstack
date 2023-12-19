ALTER TABLE "organizations_invitations" RENAME COLUMN "id" TO "secret_key";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "id" TO "secret_key";