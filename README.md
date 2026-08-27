Product Taxonomy Governance, Supabase Ingestion, & HubSpot Deal CreationMetric / AttributeDetailsProject SponsorsOperations, Marketing & RevOps LeadershipTarget Timeline4 WeeksKey StakeholdersPurchasing / Procurement, Marketing, Full-Stack / Backend Engineering, CRM / SalesOps AdminCore StackPurchasing Web Tool, Supabase (PostgreSQL + Edge Functions), Paradigm ERP, HubSpot CRM1. Executive SummaryThis project centralizes product taxonomy governance, automated ERP provisioning, and web inquiry filtering into a unified Supabase backend architecture that directly drives automated Inquiry logging and Deal creation in HubSpot.When Purchasing enters a new product line into the Purchasing Web Tool, the system validates a unique URL slug, stores it as the subcategory in Supabase, and automatically provisions the subcategory in Paradigm ERP. Marketing is immediately alerted with deployment assets (URLs, tracking parameters, hidden form fields).When a prospective buyer submits an inquiry form on the website, the submission is ingested and filtered by Supabase Edge Functions (migrated from the legacy filter API). Once validated against the Supabase taxonomy, the engine automatically creates and associates both the Contact/Inquiry and the corresponding Sales Deal in HubSpot, tagged with the verified product subcategory for pipeline routing.2. End-to-End System Architecture & Ingestion Flowflowchart TD
    subgraph Taxonomy_Creation["1. Taxonomy Governance & ERP Provisioning"]
        A["Purchasing Web Tool<br/><i>(User enters product & auto-generates slug)</i>"]
        B["Paradigm ERP<br/><i>(Subcategory created via API sync)</i>"]
        C[("Supabase Database<br/><i>(Master Taxonomy Store & Unique Validation)</i>")]
        D["Slack / Email Alert<br/><i>(Dispatched to Marketing w/ embed snippet)</i>"]
        
        A -->|Provision subcategory| B
        A -->|Validate & store slug| C
        C -->|DB Trigger| D
    end

    subgraph Inquiry_Ingestion["2. Lead Filtering & HubSpot Ingestion"]
        E["Web Product Inquiry Form<br/><i>(Hidden product_slug embedded)</i>"]
        F["Supabase Edge Function<br/><i>(Validation, Deduplication & Spam Filter)</i>"]
        G["HubSpot Contact / Inquiry<br/><i>(Created/Updated w/ Subcategory)</i>"]
        H["HubSpot Sales Deal<br/><i>(Created in Pipeline & Stage Routed)</i>"]
        
        D -.->|Marketing embeds asset| E
        E -->|POST Submission| F
        F -->|Upsert Contact| G
        F -->|Create Deal| H
        G <-->|Associate Record| H
    end
