ALTER TABLE "organizations_invitations" RENAME TO "organization_invitations";--> statement-breakpoint
ALTER TABLE "organization_invitations" DROP CONSTRAINT "organizations_invitations_organization_id_email_unique";--> statement-breakpoint
ALTER TABLE "organization_invitations" DROP CONSTRAINT "organizations_invitations_organization_id_organizations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_organization_id_email_unique" UNIQUE("organization_id","email");