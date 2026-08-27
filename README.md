Product Taxonomy Governance, Supabase Ingestion, & HubSpot Deal Creation

| Metric / Attribute | Details |
| Project Sponsors | Operations, Marketing & RevOps Leadership |
| Target Timeline | 4 Weeks |
| Key Stakeholders | Purchasing / Procurement, Marketing, Full-Stack / Backend Engineering, CRM / SalesOps Admin |
| Core Stack | Purchasing Web Tool, Supabase (PostgreSQL + Edge Functions), Paradigm ERP, HubSpot CRM |

1. Executive Summary

This project centralizes product taxonomy governance, automated ERP provisioning, and web inquiry filtering into a unified Supabase backend architecture that directly drives automated Inquiry logging and Deal creation in HubSpot.

When Purchasing enters a new product line into the Purchasing Web Tool, the system validates a unique URL slug, stores it as the subcategory in Supabase, and automatically provisions the subcategory in Paradigm ERP. Marketing is immediately alerted with deployment assets (URLs, tracking parameters, hidden form fields).

When a prospective buyer submits an inquiry form on the website, the submission is ingested and filtered by Supabase Edge Functions (migrated from the legacy filter API). Once validated against the Supabase taxonomy, the engine automatically creates and associates both the Contact/Inquiry and the corresponding Sales Deal in HubSpot, tagged with the verified product subcategory for pipeline routing.

2. End-to-End System Architecture & Ingestion Flow

flowchart TD
    subgraph Taxonomy_Creation["1. Taxonomy Governance & ERP Provisioning"]
        A["Purchasing Web Tool<br/>(User enters product & auto-generates slug)"]
        B["Paradigm ERP<br/>(Subcategory created via API sync)"]
        C[("Supabase Database<br/>(Master Taxonomy Store & Unique Validation)")]
        D["Slack / Email Alert<br/>(Dispatched to Marketing w/ embed snippet)"]
        
        A -->|Provision subcategory| B
        A -->|Validate & store slug| C
        C -->|DB Trigger| D
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

```mermaid
flowchart TD
    subgraph Taxonomy_Creation["1. Taxonomy Governance & ERP Provisioning"]
        A["Purchasing Web Tool<br/>(User enters product & auto-generates slug)"]
        B["Paradigm ERP<br/>(Subcategory created via API sync)"]
        C[("Supabase Database<br/>(Master Taxonomy Store & Unique Validation)")]
        D["Slack / Email Alert<br/>(Dispatched to Marketing w/ embed snippet)"]
        
        A -->|Provision subcategory| B
        A -->|Validate & store slug| C
        C -->|DB Trigger| D
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
