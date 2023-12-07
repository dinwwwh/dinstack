CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"provider" varchar(255) NOT NULL,
	"provider_user_id" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT oauth_accounts_provider_provider_user_id_pk PRIMARY KEY("provider","provider_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
