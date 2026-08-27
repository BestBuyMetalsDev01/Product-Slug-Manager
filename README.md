# Product Taxonomy Governance, Supabase Ingestion, & HubSpot Deal Creation

| Metric / Attribute | Details |
| :--- | :--- |
| **Project Sponsors** | Operations, Marketing & RevOps Leadership |
| **Key Stakeholders** | Purchasing / Procurement, Marketing, Full-Stack / Backend Engineering, CRM / SalesOps Admin |
| **Core Stack** | Purchasing Web Tool, Supabase (PostgreSQL + Edge Functions), Paradigm ERP, HubSpot CRM |

---

## 1. Executive Summary

This project centralizes product taxonomy governance, automated ERP provisioning, and web inquiry filtering into a unified Supabase backend architecture that directly drives automated Inquiry logging and Deal creation in HubSpot.

- **Taxonomy & ERP Provisioning**: When Purchasing enters a new product line into the Purchasing Web Tool, the system validates a unique URL slug, stores it as the subcategory in Supabase, and automatically provisions the subcategory in Paradigm ERP. Marketing is immediately alerted with deployment assets (URLs, tracking parameters, hidden form fields).
- **Inquiry Ingestion & Lead Routing**: When a prospective buyer submits an inquiry form on the website, the submission is ingested and filtered by Supabase Edge Functions (migrated from the legacy filter API). Once validated against the Supabase taxonomy, the engine automatically creates and associates both the Contact/Inquiry and the corresponding Sales Deal in HubSpot, tagged with the verified product subcategory for pipeline routing.

---

## 2. End-to-End System Architecture & Ingestion Flow

```mermaid
flowchart TD
    subgraph Taxonomy_Creation["1. Taxonomy Governance & ERP Provisioning"]
        A["Purchasing Web Tool<br/>(User enters product & auto-generates slug)"]
        B["Paradigm ERP<br/>(Subcategory created via API sync)"]
        C[("Supabase Database<br/>(Master Taxonomy Store & Unique Validation)")]
        D["Slack / Email Alert<br/>(Dispatched to Marketing w/ embed snippet)"]
        
        A -->|Provision subcategory| B
        A -->|Validate & store slug| C
        C -->|DB Trigger / Webhook| D
    end

    subgraph Inquiry_Ingestion["2. Lead Filtering & HubSpot Ingestion"]
        E["Web Product Inquiry Form<br/>(Hidden product_slug embedded)"]
        F["Supabase Edge Function<br/>(Validation, Deduplication & Spam Filter)"]
        G["HubSpot Contact / Inquiry<br/>(Created/Updated w/ Subcategory)"]
        H["HubSpot Sales Deal<br/>(Created in Pipeline & Stage Routed)"]
        
        D -.->|Marketing embeds asset| E
        E -->|POST Submission| F
        F -->|Upsert Contact| G
        F -->|Create Deal| H
        G <-->|Associate Record| H
    end
```

---

## 3. Step-by-Step Data Lifecycle

### Phase 1: Taxonomy Governance & Provisioning
1. **Entry & Slug Generation**: Purchasing staff creates a product subcategory in the Purchasing Web Tool. The tool generates a standardized, URL-safe slug (e.g., `standing-seam-24ga`).
2. **Taxonomy Validation & Storage**: Supabase validates uniqueness across existing categories/subcategories and commits the new record.
3. **ERP Synchronization**: An edge trigger communicates with Paradigm ERP API to provision the matching subcategory record and stores the ERP ID in Supabase.
4. **Marketing Dispatch**: Supabase dispatches a notification payload to Slack/Email containing:
   - Canonical Product Slug
   - Landing Page URL snippet
   - Form embed hidden field: `<input type="hidden" name="product_slug" value="standing-seam-24ga" />`

### Phase 2: Web Inquiry Ingestion & CRM Routing
1. **Form Submission**: Prospective buyer submits an inquiry on the website with form details and the hidden `product_slug`.
2. **Edge Function Filtering**:
   - **Validation**: Checks `product_slug` against Supabase master taxonomy table.
   - **Spam & Deduplication**: Validates honeypots, rate-limits, and checks recent duplicate submissions within a configurable window.
3. **HubSpot Contact Upsert**: Searches for existing Contact by email; creates new Contact or updates existing record with latest attribution properties.
4. **HubSpot Deal Creation & Association**:
   - Creates a new Deal under the appropriate Sales Pipeline.
   - Assigns Deal stage and pipeline routing rules based on the product subcategory.
   - Creates a bidirectional record association between Contact and Deal.

---

## 4. Database Schema (Supabase PostgreSQL)

```sql
-- 1. Product Categories & Subcategories (Master Taxonomy)
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    paradigm_erp_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Web Inquiries Log
CREATE TABLE inquiry_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_slug TEXT REFERENCES product_subcategories(slug),
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    message TEXT,
    raw_payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'spam', 'failed')),
    hubspot_contact_id TEXT,
    hubspot_deal_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Edge Functions & API Endpoints

| Endpoint / Function | Method | Description |
| :--- | :--- | :--- |
| `POST /functions/v1/validate-slug` | `POST` | Validates slug formatting and checks uniqueness before ERP provisioning. |
| `POST /functions/v1/sync-paradigm-erp` | `POST` | Provisions category in Paradigm ERP and updates the Supabase record. |
| `POST /functions/v1/ingest-inquiry` | `POST` | Public ingestion webhook for web form submissions; executes validation & spam checks. |
| `POST /functions/v1/hubspot-sync` | `POST` | Internal processor for upserting HubSpot Contacts and generating associated Deals. |

---

## 6. Environment Variables & Configuration

Create a `.env` file in the project root or configure in the Supabase Dashboard:

```ini
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Paradigm ERP
PARADIGM_API_BASE_URL="https://erp.yourcompany.com/api"
PARADIGM_API_KEY="your-paradigm-api-key"

# HubSpot CRM
HUBSPOT_ACCESS_TOKEN="pat-na1-your-hubspot-access-token"
HUBSPOT_DEFAULT_PIPELINE_ID="default"
HUBSPOT_DEFAULT_STAGE_ID="appointmentscheduled"

# Notifications
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
NOTIFICATION_EMAIL_RECIPIENT="marketing@yourcompany.com"
```

---

## 7. Local Development

```bash
# Clone the repository
git clone https://github.com/BestBuyMetalsDev01/Product-Slug-Manager.git
cd Product-Slug-Manager

# Start Supabase local development stack
supabase start

# Serve Edge Functions locally
supabase functions serve ingest-inquiry --env-file ./supabase/.env.local
```
