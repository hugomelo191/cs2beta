CREATE TABLE IF NOT EXISTS "draft_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"nickname" varchar(100),
	"role" varchar(50),
	"experience" varchar(50),
	"availability" varchar(50),
	"looking_for" varchar(200),
	"team_name" varchar(100),
	"looking_for_role" varchar(50),
	"commitment" varchar(50),
	"requirements" text,
	"urgency" varchar(20) DEFAULT 'normal',
	"country" varchar(2),
	"is_active" boolean DEFAULT true,
	"views" integer DEFAULT 0,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draft_posts" ADD CONSTRAINT "draft_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
