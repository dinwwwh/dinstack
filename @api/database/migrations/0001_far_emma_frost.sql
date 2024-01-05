CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"lemon_squeezy_id" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"variant_id" integer NOT NULL,
	"expired_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_lemon_squeezy_id_unique" UNIQUE("lemon_squeezy_id"),
	CONSTRAINT "subscriptions_variant_id_user_id_unique" UNIQUE("variant_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
