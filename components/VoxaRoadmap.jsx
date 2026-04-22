'use client';

import { useState } from "react";

const roadmap = [
  {
    phase: "Phase 1",
    title: "Foundation",
    duration: "Weeks 1–4",
    color: "#00C9A7",
    icon: "⬡",
    sections: [
      {
        title: "1.1 — Infrastructure Setup & CI/CD Pipeline",
        tasks: [
          {
            id: "1.1.1",
            text: "Create AWS account with IAM roles for dev, staging, and production environments",
            sub: []
          },
          {
            id: "1.1.2",
            text: "Provision VPC in ap-south-1 (Mumbai) with public/private subnet split",
            sub: [
              "Set up NAT gateway for private subnet outbound",
              "Configure security groups: allow 443 inbound, restrict DB to internal only"
            ]
          },
          {
            id: "1.1.3",
            text: "Set up EKS cluster (Kubernetes) with auto-scaling node groups",
            sub: [
              "Create 3 node groups: general, ai-compute (GPU/high-mem), spot-workers",
              "Install Helm, cert-manager, ingress-nginx, external-dns"
            ]
          },
          {
            id: "1.1.4",
            text: "Set up GitHub monorepo structure with the following packages",
            sub: [
              "apps/api — main backend (Fastify / Node.js)",
              "apps/ai-service — Python FastAPI for all LLM/agent calls",
              "apps/dashboard — Next.js business dashboard",
              "apps/consumer-app — Next.js + React Native consumer search",
              "packages/shared — shared types, utils, constants",
              "infra/ — Terraform IaC definitions"
            ]
          },
          {
            id: "1.1.5",
            text: "Configure GitHub Actions CI/CD pipelines",
            sub: [
              "On PR: lint, type-check, unit tests, build Docker image",
              "On merge to main: push to ECR, deploy to staging via ArgoCD",
              "On release tag: deploy to production with manual approval gate"
            ]
          },
          {
            id: "1.1.6",
            text: "Set up ArgoCD for GitOps-based Kubernetes deployments",
            sub: []
          },
          {
            id: "1.1.7",
            text: "Configure secrets management with AWS Secrets Manager",
            sub: [
              "Store all API keys (Anthropic, Exotel, 360dialog, Razorpay, etc.)",
              "Inject secrets as env vars into pods at runtime via ESO (External Secrets Operator)"
            ]
          },
          {
            id: "1.1.8",
            text: "Set up Terraform for all infrastructure as code (IaC)",
            sub: [
              "Modules: VPC, EKS, RDS, ElastiCache, S3, CloudFront, Route53"
            ]
          },
          {
            id: "1.1.9",
            text: "Configure observability stack",
            sub: [
              "Prometheus + Grafana for metrics",
              "Loki for log aggregation",
              "Jaeger or AWS X-Ray for distributed tracing",
              "PagerDuty or OpsGenie for on-call alerting"
            ]
          }
        ]
      },
      {
        title: "1.2 — Auth Service & Multi-Tenant DB Schema",
        tasks: [
          {
            id: "1.2.1",
            text: "Integrate Clerk for authentication (OTP-first, phone number sign-in)",
            sub: [
              "Configure Clerk for Indian phone numbers (+91)",
              "Enable Google OAuth as secondary sign-in option",
              "Set up Clerk webhooks to sync user creation to internal DB"
            ]
          },
          {
            id: "1.2.2",
            text: "Design multi-tenant PostgreSQL schema",
            sub: [
              "Create tenants table (businesses) with UUID primary keys",
              "Add tenant_id foreign key to all business-scoped tables",
              "Enable Row Level Security (RLS) on all tenant-scoped tables",
              "Write RLS policies: tenant can only SELECT/UPDATE their own rows",
              "Create separate consumers table (not tenant-scoped)"
            ]
          },
          {
            id: "1.2.3",
            text: "Set up RDS PostgreSQL 15 (Multi-AZ) in ap-south-1",
            sub: [
              "Enable automated backups with 7-day retention",
              "Configure read replica for analytics queries",
              "Set up pgBouncer connection pooler"
            ]
          },
          {
            id: "1.2.4",
            text: "Install and enable PostGIS extension on RDS instance",
            sub: []
          },
          {
            id: "1.2.5",
            text: "Write and run initial DB migrations with Prisma or Drizzle ORM",
            sub: [
              "users, businesses, business_hours, business_services",
              "consumers, calls, messages, bookings, leads",
              "knowledge_base_documents, agent_configs"
            ]
          },
          {
            id: "1.2.6",
            text: "Build JWT middleware for API authentication",
            sub: [
              "Validate Clerk session token on every request",
              "Attach tenant context to request object"
            ]
          }
        ]
      },
      {
        title: "1.3 — Business Directory DB (PostgreSQL + PostGIS)",
        tasks: [
          {
            id: "1.3.1",
            text: "Design businesses table schema",
            sub: [
              "Fields: id, name, category, description, phone, address, city, state, pincode",
              "Add GEOMETRY(Point, 4326) column for lat/lng geo indexing",
              "Add fields: rating, review_count, is_verified, subscription_tier, is_active",
              "Add JSONB config column for per-business AI settings"
            ]
          },
          {
            id: "1.3.2",
            text: "Create GIST spatial index on the geometry column",
            sub: []
          },
          {
            id: "1.3.3",
            text: "Build geo-search query using ST_DWithin for radius-based discovery",
            sub: [
              "Accept lat, lng, radius_km, category, limit as params",
              "Order results by: subscription tier DESC, rating DESC, distance ASC"
            ]
          },
          {
            id: "1.3.4",
            text: "Build business_services table",
            sub: [
              "Fields: id, business_id, service_name, price_from, price_to, duration_minutes",
              "Seed with common service categories for top verticals (salons, clinics, restaurants)"
            ]
          },
          {
            id: "1.3.5",
            text: "Build business_hours table with day-of-week and open/close times",
            sub: [
              "Support special hours (holidays) and temporary closures"
            ]
          },
          {
            id: "1.3.6",
            text: "Build business onboarding REST API endpoints",
            sub: [
              "POST /businesses — create listing",
              "PUT /businesses/:id — update listing",
              "POST /businesses/:id/services — add services",
              "POST /businesses/:id/hours — set hours",
              "GET /businesses/search — geo + category search"
            ]
          }
        ]
      },
      {
        title: "1.4 — Telephony Integration (Exotel)",
        tasks: [
          {
            id: "1.4.1",
            text: "Create Exotel account and purchase a virtual number (VN) in India",
            sub: [
              "Purchase at least one number per region for pilot",
              "Ensure TRAI DLT registration is complete for SMS"
            ]
          },
          {
            id: "1.4.2",
            text: "Configure Exotel inbound call webhook",
            sub: [
              "Point to POST /webhooks/exotel/inbound on our API",
              "Exotel sends: CallSid, From, To, CallStatus, RecordingUrl"
            ]
          },
          {
            id: "1.4.3",
            text: "Build inbound call handler",
            sub: [
              "Parse caller number, look up consumer in DB or create new",
              "Respond with ExoML to connect call to our media server",
              "Stream audio to STT pipeline in real-time"
            ]
          },
          {
            id: "1.4.4",
            text: "Set up missed call detection webhook",
            sub: [
              "On missed call event: log it, trigger AI outbound callback within 30s"
            ]
          },
          {
            id: "1.4.5",
            text: "Build outbound call API using Exotel API",
            sub: [
              "POST /calls/outbound — accepts to_number, agent_script_context",
              "Handle call status callbacks (answered, busy, no-answer)"
            ]
          },
          {
            id: "1.4.6",
            text: "Set up call recording storage",
            sub: [
              "Configure Exotel to upload recordings to S3 bucket",
              "Store recording URL + call metadata in calls table"
            ]
          },
          {
            id: "1.4.7",
            text: "Build real-time audio streaming pipeline",
            sub: [
              "WebSocket server to receive audio stream from Exotel",
              "Chunk audio (200ms) and send to Sarvam AI STT",
              "Return TTS audio bytes back via WebSocket to Exotel"
            ]
          }
        ]
      },
      {
        title: "1.5 — WhatsApp Business API Setup (360dialog)",
        tasks: [
          {
            id: "1.5.1",
            text: "Register with 360dialog as Meta BSP partner, complete business verification",
            sub: []
          },
          {
            id: "1.5.2",
            text: "Create WhatsApp Business Account (WABA) and get API key",
            sub: []
          },
          {
            id: "1.5.3",
            text: "Configure inbound message webhook",
            sub: [
              "Point to POST /webhooks/whatsapp/inbound",
              "Handle text, audio, image, and document message types"
            ]
          },
          {
            id: "1.5.4",
            text: "Build WhatsApp message sender service",
            sub: [
              "Send text messages, template messages, interactive buttons",
              "Support quick-reply buttons for booking confirmations"
            ]
          },
          {
            id: "1.5.5",
            text: "Create and register WhatsApp message templates",
            sub: [
              "booking_confirmation — 'Your appointment with {business} is confirmed for {date} at {time}'",
              "booking_reminder — '24hr reminder for your appointment tomorrow'",
              "csat_request — 'How was your experience? Rate 1–5'",
              "lead_followup — 'Hi {name}, following up on your enquiry about {service}'"
            ]
          },
          {
            id: "1.5.6",
            text: "Build conversation session manager for WhatsApp",
            sub: [
              "Track active WhatsApp conversations in Redis with 24hr TTL",
              "Resume conversation context on reply within session window"
            ]
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "AI Core",
    duration: "Weeks 5–9",
    color: "#845EF7",
    icon: "⬡",
    sections: [
      {
        title: "2.1 — AI Orchestrator Service",
        tasks: [
          {
            id: "2.1.1",
            text: "Build Python FastAPI service: ai-service",
            sub: [
              "Separate service to isolate LLM latency from main API",
              "Communicate via internal HTTP or gRPC"
            ]
          },
          {
            id: "2.1.2",
            text: "Implement intent detection using Claude claude-sonnet-4-20250514",
            sub: [
              "Intents to classify: DISCOVER, BOOK, FAQ, LEAD, COMPLAINT, HANDOFF, CHIT_CHAT",
              "Include confidence score; fall back to FAQ agent if below threshold",
              "Pass detected language (Hindi, English, Hinglish, Tamil, Telugu, etc.)"
            ]
          },
          {
            id: "2.1.3",
            text: "Implement language detection",
            sub: [
              "Use langdetect library or Sarvam AI language ID",
              "Store detected language in session context",
              "All downstream agents respond in the same language"
            ]
          },
          {
            id: "2.1.4",
            text: "Build routing logic",
            sub: [
              "Map intent → agent: DISCOVER → discovery_agent, BOOK → booking_agent, etc.",
              "Maintain agent_state in Redis: which agent is currently active for session",
              "Support mid-conversation intent switches (e.g., consumer asks FAQ mid-booking)"
            ]
          },
          {
            id: "2.1.5",
            text: "Implement conversation memory system",
            sub: [
              "Store last N turns in Redis (sliding window, N=20)",
              "Embed key facts (name, intent, service) into vector DB for long-term recall",
              "On new session from same number: retrieve top-3 relevant past facts"
            ]
          },
          {
            id: "2.1.6",
            text: "Build orchestrator system prompt",
            sub: [
              "Include: business context, consumer name (if known), detected language, conversation history",
              "Inject business-specific AI config from JSONB config column",
              "Tune persona (friendly, professional, urgent) per business config"
            ]
          },
          {
            id: "2.1.7",
            text: "Build tool-use layer for Claude (function calling)",
            sub: [
              "search_businesses(query, lat, lng, radius)",
              "get_available_slots(business_id, date_range)",
              "create_booking(business_id, consumer_id, service_id, slot)",
              "get_business_faqs(business_id, question)",
              "create_lead(business_id, consumer_data, bant_scores)",
              "trigger_human_handoff(session_id, reason)"
            ]
          }
        ]
      },
      {
        title: "2.2 — STT / TTS Pipeline (Sarvam AI + Deepgram)",
        tasks: [
          {
            id: "2.2.1",
            text: "Integrate Sarvam AI STT API",
            sub: [
              "Support languages: Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati",
              "Stream audio chunks via WebSocket for low-latency transcription",
              "Handle code-switching (Hinglish) gracefully"
            ]
          },
          {
            id: "2.2.2",
            text: "Integrate Deepgram as fallback STT for English-dominant calls",
            sub: [
              "Route to Deepgram if detected language is English with >80% confidence"
            ]
          },
          {
            id: "2.2.3",
            text: "Build STT normaliser",
            sub: [
              "Strip filler words (um, uh, acha, haan)",
              "Fix number transcription (teen → 3, ek sau → 100)"
            ]
          },
          {
            id: "2.2.4",
            text: "Integrate Sarvam AI TTS API",
            sub: [
              "Select appropriate voice model per language",
              "Support SSML-like pauses for natural pacing",
              "Cache frequent TTS outputs (greetings, confirmations) in S3 + CloudFront"
            ]
          },
          {
            id: "2.2.5",
            text: "Build end-of-utterance detection",
            sub: [
              "Detect 700ms silence as end of user turn",
              "Trigger AI response generation immediately after silence detection"
            ]
          },
          {
            id: "2.2.6",
            text: "Measure and optimise full voice round-trip latency",
            sub: [
              "Target: STT + LLM + TTS < 2 seconds total",
              "Use streaming LLM response + streaming TTS to start speaking before full response is generated"
            ]
          }
        ]
      },
      {
        title: "2.3 — Discovery Agent",
        tasks: [
          {
            id: "2.3.1",
            text: "Build discovery_agent prompt",
            sub: [
              "Given: consumer query, lat/lng (from phone's area code approximation or consumer profile)",
              "Output: structured list of top 3 businesses with name, distance, rating, relevant services"
            ]
          },
          {
            id: "2.3.2",
            text: "Implement fuzzy category matching",
            sub: [
              "Map free-form queries ('need a good dentist near me', 'where to fix my phone') to DB categories",
              "Use embedding similarity or a predefined synonym map"
            ]
          },
          {
            id: "2.3.3",
            text: "Build ranking algorithm",
            sub: [
              "Score = 0.4 × (subscription_tier) + 0.3 × (rating/5) + 0.3 × (1 - normalised_distance)",
              "Penalise businesses that are currently closed"
            ]
          },
          {
            id: "2.3.4",
            text: "Add real-time open/closed status check using business_hours table",
            sub: []
          },
          {
            id: "2.3.5",
            text: "Build voice-friendly response formatter",
            sub: [
              "Convert DB results to natural language: 'I found 3 options near you. The first is Sharma Dental Clinic, 1.2km away, rated 4.7 stars, open now.'",
              "Support follow-up narrowing: 'Which one do you want to know more about?'"
            ]
          }
        ]
      },
      {
        title: "2.4 — FAQ / Support Agent + Knowledge Base",
        tasks: [
          {
            id: "2.4.1",
            text: "Build knowledge base document ingestion pipeline",
            sub: [
              "Business owners upload FAQs via dashboard (text, PDF, paste)",
              "Chunk documents into 512-token segments",
              "Embed each chunk using OpenAI text-embedding-3-small",
              "Store embeddings in pgvector table with business_id scoping"
            ]
          },
          {
            id: "2.4.2",
            text: "Build semantic FAQ retrieval",
            sub: [
              "On incoming question: embed it, run cosine similarity search in pgvector",
              "Retrieve top-5 chunks with score > 0.75 threshold",
              "Pass chunks as context to Claude for answer synthesis"
            ]
          },
          {
            id: "2.4.3",
            text: "Seed default FAQ templates per business category",
            sub: [
              "Salons: pricing, availability, services offered, parking",
              "Clinics: appointment process, insurance, doctor specializations",
              "Restaurants: menu highlights, timings, delivery, reservations"
            ]
          },
          {
            id: "2.4.4",
            text: "Build fallback for unanswerable questions",
            sub: [
              "If no chunk matches with sufficient confidence: 'I don't have that info, let me connect you to someone who can help'",
              "Log unanswered questions for business owner review in dashboard"
            ]
          },
          {
            id: "2.4.5",
            text: "Build knowledge base CRUD API for dashboard",
            sub: [
              "GET /knowledge-base — list documents",
              "POST /knowledge-base — upload and embed new document",
              "DELETE /knowledge-base/:id — remove document and its embeddings"
            ]
          }
        ]
      },
      {
        title: "2.5 — Booking Agent + Calendar Engine",
        tasks: [
          {
            id: "2.5.1",
            text: "Build time_slots table",
            sub: [
              "Fields: id, business_id, service_id, start_time, end_time, is_booked, booked_by_consumer_id",
              "Generate slots automatically from business_hours + service duration"
            ]
          },
          {
            id: "2.5.2",
            text: "Build slot generation cron job",
            sub: [
              "Runs nightly: generates slots for next 30 days for all active businesses",
              "Respects: business hours, service durations, buffer time between appointments"
            ]
          },
          {
            id: "2.5.3",
            text: "Build get_available_slots function",
            sub: [
              "Input: business_id, service_id, preferred_date",
              "Output: list of available slots with human-readable times"
            ]
          },
          {
            id: "2.5.4",
            text: "Build booking confirmation flow in agent",
            sub: [
              "Step 1: Offer 3 nearest available slots",
              "Step 2: Consumer confirms a slot",
              "Step 3: Lock slot with SELECT FOR UPDATE to prevent race conditions",
              "Step 4: Create booking record, send confirmation via WhatsApp + SMS"
            ]
          },
          {
            id: "2.5.5",
            text: "Build booking reminders",
            sub: [
              "24hr before: WhatsApp reminder with cancel/reschedule option",
              "1hr before: SMS reminder",
              "Use BullMQ delayed jobs scheduled at booking creation time"
            ]
          },
          {
            id: "2.5.6",
            text: "Build cancellation and rescheduling flow",
            sub: [
              "Consumer replies 'cancel' or 'reschedule' to WhatsApp reminder",
              "AI handles full cancel/reschedule conversation",
              "Release old slot, optionally offer new slots"
            ]
          },
          {
            id: "2.5.7",
            text: "Build optional Google Calendar sync for business owners",
            sub: [
              "OAuth flow to connect Google Calendar",
              "Write new bookings to Google Calendar event",
              "Pull existing Google Calendar blocks as unavailable slots"
            ]
          }
        ]
      },
      {
        title: "2.6 — Lead Qualification Agent (BANT + CRM Write)",
        tasks: [
          {
            id: "2.6.1",
            text: "Build BANT scoring prompt",
            sub: [
              "Budget: Did they mention a price range or budget constraint?",
              "Authority: Are they the decision maker? (e.g., 'I need to ask my husband')",
              "Need: How specific and urgent is the need?",
              "Timeline: When are they looking to proceed?"
            ]
          },
          {
            id: "2.6.2",
            text: "Build leads table schema",
            sub: [
              "Fields: id, business_id, consumer_id, source_channel, bant_budget_score (0-3), bant_authority_score, bant_need_score, bant_timeline_score, total_score, status, created_at",
              "Status enum: NEW, CONTACTED, QUALIFIED, CONVERTED, LOST"
            ]
          },
          {
            id: "2.6.3",
            text: "Build lead capture trigger logic",
            sub: [
              "Trigger lead creation when: consumer expresses interest but doesn't book",
              "Also trigger when: consumer hangs up mid-booking, or explicitly asks 'call me back'"
            ]
          },
          {
            id: "2.6.4",
            text: "Build CRM write endpoint",
            sub: [
              "POST /leads — create lead with BANT scores",
              "PUT /leads/:id/status — update lead status",
              "Optionally sync to HubSpot via HubSpot CRM API (for premium tier businesses)"
            ]
          },
          {
            id: "2.6.5",
            text: "Build lead LTV estimation",
            sub: [
              "Simple model: avg_service_price × expected_visits_per_year × retention_years",
              "Display as 'Estimated LTV: ₹X,XXX' in dashboard"
            ]
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Post-Call & Notifications",
    duration: "Weeks 10–12",
    color: "#FF6B6B",
    icon: "⬡",
    sections: [
      {
        title: "3.1 — Post-Call Agent",
        tasks: [
          {
            id: "3.1.1",
            text: "Build post_call_jobs BullMQ queue",
            sub: [
              "Triggered immediately when call ends (Exotel call-end webhook)",
              "Jobs: generate_summary, send_csat, schedule_followup, update_crm"
            ]
          },
          {
            id: "3.1.2",
            text: "Build call summary generator",
            sub: [
              "Pass full call transcript to Claude",
              "Prompt: extract intent, resolution, next_action, consumer_sentiment",
              "Store structured summary in call_summaries table"
            ]
          },
          {
            id: "3.1.3",
            text: "Build CSAT collection flow",
            sub: [
              "Send WhatsApp message 5 minutes after call ends",
              "Interactive quick-reply buttons: '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'",
              "Store CSAT score in calls table, aggregate per business"
            ]
          },
          {
            id: "3.1.4",
            text: "Build follow-up scheduler",
            sub: [
              "If intent was LEAD and status is not CONVERTED: schedule follow-up call/message in 24hrs",
              "If booking was made: no follow-up (reminder handles it)",
              "Allow business owner to configure follow-up timing in dashboard"
            ]
          },
          {
            id: "3.1.5",
            text: "Build conversation transcript storage",
            sub: [
              "Store full transcripts in S3 as plain text (cost-efficient)",
              "Store pointer + metadata in call_transcripts table",
              "Make searchable from business dashboard"
            ]
          }
        ]
      },
      {
        title: "3.2 — Human Handoff",
        tasks: [
          {
            id: "3.2.1",
            text: "Define handoff trigger conditions",
            sub: [
              "Consumer says: 'talk to a human', 'real person', 'manager', 'complaint'",
              "AI confidence drops below threshold for 3 consecutive turns",
              "BANT score is high (hot lead) — route immediately to human",
              "Business configured to always handoff for certain intents"
            ]
          },
          {
            id: "3.2.2",
            text: "Build warm transfer flow for voice",
            sub: [
              "AI says: 'Let me connect you to our team, one moment...'",
              "Use Exotel conference call to bridge consumer + business owner's phone",
              "Pass context packet to business owner via SMS before pickup"
            ]
          },
          {
            id: "3.2.3",
            text: "Build context packet generator",
            sub: [
              "Summary: consumer name, intent, what was discussed, recommended next action",
              "Deliver via: SMS to business owner, notification in dashboard"
            ]
          },
          {
            id: "3.2.4",
            text: "Build human_agents table for businesses that have staff",
            sub: [
              "Round-robin assignment across available agents",
              "Availability toggle in dashboard"
            ]
          },
          {
            id: "3.2.5",
            text: "Build fallback when no human is available",
            sub: [
              "AI informs consumer and offers to: schedule a callback, leave a voicemail, or get WhatsApp follow-up"
            ]
          }
        ]
      },
      {
        title: "3.3 — Notification Hub",
        tasks: [
          {
            id: "3.3.1",
            text: "Build unified notification service (notifications-service)",
            sub: [
              "Single interface: send(to, channel, template, vars)",
              "Channels: WHATSAPP, SMS, EMAIL"
            ]
          },
          {
            id: "3.3.2",
            text: "Integrate MSG91 for SMS",
            sub: [
              "Use DLT-registered sender ID",
              "Template: booking confirmations, reminders, OTPs"
            ]
          },
          {
            id: "3.3.3",
            text: "Integrate Resend or SendGrid for email",
            sub: [
              "Transactional emails: booking confirmation, weekly lead report, invoice",
              "Build React Email templates for professional HTML emails"
            ]
          },
          {
            id: "3.3.4",
            text: "Build notification preference system",
            sub: [
              "Consumer can set preference: 'Only WhatsApp', 'No SMS'",
              "Respect opt-out flags (STOP keyword handling for SMS)"
            ]
          },
          {
            id: "3.3.5",
            text: "Build notification logs table",
            sub: [
              "Track: sent_at, channel, template, status (sent/delivered/failed), error_reason",
              "Display delivery status in business dashboard"
            ]
          }
        ]
      },
      {
        title: "3.4 — Memory & Context Store (Redis + Vector DB)",
        tasks: [
          {
            id: "3.4.1",
            text: "Set up ElastiCache Redis cluster (ap-south-1)",
            sub: [
              "Multi-AZ with automatic failover",
              "Separate Redis DBs: sessions (DB 0), queues (DB 1), cache (DB 2)"
            ]
          },
          {
            id: "3.4.2",
            text: "Design session schema in Redis",
            sub: [
              "Key: session:{channel}:{phone_number}",
              "Value: JSON with { consumer_id, business_id, current_agent, intent, conversation_history[], language, created_at }",
              "TTL: 30 minutes (reset on each message)"
            ]
          },
          {
            id: "3.4.3",
            text: "Set up pgvector extension for long-term memory",
            sub: [
              "Table: consumer_memory_embeddings — store key facts extracted from past conversations",
              "Table: business_kb_embeddings — knowledge base chunks",
              "Create IVFFlat index for fast ANN search"
            ]
          },
          {
            id: "3.4.4",
            text: "Build memory extraction job",
            sub: [
              "After each conversation: extract entities (name, preference, complaint, service interest)",
              "Embed and upsert into consumer_memory_embeddings",
              "Associate with consumer_id + business_id"
            ]
          },
          {
            id: "3.4.5",
            text: "Build memory retrieval on session start",
            sub: [
              "On new session: search consumer_memory_embeddings for this consumer",
              "Inject top-3 relevant memories into orchestrator system prompt"
            ]
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Dashboards & Analytics",
    duration: "Weeks 13–16",
    color: "#F59F00",
    icon: "⬡",
    sections: [
      {
        title: "4.1 — Business Dashboard (Next.js)",
        tasks: [
          {
            id: "4.1.1",
            text: "Build dashboard app in Next.js 14 App Router + Tailwind CSS",
            sub: [
              "Route structure: /dashboard, /dashboard/calls, /dashboard/bookings, /dashboard/leads, /dashboard/analytics, /dashboard/settings, /dashboard/knowledge-base"
            ]
          },
          {
            id: "4.1.2",
            text: "Build dashboard home — live metrics widget",
            sub: [
              "Today's calls, bookings, leads, CSAT score",
              "30-day revenue estimate",
              "Auto-refresh every 60 seconds via SWR"
            ]
          },
          {
            id: "4.1.3",
            text: "Build calls log table",
            sub: [
              "Columns: time, caller number, duration, intent, agent used, resolution, CSAT",
              "Click to expand: full transcript, call recording player, AI summary",
              "Filter by: date range, intent, resolution status"
            ]
          },
          {
            id: "4.1.4",
            text: "Build bookings calendar view",
            sub: [
              "Weekly/monthly calendar showing all bookings",
              "Click booking to see: consumer details, service, notes",
              "Drag to reschedule (updates slot in DB)"
            ]
          },
          {
            id: "4.1.5",
            text: "Build AI configuration panel",
            sub: [
              "Business name and persona (formal/casual/friendly)",
              "Toggle: which agents are enabled (booking, FAQ, lead capture)",
              "Language preference (auto-detect vs. fixed language)",
              "Custom greeting message",
              "Handoff phone number and conditions"
            ]
          },
          {
            id: "4.1.6",
            text: "Build knowledge base manager UI",
            sub: [
              "Upload FAQs via file or text paste",
              "View all documents with last-updated date",
              "View unanswered questions log",
              "Delete individual documents"
            ]
          },
          {
            id: "4.1.7",
            text: "Build business profile settings",
            sub: [
              "Edit: name, address, phone, services, hours",
              "Upload logo and photos",
              "Preview how listing appears in consumer search"
            ]
          }
        ]
      },
      {
        title: "4.2 — Analytics Engine",
        tasks: [
          {
            id: "4.2.1",
            text: "Set up ClickHouse (self-hosted on EC2 or ClickHouse Cloud) for analytics",
            sub: [
              "Create events table: (event_time, event_type, business_id, consumer_id, channel, metadata JSONB)",
              "Create materialized views for: daily_call_stats, weekly_conversion_rates, monthly_revenue"
            ]
          },
          {
            id: "4.2.2",
            text: "Build analytics event emitter",
            sub: [
              "Emit events from all services: call_started, call_ended, booking_created, lead_created, csat_received, handoff_triggered",
              "Batch insert to ClickHouse every 5 seconds via BullMQ job"
            ]
          },
          {
            id: "4.2.3",
            text: "Build analytics API endpoints",
            sub: [
              "GET /analytics/summary?period=7d|30d|90d",
              "GET /analytics/calls — breakdown by intent, channel, resolution",
              "GET /analytics/conversions — calls → bookings → revenue funnel",
              "GET /analytics/csat — average score over time"
            ]
          },
          {
            id: "4.2.4",
            text: "Build analytics charts in dashboard",
            sub: [
              "Call volume line chart (daily)",
              "Intent distribution donut chart",
              "Conversion funnel bar chart",
              "CSAT trend line",
              "Use Recharts library"
            ]
          },
          {
            id: "4.2.5",
            text: "Build weekly email report for business owners",
            sub: [
              "Auto-generated every Monday: key metrics, top FAQs asked, leads summary",
              "Use React Email + Resend"
            ]
          }
        ]
      },
      {
        title: "4.3 — CRM & Leads UI",
        tasks: [
          {
            id: "4.3.1",
            text: "Build leads Kanban board (columns: New, Contacted, Qualified, Converted, Lost)",
            sub: [
              "Drag cards between columns to update status",
              "Each card shows: consumer name, service interest, BANT score, last contact date"
            ]
          },
          {
            id: "4.3.2",
            text: "Build lead detail panel",
            sub: [
              "Full conversation history",
              "BANT score breakdown with explanations",
              "Estimated LTV",
              "One-click: call back, send WhatsApp, schedule follow-up"
            ]
          },
          {
            id: "4.3.3",
            text: "Build contacts list",
            sub: [
              "All unique consumers who interacted with this business",
              "Fields: name, phone, # interactions, last interaction, total spend"
            ]
          },
          {
            id: "4.3.4",
            text: "Build HubSpot sync for premium tier",
            sub: [
              "OAuth connect flow to HubSpot",
              "Sync: contacts, deals (leads), activities (calls)"
            ]
          }
        ]
      },
      {
        title: "4.4 — Consumer-Facing Web & App Search",
        tasks: [
          {
            id: "4.4.1",
            text: "Build consumer web app in Next.js with SSR for SEO",
            sub: [
              "Homepage: 'Find local businesses' search bar with location detection",
              "Search results page: list of businesses with distance, rating, open status",
              "Business profile page: services, reviews, photos, 'Call Now', 'Book Now', 'Chat on WhatsApp' CTAs"
            ]
          },
          {
            id: "4.4.2",
            text: "Implement geolocation on search",
            sub: [
              "Browser geolocation API for web",
              "IP-based fallback using ip-api.com",
              "Allow manual city/area search"
            ]
          },
          {
            id: "4.4.3",
            text: "Build SEO-optimised business profile pages",
            sub: [
              "URL: /b/{city}/{category}/{business-slug}",
              "Server-side render with business data",
              "Add JSON-LD schema markup for Google rich snippets",
              "Add meta tags: title, description, og:image"
            ]
          },
          {
            id: "4.4.4",
            text: "Submit sitemap to Google Search Console",
            sub: [
              "Auto-generate sitemap.xml from all business listings",
              "Update sitemap on new business onboarding"
            ]
          },
          {
            id: "4.4.5",
            text: "Build Google Maps integration",
            sub: [
              "Embed Google Maps on business profile pages",
              "Add 'Get Directions' button",
              "Set up Google Business Profile API for review sync (if available)"
            ]
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 5",
    title: "Monetisation & Launch",
    duration: "Weeks 17–20",
    color: "#20C997",
    icon: "⬡",
    sections: [
      {
        title: "5.1 — Billing & Subscription Engine (Razorpay)",
        tasks: [
          {
            id: "5.1.1",
            text: "Set up Razorpay account with KYC completion",
            sub: []
          },
          {
            id: "5.1.2",
            text: "Create subscription plans in Razorpay",
            sub: [
              "Starter: ₹999/month — 1 number, 200 AI minutes, basic analytics",
              "Growth: ₹2,999/month — 2 numbers, 1000 AI minutes, CRM, priority support",
              "Pro: ₹7,999/month — 5 numbers, unlimited, custom AI training, HubSpot sync"
            ]
          },
          {
            id: "5.1.3",
            text: "Build subscription checkout flow",
            sub: [
              "Plan selection page in dashboard onboarding",
              "Razorpay checkout integration",
              "Handle success/failure webhooks",
              "Activate subscription and provision resources on success"
            ]
          },
          {
            id: "5.1.4",
            text: "Build subscription management",
            sub: [
              "Upgrade/downgrade plan mid-cycle (prorate via Razorpay)",
              "Cancel subscription: retain data for 30 days, then archive",
              "Dunning: retry failed payments 3 times, then suspend account"
            ]
          },
          {
            id: "5.1.5",
            text: "Build usage metering for AI minutes",
            sub: [
              "Track call minutes per business per billing period",
              "Alert at 80% usage limit",
              "Auto-upgrade prompt at 100% or throttle to voicemail"
            ]
          },
          {
            id: "5.1.6",
            text: "Build invoice generation and download",
            sub: [
              "Monthly GST-compliant invoice PDF",
              "Auto-email invoice on billing date"
            ]
          }
        ]
      },
      {
        title: "5.2 — Pay-Per-Lead & Booking Commission",
        tasks: [
          {
            id: "5.2.1",
            text: "Build pay-per-lead billing logic",
            sub: [
              "Charge ₹50–200 per qualified lead (BANT score ≥ 6)",
              "Tiered pricing by category: dental/medical leads = ₹200, general = ₹50",
              "Charge via Razorpay route payment or wallet debit"
            ]
          },
          {
            id: "5.2.2",
            text: "Build business wallet system",
            sub: [
              "Pre-paid wallet for pay-per-lead customers",
              "Auto top-up when balance drops below threshold",
              "Pause lead delivery when wallet is empty"
            ]
          },
          {
            id: "5.2.3",
            text: "Build booking commission capture",
            sub: [
              "On booking confirmation: calculate 5–8% commission based on service price",
              "Log commission in transactions table",
              "Collect via monthly invoice for enterprise, immediate for SMB"
            ]
          },
          {
            id: "5.2.4",
            text: "Build revenue dashboard for Voxa internal team",
            sub: [
              "MRR, ARR, churn, ARPU by plan",
              "Lead delivery volume and revenue",
              "Commission earned per business"
            ]
          }
        ]
      },
      {
        title: "5.3 — Verified Badge & Onboarding Flow",
        tasks: [
          {
            id: "5.3.1",
            text: "Build business onboarding wizard",
            sub: [
              "Step 1: Basic info (name, category, phone, address)",
              "Step 2: Services and pricing",
              "Step 3: Business hours",
              "Step 4: Upload FAQs / knowledge base",
              "Step 5: Configure AI persona",
              "Step 6: Choose plan and pay"
            ]
          },
          {
            id: "5.3.2",
            text: "Build verified badge purchase and review flow",
            sub: [
              "₹999 one-time payment",
              "Triggers manual review queue for Voxa team",
              "Verification checklist: phone ownership confirmed, business registration doc, address match",
              "On approval: update is_verified = true, show blue checkmark on listing"
            ]
          },
          {
            id: "5.3.3",
            text: "Build business owner mobile onboarding (React Native or PWA)",
            sub: [
              "Lightweight onboarding optimised for mobile",
              "WhatsApp-based onboarding alternative for non-tech-savvy owners"
            ]
          }
        ]
      },
      {
        title: "5.4 — Google Maps / SEO Integration",
        tasks: [
          {
            id: "5.4.1",
            text: "Set up Google Maps Platform account and enable APIs",
            sub: [
              "Maps JavaScript API, Places API, Geocoding API",
              "Set API key restrictions (referrer-based for frontend, IP-based for backend)"
            ]
          },
          {
            id: "5.4.2",
            text: "Geocode all business addresses and store lat/lng on creation",
            sub: []
          },
          {
            id: "5.4.3",
            text: "Add Maps embed to consumer-facing business profiles",
            sub: []
          },
          {
            id: "5.4.4",
            text: "Build Google Business Profile integration for verified businesses",
            sub: [
              "Sync: business name, phone, hours, address to GBP",
              "Pull Google reviews into our review store"
            ]
          }
        ]
      },
      {
        title: "5.5 — Load Testing, Security Audit & Launch",
        tasks: [
          {
            id: "5.5.1",
            text: "Perform load testing with k6",
            sub: [
              "Target: 500 concurrent voice calls, 2000 concurrent WhatsApp sessions",
              "Test AI orchestrator throughput: target 100 RPS",
              "Test DB connection pool under load",
              "Identify bottlenecks and scale K8s pods accordingly"
            ]
          },
          {
            id: "5.5.2",
            text: "Security audit checklist",
            sub: [
              "OWASP Top 10 review",
              "Rate limiting on all public endpoints (100 req/min per IP)",
              "Input sanitisation on all user inputs",
              "SQL injection prevention (use parameterised queries only)",
              "Secrets rotation policy",
              "Enable WAF (AWS WAF) on ALB",
              "Enable CloudTrail for audit logs"
            ]
          },
          {
            id: "5.5.3",
            text: "Data compliance",
            sub: [
              "DPDP Act (India) compliance review — data minimisation, purpose limitation",
              "Privacy policy and terms of service pages",
              "Consumer data deletion API (right to erasure)",
              "Opt-out handling for marketing notifications"
            ]
          },
          {
            id: "5.5.4",
            text: "Final QA pass",
            sub: [
              "End-to-end test: consumer calls → AI answers → books appointment → receives WhatsApp confirmation → CSAT sent → lead visible in dashboard",
              "Test all 5 touchpoints: voice, WhatsApp, web, missed call, Google",
              "Test edge cases: simultaneous bookings for same slot, disconnected calls, invalid phone numbers"
            ]
          },
          {
            id: "5.5.5",
            text: "Production launch checklist",
            sub: [
              "Custom domain configured with Route53 + ACM SSL",
              "CloudFront CDN in front of Next.js frontend",
              "RDS Multi-AZ confirmed active",
              "Redis Multi-AZ confirmed active",
              "PagerDuty on-call rotation set up",
              "Status page (Instatus or Betterstack) live",
              "Rollback runbook documented"
            ]
          },
          {
            id: "5.5.6",
            text: "Pilot launch: onboard 10–20 businesses in one city (e.g. Bengaluru)",
            sub: [
              "Hand-hold first 5 businesses through onboarding",
              "Monitor call quality, AI accuracy, CSAT daily",
              "Iterate on AI prompts based on real call transcripts",
              "Collect testimonials for marketing"
            ]
          }
        ]
      }
    ]
  }
];

export default function VoxaRoadmap() {
  const [completedTasks, setCompletedTasks] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [activePhase, setActivePhase] = useState(null);

  const toggleTask = (id) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = roadmap.reduce((acc, phase) =>
    acc + phase.sections.reduce((a, s) => a + s.tasks.length, 0), 0);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progress = Math.round((completedCount / totalTasks) * 100);

  const getPhaseProgress = (phase) => {
    const ids = phase.sections.flatMap(s => s.tasks.map(t => t.id));
    const done = ids.filter(id => completedTasks[id]).length;
    return { done, total: ids.length, pct: Math.round((done / ids.length) * 100) };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#E8E8F0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        .phase-card { transition: all 0.25s ease; }
        .phase-card:hover { transform: translateY(-1px); }

        .task-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #1A1A28;
          cursor: pointer;
          transition: background 0.15s;
        }
        .task-row:hover { background: rgba(255,255,255,0.02); }
        .task-row:last-child { border-bottom: none; }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 1.5px solid #333;
          border-radius: 3px;
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .checkbox.done {
          border-color: currentColor;
          background: currentColor;
        }
        .checkmark {
          width: 10px;
          height: 10px;
          color: #0A0A0F;
        }

        .task-text { font-size: 13px; line-height: 1.6; flex: 1; }
        .task-text.done { text-decoration: line-through; opacity: 0.4; }

        .sub-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 6px;
          font-size: 12px;
          opacity: 0.6;
          line-height: 1.5;
        }
        .sub-dot { width: 4px; height: 4px; border-radius: 50%; background: #555; flex-shrink: 0; margin-top: 6px; }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          cursor: pointer;
          border-bottom: 1px solid #1A1A28;
          transition: background 0.15s;
        }
        .section-header:hover { background: rgba(255,255,255,0.03); }

        .progress-bar {
          height: 3px;
          background: #1A1A28;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .phase-tab {
          padding: 8px 16px;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          border: 1px solid #222;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #666;
        }
        .phase-tab:hover { border-color: #444; color: #999; }
        .phase-tab.active { color: #0A0A0F; border-color: transparent; }

        .task-id {
          font-size: 10px;
          opacity: 0.3;
          font-family: 'DM Mono', monospace;
          flex-shrink: 0;
          padding-top: 3px;
          min-width: 36px;
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1A1A28",
        padding: "32px 40px 24px",
        position: "sticky",
        top: 0,
        background: "#0A0A0F",
        zIndex: 10
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#444", marginBottom: 6 }}>TECHNICAL BUILD ROADMAP</div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#E8E8F0"
              }}>VOXA</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 500, fontFamily: "'Syne', sans-serif", color: "#E8E8F0" }}>{progress}<span style={{ fontSize: 14, opacity: 0.4 }}>%</span></div>
              <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>{completedCount} / {totalTasks} TASKS</div>
            </div>
          </div>

          {/* Master progress bar */}
          <div className="progress-bar" style={{ height: 4 }}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00C9A7, #845EF7, #FF6B6B)" }} />
          </div>

          {/* Phase tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              className={`phase-tab ${activePhase === null ? "active" : ""}`}
              style={activePhase === null ? { background: "#E8E8F0" } : {}}
              onClick={() => setActivePhase(null)}
            >ALL</button>
            {roadmap.map(p => {
              const { pct } = getPhaseProgress(p);
              return (
                <button
                  key={p.phase}
                  className={`phase-tab ${activePhase === p.phase ? "active" : ""}`}
                  style={activePhase === p.phase ? { background: p.color } : {}}
                  onClick={() => setActivePhase(activePhase === p.phase ? null : p.phase)}
                >
                  {p.phase} · {p.title.toUpperCase()} <span style={{ opacity: 0.6 }}>({pct}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 40px 80px" }}>
        {roadmap
          .filter(p => activePhase === null || p.phase === activePhase)
          .map((phase) => {
            const { done, total, pct } = getPhaseProgress(phase);
            return (
              <div key={phase.phase} className="phase-card" style={{ marginBottom: 40 }}>
                {/* Phase header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    border: `2px solid ${phase.color}`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: phase.color,
                    fontSize: 18
                  }}>{phase.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 11, color: phase.color, letterSpacing: "0.15em", fontWeight: 500 }}>{phase.phase}</span>
                      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{phase.title}</h2>
                      <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>{phase.duration}</span>
                    </div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1, height: 3 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: phase.color }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#444" }}>{done}/{total}</span>
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div style={{ border: "1px solid #1A1A28", borderRadius: 8, overflow: "hidden" }}>
                  {phase.sections.map((section, si) => {
                    const sKey = `${phase.phase}-${si}`;
                    const isOpen = expandedSections[sKey] !== false;
                    const sectionDone = section.tasks.filter(t => completedTasks[t.id]).length;

                    return (
                      <div key={si} style={{ borderBottom: si < phase.sections.length - 1 ? "1px solid #1A1A28" : "none" }}>
                        <div
                          className="section-header"
                          onClick={() => toggleSection(sKey)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 10, color: phase.color, letterSpacing: "0.1em", opacity: 0.8 }}>§</span>
                            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.01em" }}>{section.title}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 11, color: "#444" }}>{sectionDone}/{section.tasks.length}</span>
                            <span style={{ fontSize: 12, color: "#333", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>›</span>
                          </div>
                        </div>

                        {isOpen && (
                          <div style={{ padding: "4px 20px 12px" }}>
                            {section.tasks.map((task) => {
                              const isDone = completedTasks[task.id];
                              return (
                                <div
                                  key={task.id}
                                  className="task-row"
                                  onClick={() => toggleTask(task.id)}
                                >
                                  <div
                                    className={`checkbox ${isDone ? "done" : ""}`}
                                    style={{ color: phase.color }}
                                  >
                                    {isDone && (
                                      <svg className="checkmark" viewBox="0 0 10 10" fill="none">
                                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: 10 }}>
                                      <span className="task-id">{task.id}</span>
                                      <span className={`task-text ${isDone ? "done" : ""}`}>{task.text}</span>
                                    </div>
                                    {task.sub.length > 0 && !isDone && (
                                      <div style={{ marginLeft: 46, marginTop: 4 }}>
                                        {task.sub.map((s, i) => (
                                          <div key={i} className="sub-item">
                                            <span className="sub-dot" />
                                            <span>{s}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 40px",
        background: "rgba(10,10,15,0.95)",
        borderTop: "1px solid #1A1A28",
        display: "flex",
        justifyContent: "center",
        gap: 40,
        fontSize: 11,
        color: "#333",
        letterSpacing: "0.1em",
        backdropFilter: "blur(10px)"
      }}>
        <span>5 PHASES</span>
        <span>20 WEEKS</span>
        <span>{totalTasks} TASKS</span>
        <span>VOXA BUILD ROADMAP v1.0</span>
      </div>
    </div>
  );
}
