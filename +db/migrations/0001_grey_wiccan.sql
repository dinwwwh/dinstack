CREATE TABLE IF NOT EXISTS "organizations_invitations" (
	"id" char(64) PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "organization_member_roles" DEFAULT 'member' NOT NULL,
	"expired_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations_invitations" ADD CONSTRAINT "organizations_invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
