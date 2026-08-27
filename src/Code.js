// --- CONFIGURATION ---
// Set HUBSPOT_ACCESS_TOKEN securely in Project Settings (gear icon) > Script Properties
const HUBSPOT_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('HUBSPOT_ACCESS_TOKEN');
const LOG_EMAIL = 'dev@bestbuymetals.com'; 
const NOTIFICATION_EMAIL = 'info@bestbuymetals.com, lead-archive@bestbuymetals.com'; // <-- Change this to the target email address
const SENDER_ALIAS = 'bluemail@bestbuymetals.com'; // <-- OPTIONAL: Enter a verified alias (e.g., 'sales@bestbuymetals.com'). Leave blank for default.
const NOTE_TO_INQUIRY_ASSOC_ID = null; // <-- OPTIONAL: Add your Note-to-Inquiry Association Type ID here (e.g., 228)


// --- PIPELINE CONFIGURATION ---
// Map each location to its specific HubSpot Pipeline ID and Initial Deal Stage ID.
const PIPELINE_MAP = {
  "cleveland": { pipeline: "878985997", dealstage: "1320561848" },
  "chattanooga": { pipeline: "878985997", dealstage: "1320561848" }, 
  "dalton": { pipeline: "878985997", dealstage: "1320561848" },
  "asheville": { pipeline: "878985997", dealstage: "1320561848" },
  "greenville": { pipeline: "878985997", dealstage: "1320561848" },
  "charlotte": { pipeline: "878985997", dealstage: "1320561848" },
  "knoxville": { pipeline: "878985997", dealstage: "1320561848" },
  "national": { pipeline: "878985997", dealstage: "1320561848" } // Fallback/National
};

// --- ZIP ROUTING CONFIGURATION ---
const ZIP_API_URL = "https://script.google.com/macros/s/AKfycbzzjh4-kfdtpwBaYisGZP7ZLlmFPnH57Vo90Vn_9X_ggfWZGAO7xWU7dbtBP2h_OEDTiQ/exec";

// ==========================================
// USER INTERFACE & BACKEND HANDLERS
// ==========================================

// 1. Serve the React UI when you visit the Web App URL
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Store Matrix Configurator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 2. Load the current config into the UI
function getConfigFromProperties() {
  const configStr = PropertiesService.getScriptProperties().getProperty('STORE_MATRIX_CONFIG');
  
  if (configStr) {
    return JSON.parse(configStr);
  } else {
    // If empty (first time running), return the huge fallback lists to pre-populate the UI
    return {
      slugList: ["sentry-shingle", "kasselwood-shake", "kasselwood-slate", "arrowline-enhanced-slate", "cee-purlin", "zee-purlin", "channel", "hat-channel", "angle", "eave-strut", "stonewood-shake", "arrowline-enhanced-shake", "arrowline-slate", "matterhorn-shake", "matterhorn-tile", "matterhorn-slate", "cleo-tile", "sapphire-european-tile", "victorian-shingle", "central-loc", "sentry-slate", "image-ii", "vertical-seam", "coastal-wave-tile", "cedar-creek-shake", "north-ridge-slate", "decra-villa", "decra-tile", "decra-shingle-xd", "decra-shake-xd", "decra-shake", "2-5-corrugated", "1-25-corrugated", "7-8-corrugated", "arrowline-shake", "sentry-shake", "edco-board-batten", "edco-traditional-lap-siding", "edco-dutchlap-siding", "barrel-vault", "pacific-tile", "cottage-shingle", "5v-crimp", "pine-crest-shake", "granite-ridge", "tuff-rib", "apex-panel", "custom-metal-panels", "craftsman-plank", "steel-soffit", "stile-spanish-tile", "r-panel", "snap-seam", "craftsman-board-batten", "craftsman-lap", "3-4-corrugated", "wood-screws", "self-drilling-screws", "pancake-screws", "pipe-boots", "closures", "ridge-vent-material", "snow-guards", "chimney-caps", "cupolas", "scupper-boxes", "parapet-caps", "custom-flashing", "5-k-gutter", "6-k-gutter", "commercial-gutters", "palisade-synthetic-underlayment", "roof-commander-underlayment", "30-lb-felt-underlayment", "ice-water-shield-underlayment", "fiberglass-backed-insulation", "double-bubble-insulation", "fan-fold-insulation", "cut-and-shear", "bend-and-hem", "punch-and-fasten", "roof-safety", "1x4-lathing-strips", "6x6-posts", "8x8-posts", "2x6-boards", "steel-tubing", "piano-shingle", "titan-loc-150", "titan-loc-100", "steel-trusses", "pinnacle-board-batten-siding", "endura-seam", "bbm-board-batten"],
      storeData: {
        "cleveland": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "chattanooga": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "dalton": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "asheville": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","central-loc","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","edco-traditional-lap","edco-dutchlap","hat-channel","steel-tubing","cee-purlin","zee-purlin","eave-strut","channel","angle","american-pole-barn","steel-truss","stile-spanish-tile","decra-villa","cleo-tile","barrel-vault","pacific-tile","decra-tile","victorian-shingle","sentry-shingle","decra-shingle-xd","cottage-shingle","granite-ridge","piano-shingle","sentry-shake","kasselwood-shake","arrowline-shake","arrowline-enhanced-shake","decra-shake-xd","stonewood-shake","pine-crest-shake","decra-shake","sentry-slate","kasselwood-slate","arrowline-slate","arrowline-enhanced-slate","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "greenville": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "charlotte": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "knoxville": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","hat-channel","steel-tubing","american-pole-barn","steel-truss","stile-spanish-tile","decra-villa","barrel-vault","pacific-tile","decra-shingle-xd","cottage-shingle","granite-ridge","arrowline-shake","arrowline-enhanced-shake","decra-shake-xd","pine-crest-shake","arrowline-slate","arrowline-enhanced-slate","apex-panel","steel-trusses","craftsman-steel-board-and-batten"],
        "national": ["tuff-rib","r-panel","5v-crimp","2-5-corrugated","1-25-corrugated","7-8-corrugated","3-4-corrugated","titan-loc-100","titan-loc-150","endura-seam","snap-seam","image-ii","snap-loc-150","vertical-seam","central-loc","bbm-board-batten","flush-loc","steel-soffit","craftsman-board-batten","craftsman-lap","edco-board-batten","edco-traditional-lap","edco-dutchlap","hat-channel","steel-tubing","cee-purlin","zee-purlin","eave-strut","channel","angle","american-pole-barn","steel-truss","stile-spanish-tile","decra-villa","cleo-tile","barrel-vault","pacific-tile","decra-tile","victorian-shingle","sentry-shingle","decra-shingle-xd","cottage-shingle","granite-ridge","piano-shingle","sentry-shake","kasselwood-shake","arrowline-shake","arrowline-enhanced-shake","decra-shake-xd","stonewood-shake","pine-crest-shake","decra-shake","sentry-slate","kasselwood-slate","arrowline-slate","arrowline-enhanced-slate","apex-panel","steel-trusses","craftsman-steel-board-and-batten"]
      }
    };
  }
}

// 3. Receive Save Action from UI
function saveConfigToProperties(configData) {
  PropertiesService.getScriptProperties().setProperty('STORE_MATRIX_CONFIG', JSON.stringify(configData));
  return { status: 'success' };
}


// ==========================================
// PRIMARY WEBHOOK HANDLER
// ==========================================
function doPost(e) {
  let logBody = "HubSpot Webhook Execution Log:\n\n";

  try {
    const requestData = JSON.parse(e.postData.contents);
    
    // Inputs from HubSpot Webhook for CRM Routing
    const urlToScan = (requestData.url_input || "").toLowerCase();
    let locationInput = (requestData.location_name || "").toLowerCase().trim();
    const recordId = requestData.hs_object_id; // The Enrolled Contact ID
    
    // Inputs from HubSpot Webhook strictly for the Email Notification
    const firstName = requestData.firstname || "Not Provided";
    const lastName = requestData.lastname || "Not Provided";
    const email = requestData.email || "Not Provided";
    
    // Format the phone number to (XXX) XXX-XXXX if it is a standard US number
    const rawPhone = requestData.phone || requestData.mobilephone || requestData.mobile_phone || requestData.phone_number__form_ || "";
    let phone = "Not Provided";
    if (rawPhone) {
      const cleaned = ('' + rawPhone).replace(/\D/g, '');
      const match = cleaned.match(/^(?:1)?(\d{3})(\d{3})(\d{4})$/);
      phone = match ? '(' + match[1] + ') ' + match[2] + '-' + match[3] : rawPhone;
    }

    // Capture Zip Code, handling 9-digit formats (ignoring the +4 extension)
    const rawZip = requestData.zip || "Not Provided";
    let postalCode = "Not Provided";
    if (rawZip !== "Not Provided") {
      let zipString = String(rawZip).trim();
      
      // If HubSpot treated the zip as a number and stripped leading zeros, restore them
      if (/^\d{3,4}$/.test(zipString)) {
        zipString = zipString.padStart(5, '0');
      }
      
      const zipMatch = zipString.match(/^\d{5}/);
      postalCode = zipMatch ? zipMatch[0] : zipString;
    }
    
    const floatingMessage = requestData.floating_contact_form_message || "Not Provided";
    const lastPageSeen = requestData.last_page_seen || "Not Provided";
    
    // --- Contractor, Site Address, and Measurement Method ---
    const contractor = requestData.is_a_contractor || "Not Provided";
    
    // Map internal HubSpot dropdown IDs to readable text
    const measurementMap = {
      "eZ44Uy5eUq5jiG6NREYmY": "Drawing(s)",
      "HghiuGEdHDtlvwuo8-l-D": "Satellite Image"
    };
    const rawMeasurement = requestData.measurement_method;
    const measurementMethod = rawMeasurement ? (measurementMap[rawMeasurement] || rawMeasurement) : "Not Provided";
    
    // Site Address (5 properties)
    const siteStreet1 = requestData.site_address_line_1 || "Not Provided";
    const siteStreet2 = requestData.site_address_line_2 || ""; // Optional, will hide if empty
    const siteCity = requestData.site_address_city || "Not Provided";
    const siteState = requestData.site_address_state || "Not Provided";
    const siteZip = requestData.site_address_zip_code || "Not Provided";

    // Extract attachment links
    const rawAttachmentString = requestData.attachment_link || requestData.attachment || requestData.file_upload || requestData.request_pricing_attachment || "Not Provided";
    const attachmentLinks = rawAttachmentString !== "Not Provided" ? rawAttachmentString.split(';').map(l => l.trim()).filter(l => l.length > 0) : [];

    logBody += `--- INCOMING DATA ---\nContact ID: ${recordId}\nURL: ${urlToScan}\nLocation: ${locationInput || "None Provided"}\nZip Code: ${postalCode}\nAttachments Found: ${attachmentLinks.length}\n\n`;

    if (!recordId) {
      throw new Error("Missing hs_object_id (Contact ID)");
    }

    // ==========================================
    // STEP 0: DETERMINE LOCATION VIA ZIP API
    // ==========================================
    let driveData = null;
    if (!locationInput && postalCode !== "Not Provided") {
      logBody += `--- LOCATION ROUTING ---\nLocation missing from form. Calculating closest store for zip: ${postalCode}...\n`;
      driveData = getDistanceDataFromZip(postalCode);
      
      if (driveData && driveData.bbm_location) {
        locationInput = driveData.bbm_location.toLowerCase();
        logBody += `Calculated BBM Location: ${driveData.bbm_location} (${driveData.bbm_location_minutes} mins)\n\n`;
      } else {
        locationInput = "undefined"; // Undefined instead of National
        logBody += `Maps calculation failed or no results. Defaulting to 'undefined'.\n\n`;
      }
    } else if (!locationInput) {
      locationInput = "undefined"; // Undefined instead of National
      logBody += `--- LOCATION ROUTING ---\nNo location or zip code provided. Defaulting to 'undefined'.\n\n`;
    }

    // ==========================================
    // STEP 1 & 2: DYNAMIC CONFIG FROM PROPERTIES 
    // ==========================================
    const fallbackConfig = getConfigFromProperties();
    const slugList = fallbackConfig.slugList;
    const storeData = fallbackConfig.storeData;

    slugList.sort((a, b) => b.length - a.length);

    let foundProduct = "";
    for (const slug of slugList) {
      if (urlToScan.includes(slug.toLowerCase())) {
        foundProduct = slug;
        break; 
      }
    }

    let isAvailable = "False";
    if (foundProduct && storeData[locationInput]) {
      if (storeData[locationInput].includes(foundProduct)) {
        isAvailable = "True";
      }
    }

    // Determine the "Product Location" for the email based on availability and undefined handling
    let productLocationRaw;
    if (isAvailable === "True") {
      productLocationRaw = locationInput;
    } else if (locationInput === "national") {
      // If inherently sent to National, it stays National
      productLocationRaw = "national";
    } else {
      // If product unavailable/missing, mark as "Undefined" instead of defaulting to National
      productLocationRaw = "undefined"; 
    }
    
    let formattedProductLocation = productLocationRaw.charAt(0).toUpperCase() + productLocationRaw.slice(1);

    logBody += `--- MATCHED DATA ---\nProduct Slug: ${foundProduct}\nIs Available: ${isAvailable}\nRouted Location: ${formattedProductLocation}\n\n`;

    const baseOptions = {
      contentType: 'application/json',
      headers: { 
        'Authorization': 'Bearer ' + HUBSPOT_ACCESS_TOKEN,
        'Accept-Encoding': 'gzip' // Compress responses to save Apps Script Bandwidth quota
      },
      muteHttpExceptions: true
    };

    logBody += `--- API RESPONSES ---\n`;

    // Wrap CRM updates in a try-catch so network/quota failures don't stop the email from sending
    try {
      // --- STEP 3: UPDATE HUBSPOT CONTACT ---
      const updateContactUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${recordId}`;
      
      // ONLY sending the final selected location and product slug. 
      // No distance or drive time metrics are passed back to HubSpot.
      const contactProps = {
        "product_slug": foundProduct,
        "current_bbm_location": locationInput
      };

      const contactPayload = { properties: contactProps };
      
      const contactRes = UrlFetchApp.fetch(updateContactUrl, { 
        ...baseOptions, 
        method: 'patch', 
        payload: JSON.stringify(contactPayload) 
      });
      
      logBody += `Contact Update [HTTP ${contactRes.getResponseCode()}]\n`;
      
      if (contactRes.getResponseCode() === 400) {
        logBody += `[WARNING] HubSpot rejected the contact update! Please ensure '${foundProduct}' is added as a valid Dropdown option for the 'product_slug' property in your HubSpot settings.\n\n`;
      }

      // --- STEP 3.5: CHECK FOR RECENT DEALS (24H THROTTLE) ---
      const now = new Date().getTime();
      const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
      let shouldCreateDeal = true;
      let dealId = null;

      try {
        const assocUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${recordId}/associations/deals`;
        const assocRes = UrlFetchApp.fetch(assocUrl, { ...baseOptions, method: 'get' });
        const assocData = JSON.parse(assocRes.getContentText());
        const associatedDealIds = (assocData.results || []).map(r => r.id);

        if (associatedDealIds.length > 0) {
          const batchReadUrl = `https://api.hubapi.com/crm/v3/objects/deals/batch/read`;
          const batchPayload = {
            inputs: associatedDealIds.map(id => ({ id })),
            properties: ["createdate"]
          };
          const batchRes = UrlFetchApp.fetch(batchReadUrl, {
            ...baseOptions,
            method: 'post',
            payload: JSON.stringify(batchPayload)
          });
          const batchData = JSON.parse(batchRes.getContentText());

          for (const deal of (batchData.results || [])) {
            const createTime = new Date(deal.properties.createdate).getTime();
            if (createTime > twentyFourHoursAgo) {
              shouldCreateDeal = false;
              dealId = deal.id; 
              logBody += `Recent Deal Found: Deal ID ${deal.id} created at ${deal.properties.createdate}. Associating new Inquiry with THIS existing deal.\n\n`;
              break;
            }
          }
        }
      } catch (e) {
        logBody += `Warning: Error checking for recent deals: ${e.toString()}\n\n`;
      }

      // --- STEP 4: CREATE A DEAL ---
      if (shouldCreateDeal) {
        // Route the pipeline based on the fulfilling store (productLocationRaw handles availability overrides)
        const routingData = PIPELINE_MAP[productLocationRaw] || PIPELINE_MAP["national"];
        
        const dealPayload = {
          properties: {
            "dealname": `New Inquiry - ${foundProduct || 'Unknown Product'}`,
            "pipeline": routingData.pipeline,
            "dealstage": routingData.dealstage 
          }
        };

        const dealResponse = UrlFetchApp.fetch('https://api.hubapi.com/crm/v3/objects/deals', {
          ...baseOptions,
          method: 'post',
          payload: JSON.stringify(dealPayload)
        });
        logBody += `Deal Creation [HTTP ${dealResponse.getResponseCode()}] (Pipeline: ${routingData.pipeline}):\n${dealResponse.getContentText()}\n\n`;
        const dealData = JSON.parse(dealResponse.getContentText());
        dealId = dealData.id;
      }

      // --- STEP 5: CREATE AN INQUIRY (Custom Object) ---
      const inquiryPayload = {
        properties: {
          "inquiry_name": `New Inquiry - ${foundProduct || 'Unknown Product'}`,
          "bbm_location": locationInput,
          "product_slug": foundProduct
        }
      };

      const inquiryResponse = UrlFetchApp.fetch('https://api.hubapi.com/crm/v3/objects/2-59384707', {
        ...baseOptions,
        method: 'post',
        payload: JSON.stringify(inquiryPayload)
      });
      logBody += `Inquiry Creation [HTTP ${inquiryResponse.getResponseCode()}]:\n${inquiryResponse.getContentText()}\n\n`;
      const inquiryData = JSON.parse(inquiryResponse.getContentText());
      const inquiryId = inquiryData.id;

      // --- STEP 6: ASSOCIATE RECORDS ---
      if (dealId && recordId) {
        const a1 = UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/deals/contacts/batch/create`, {
          ...baseOptions, 
          method: 'post',
          payload: JSON.stringify({
            inputs: [{
              from: { id: dealId },
              to: { id: recordId },
              types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }]
            }]
          })
        });
        logBody += `Assoc Deal->Contact [HTTP ${a1.getResponseCode()}]\n`;
      }

      if (inquiryId && recordId) {
        const a2 = UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/2-59384707/contacts/batch/create`, {
          ...baseOptions, 
          method: 'post',
          payload: JSON.stringify({
            inputs: [{
              from: { id: inquiryId },
              to: { id: recordId },
              types: [{ associationCategory: "USER_DEFINED", associationTypeId: 39 }]
            }]
          })
        });
        logBody += `Assoc Inquiry->Contact [HTTP ${a2.getResponseCode()}]\n`;
      }

      if (inquiryId && dealId) {
        const a3 = UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/2-59384707/deals/batch/create`, {
          ...baseOptions, 
          method: 'post',
          payload: JSON.stringify({
            inputs: [{
              from: { id: inquiryId },
              to: { id: dealId },
              types: [{ associationCategory: "USER_DEFINED", associationTypeId: 37 }]
            }]
          })
        });
        logBody += `Assoc Inquiry->Deal [HTTP ${a3.getResponseCode()}]\n`;
      }

      // --- STEP 7: EXTRACT ATTACHMENTS AND CREATE NOTE ---
      if (attachmentLinks.length > 0) {
        try {
          let fileIds = [];
          let noteBodyLinks = [];

          attachmentLinks.forEach((link, index) => {
            if (link.includes('signed-url-redirect/')) {
              let fileId = link.split('signed-url-redirect/')[1].split('?')[0];
              fileIds.push(fileId);
              noteBodyLinks.push(`Attachment ${index + 1}: <a href="${link}" target="_blank">View File</a>`);
              logBody += `Extracted File ID: ${fileId}\n`;
            } else {
              noteBodyLinks.push(`Attachment ${index + 1}: <a href="${link}" target="_blank">${link}</a>`);
              logBody += `Could not extract File ID for attachment ${index + 1}, defaulting to URL.\n`;
            }
          });

          const noteProperties = {
            "hs_note_body": `Customer provided ${attachmentLinks.length} attachment(s) from form submission:<br><br>${noteBodyLinks.join('<br>')}`,
            "hs_timestamp": new Date().toISOString()
          };

          if (fileIds.length > 0) {
            noteProperties["hs_attachment_ids"] = fileIds.join(';');
          }

          const notePayload = { properties: noteProperties };

          const noteResponse = UrlFetchApp.fetch('https://api.hubapi.com/crm/v3/objects/notes', {
            ...baseOptions, method: 'post', payload: JSON.stringify(notePayload)
          });
          
          if (noteResponse.getResponseCode() === 201) {
            const noteId = JSON.parse(noteResponse.getContentText()).id;
            logBody += `Attachment Note Created [ID: ${noteId}]\n`;

            if (noteId && recordId) {
              UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/notes/contacts/batch/create`, {
                ...baseOptions, method: 'post',
                payload: JSON.stringify({ inputs: [{ from: { id: noteId }, to: { id: recordId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }] })
              });
              logBody += `Assoc Note->Contact\n`;
            }

            if (noteId && dealId) {
              UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/notes/deals/batch/create`, {
                ...baseOptions, method: 'post',
                payload: JSON.stringify({ inputs: [{ from: { id: noteId }, to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 214 }] }] })
              });
              logBody += `Assoc Note->Deal\n`;
            }

            if (noteId && inquiryId && NOTE_TO_INQUIRY_ASSOC_ID) {
              UrlFetchApp.fetch(`https://api.hubapi.com/crm/v4/associations/notes/2-59384707/batch/create`, {
                ...baseOptions, method: 'post',
                payload: JSON.stringify({ inputs: [{ from: { id: noteId }, to: { id: inquiryId }, types: [{ associationCategory: "USER_DEFINED", associationTypeId: NOTE_TO_INQUIRY_ASSOC_ID }] }] })
              });
              logBody += `Assoc Note->Inquiry\n`;
            } else if (noteId && inquiryId) {
              logBody += `Skipped Note->Inquiry Assoc (Missing NOTE_TO_INQUIRY_ASSOC_ID in script config)\n`;
            }
          } else {
             logBody += `Failed to create Note. HTTP ${noteResponse.getResponseCode()}: ${noteResponse.getContentText()}\n`;
          }
        } catch (e) {
          logBody += `Warning: Error creating/associating attachment note: ${e.toString()}\n`;
        }
      }

      // --- STEP 7.5: CLEAR SITE ADDRESS & ATTACHMENT FIELDS ON CONTACT ---
      try {
        Utilities.sleep(3000); // Prevent Race Condition

        const clearPayload = {
          properties: {
            "request_pricing_attachment": "",
            "measurement_method": "",
            "site_address_line_1": "",
            "site_address_line_2": "",
            "site_address_city": "",
            "site_address_state": "",
            "site_address_zip_code": ""
          }
        };
        
        const clearResponse = UrlFetchApp.fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${recordId}`, {
          ...baseOptions,
          method: 'patch',
          payload: JSON.stringify(clearPayload)
        });
        logBody += `Cleared properties 'request_pricing_attachment', 'measurement_method', and site address fields on Contact [HTTP ${clearResponse.getResponseCode()}]\n`;
      } catch (e) {
        logBody += `Warning: Could not clear properties on Contact: ${e.toString()}\n`;
      }

    } catch (crmOrRoutingError) {
      logBody += `\n\n--- CRM / ROUTING ERROR ---\nFailed to complete CRM updates or routing: ${crmOrRoutingError.toString()}\nProceeding to send email notification...\n\n`;
    }

    // --- EMAIL STYLING CONSTANTS ---
    const tableStyle = "border-collapse: collapse; width: 100%; max-width: 600px; font-family: Arial, sans-serif; font-size: 14px;";
    const thStyle = "border: 1px solid #dddddd; text-align: left; padding: 10px; background-color: #666666; color: #ffffff; font-weight: bold;";
    const tdLabelStyle = "border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; width: 35%; background-color: #f9f9f9;";
    const tdValueStyle = "border: 1px solid #dddddd; text-align: left; padding: 8px;";

    // --- STEP 8: BUILD DISTANCE MATRIX EMAIL BLOCK ---
    let verificationHtmlRows = "";
    let distanceMatrixText = "";
    
    if (driveData && driveData.raw_api_data) {
      const d = driveData.raw_api_data;
      const cty = d["City"] || d["city"] || "";
      const st = d["State"] || d["state"] || "";
      const cnty = d["County"] || d["county"] || "";
      
      let locStr = "";
      if (cty && st) locStr = `${cty}, ${st} ${postalCode}, USA`;
      let countyStr = cnty ? `${cnty}${st ? ', ' + st : ''}` : "";
      
      let mText = "";
      
      if (locStr) {
          verificationHtmlRows += `<tr><td style="${tdLabelStyle}">Location</td><td style="${tdValueStyle}">${locStr}</td></tr>`;
          mText += `Location: ${locStr}\n`;
      }
      if (countyStr) {
          verificationHtmlRows += `<tr><td style="${tdLabelStyle}">County</td><td style="${tdValueStyle}">${countyStr}</td></tr>`;
          mText += `County: ${countyStr}\n`;
      }
      if (locStr || countyStr) {
          mText += `\n`;
      }
      
      const storeNames = ["Cleveland", "Knoxville", "Chattanooga", "Dalton", "Asheville", "Greenville", "Charlotte"];
      let matrixItems = [];
      
      storeNames.forEach(store => {
          let mins = d[`${store} (Minutes)`];
          let miles = d[`${store} (Miles)`];
          
          if (mins !== undefined && mins !== null && mins !== "") {
              let m = parseInt(mins, 10);
              let formattedTime = "";
              if (!isNaN(m)) {
                 let h = Math.floor(m / 60);
                 let remM = m % 60;
                 if (h > 0) formattedTime += h + (h === 1 ? " hour " : " hours ");
                 if (remM > 0 || h === 0) formattedTime += remM + " mins";
              } else {
                 formattedTime = mins + " mins";
              }
              
              let milesStr = "";
              if (miles !== undefined && miles !== null && miles !== "") {
                  let milesVal = miles.toString().replace(/mi(les)?/ig, "").trim();
                  milesStr = `, ${milesVal} mi`;
              }
              
              matrixItems.push({
                  store: store,
                  rawMins: m,
                  timeAndMiles: `${formattedTime.trim()}${milesStr}`
              });
          }
      });
      
      matrixItems.sort((a, b) => a.rawMins - b.rawMins);
      
      matrixItems.forEach(item => {
          verificationHtmlRows += `<tr><td style="${tdLabelStyle}">${item.store}</td><td style="${tdValueStyle}">${item.timeAndMiles}</td></tr>`;
          mText += `${item.store.toLowerCase()}: ${item.timeAndMiles}\n`;
      });
      
      if (verificationHtmlRows) {
          distanceMatrixText = `\n--- Location Verification ---\n${mText}`;
      }
    }


    // --- STEP 9: SEND FORMATTED HTML EMAIL ---
    if (NOTIFICATION_EMAIL) {
      const notificationSubject = `${formattedProductLocation} - ${foundProduct || 'General Lead'} - ${firstName} ${lastName} - ${postalCode} - Bluemail`;
      
      // Helper function to check if a value is worth displaying
      const hasValue = (val) => val && val !== "Not Provided" && val.toString().trim() !== "";

      // Build Customer Details rows dynamically
      let customerDetailsHtml = "";
      if (hasValue(firstName)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">First Name</td><td style="${tdValueStyle}">${firstName}</td></tr>`;
      if (hasValue(lastName)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Last Name</td><td style="${tdValueStyle}">${lastName}</td></tr>`;
      if (hasValue(email)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Email</td><td style="${tdValueStyle}"><a href="mailto:${email}">${email}</a></td></tr>`;
      if (hasValue(phone)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Phone Number</td><td style="${tdValueStyle}">${phone}</td></tr>`;
      if (hasValue(postalCode)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Postal Code</td><td style="${tdValueStyle}">${postalCode}</td></tr>`;

      // Build Inquiry & Project Details rows dynamically
      let projectDetailsHtml = "";
      if (hasValue(locationInput)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Nearest BBM Location</td><td style="${tdValueStyle}">${locationInput}</td></tr>`;
      if (hasValue(foundProduct)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Initial Product Slug</td><td style="${tdValueStyle}">${foundProduct}</td></tr>`;
      if (hasValue(formattedProductLocation)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Product Location</td><td style="${tdValueStyle}">${formattedProductLocation}</td></tr>`;

      const hasSiteAddress = hasValue(siteStreet1) || hasValue(siteCity) || hasValue(siteState) || hasValue(siteZip);
      if (hasSiteAddress) {
        projectDetailsHtml += `
          <tr>
            <td style="${tdLabelStyle}">Site Address</td>
            <td style="${tdValueStyle}">
              ${hasValue(siteStreet1) ? siteStreet1 + '<br>' : ''}
              ${hasValue(siteStreet2) ? siteStreet2 + '<br>' : ''}
              ${hasValue(siteCity) ? siteCity + ', ' : ''}${hasValue(siteState) ? siteState : ''} ${hasValue(siteZip) ? siteZip : ''}
            </td>
          </tr>`;
      }

      if (hasValue(measurementMethod)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Measurement Method</td><td style="${tdValueStyle}">${measurementMethod}</td></tr>`;
      if (hasValue(lastPageSeen)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Last Page Seen</td><td style="${tdValueStyle}"><a href="${lastPageSeen}">${lastPageSeen}</a></td></tr>`;
      
      if (attachmentLinks.length > 0) {
        projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Attachment(s)</td><td style="${tdValueStyle}">${attachmentLinks.map((link, i) => `<a href="${link}" target="_blank">View Attachment ${i + 1}</a>`).join('<br>')}</td></tr>`;
      }

      if (hasValue(contractor)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Is Contractor?</td><td style="${tdValueStyle}">${contractor}</td></tr>`;

      // Build Customer Message section dynamically
      let messageHtml = "";
      if (hasValue(floatingMessage)) {
        messageHtml = `
          <tr><th colspan="2" style="${thStyle}">Customer Message</th></tr>
          <tr><td colspan="2" style="${tdValueStyle}"><em>"${floatingMessage}"</em></td></tr>
        `;
      }
      
      let verificationSectionHtml = "";
      if (verificationHtmlRows) {
        verificationSectionHtml = `
          <tr><th colspan="2" style="${thStyle}">Location Verification</th></tr>
          ${verificationHtmlRows}
        `;
      }

      const notificationHtml = `
        <table style="${tableStyle}">
          <tr><th colspan="2" style="${thStyle}">Customer Details</th></tr>
          ${customerDetailsHtml}
          <tr><th colspan="2" style="${thStyle}">Inquiry & Project Details</th></tr>
          ${projectDetailsHtml}
          ${messageHtml}
          ${verificationSectionHtml}
        </table>
      `;

      // Build Plain Text fallback dynamically
      const nameStr = [firstName, lastName].filter(n => hasValue(n)).join(' ');
      let plainTextLines = [`New Inquiry${nameStr ? ' from ' + nameStr : ''}.`];
      
      if (hasValue(email)) plainTextLines.push(`Email: ${email}`);
      if (hasValue(phone)) plainTextLines.push(`Phone: ${phone}`);
      if (hasValue(postalCode)) plainTextLines.push(`Zip: ${postalCode}`);
      if (hasSiteAddress) plainTextLines.push(`Site Address: ${[siteStreet1, siteStreet2, `${hasValue(siteCity) ? siteCity : ''}${hasValue(siteState) || hasValue(siteZip) ? ',' : ''} ${hasValue(siteState) ? siteState : ''} ${hasValue(siteZip) ? siteZip : ''}`.trim()].filter(Boolean).join(', ')}`);
      if (hasValue(measurementMethod)) plainTextLines.push(`Measurement Method: ${measurementMethod}`);
      if (attachmentLinks.length > 0) plainTextLines.push(`Attachment(s): ${attachmentLinks.join(', ')}`);
      if (hasValue(contractor)) plainTextLines.push(`Contractor: ${contractor}`);
      if (hasValue(floatingMessage)) plainTextLines.push(`Message: ${floatingMessage}`);
      
      if (distanceMatrixText) {
          plainTextLines.push(`\n${distanceMatrixText}`);
      }
      
      const notificationPlainText = plainTextLines.join('\n');

      const emailOptions = { htmlBody: notificationHtml };

      if (SENDER_ALIAS) {
        const allowedAliases = GmailApp.getAliases();
        if (allowedAliases.includes(SENDER_ALIAS)) {
          emailOptions.from = SENDER_ALIAS;
        } else {
          logBody += `\n[WARNING] The alias '${SENDER_ALIAS}' is not verified in this Google Account's Gmail settings. Falling back to default email address.\n`;
        }
      }

      GmailApp.sendEmail(
        NOTIFICATION_EMAIL,
        notificationSubject,
        notificationPlainText,
        emailOptions
      );
    }

    if (LOG_EMAIL) {
      GmailApp.sendEmail(
        LOG_EMAIL,
        `HubSpot Webhook Log - Success - ${foundProduct || 'No Product'}`,
        logBody
      );
    }

    PropertiesService.getScriptProperties().setProperty('LAST_SUCCESSFUL_WEBHOOK', new Date().getTime().toString());

    return ContentService.createTextOutput("Processed Successfully: Updated Contact, Created Deal & Inquiry, Associated All, and Sent Notifications.").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    logBody += `\n\n--- CRITICAL ERROR ---\n${error.toString()}\n${error.stack || ''}`;
    
    if (LOG_EMAIL) {
      GmailApp.sendEmail(
        LOG_EMAIL,
        "HubSpot Webhook Log - ERROR",
        logBody
      );
    }

    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

// ==========================================
// ZIP ROUTING API HELPER FUNCTION
// ==========================================

/**
 * Fetches drive time data from the custom Zip Code routing API
 * and determines the location with the shortest drive time.
 * @param {string} postalCode The starting zip code.
 * @return {object|null} An object with bbm_location, minutes, and full data payload, or null on failure.
 */
function getDistanceDataFromZip(postalCode) {
  if (!postalCode) return null;

  const url = `${ZIP_API_URL}?zipcode=${encodeURIComponent(postalCode)}`;

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());

    if (!json.success || !json.data) {
      console.error(`API Error or no data: ${response.getContentText()}`);
      return null;
    }

    const data = json.data;
    const locations = ["Cleveland", "Chattanooga", "Knoxville", "Dalton", "Asheville", "Greenville", "Charlotte"];
    
    let shortestDriveTime = Infinity;
    let shortestTimeLocation = null;

    // Loop through the API response keys to find the shortest time
    for (let i = 0; i < locations.length; i++) {
      const locationName = locations[i];
      const minutesKey = `${locationName} (Minutes)`;
      const minutesRaw = data[minutesKey];
      
      if (minutesRaw !== undefined && minutesRaw !== null && minutesRaw !== "") {
        const driveTimeMinutes = parseInt(minutesRaw, 10);
        
        if (!isNaN(driveTimeMinutes) && driveTimeMinutes < shortestDriveTime) {
          shortestDriveTime = driveTimeMinutes;
          shortestTimeLocation = locationName;
        }
      }
    }

    if (!shortestTimeLocation) return null;

    let finalLocation = shortestTimeLocation;
    
    // Set max drive time: 3 hours (180 mins) for Knoxville, 2.5 hours (150 mins) for all others
    const maxAllowedMinutes = (finalLocation === "Knoxville") ? 180 : 150;
    
    if (shortestDriveTime > maxAllowedMinutes) {
      finalLocation = "national"; // Restored fallback: too far to drive routes to national
    }
    
    return {
      bbm_location: finalLocation,
      bbm_location_minutes: shortestDriveTime,
      raw_api_data: data
    };
  } catch (e) {
    console.error(`Failed to fetch or parse Zip API data: ${e.toString()}`);
    return null;
  }
}

// ==========================================
// LOG RECOVERY TOOL (MANUAL RUN)
// ==========================================

function runRecoveryTool() {
  // 1. Paste your entire error log between these backticks (` `)
  const errorLog = `--- INCOMING DATA ---
Contact ID: 109370151
URL: https://www.bestbuymetals.com/metal-shingles/victorian-shingle/?utm_term=metal%20roofing&utm_campaign=national+-+campaign+%231+condensed+ad+group+format&utm_source=adwords&utm_medium=ppc&hsa_acc=2991634782&hsa_cam=23276872008&hsa_grp=189395295496&hsa_ad=711712370298&hsa_src=g&hsa_tgt=kwd-13547493&hsa_kw=metal%20roofing&hsa_mt=p&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23276872008&gbraid=0aaaaad9tj_irpu2vy9ekk_bioyyy0ruim&gclid=cjwkcajwtchpbhadeiwawo3sjupobtjbivbjnpxanlpwjy0wcwvg8ebpokvm8ddhxakqkqvxghnhoxocjt8qavd_bwe
Location: None Provided
Zip Code: 49022
Attachments Found: 0

--- LOCATION ROUTING ---
Location missing from form. Calculating closest store for zip: 49022...
Calculated BBM Location: Undefined (481 mins)

--- MATCHED DATA ---
Product Slug: victorian-shingle
Is Available: True
Routed Location: Undefined

--- API RESPONSES ---
Contact Update [HTTP 400]:
{"status":"error","message":"Property values were not valid: [{\"isValid\":false,\"message\":\"Property \\\"charlotte_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"charlotte_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"dalton_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"dalton_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"cleveland_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"cleveland_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"greenville_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"greenville_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"chattanooga_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"chattanooga_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"asheville_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"asheville_drive_distance__miles_\"},{\"isValid\":false,\"message\":\"Property \\\"knoxville_drive_distance__miles_\\\" does not exist\",\"error\":\"PROPERTY_DOESNT_EXIST\",\"name\":\"knoxville_drive_distance__miles_\"}]","correlationId":"019dd40e-2e37-796d-b3b3-43083befad77","errors":[{"message":"Property \"charlotte_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["charlotte_drive_distance__miles_"]}},{"message":"Property \"dalton_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["dalton_drive_distance__miles_"]}},{"message":"Property \"cleveland_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["cleveland_drive_distance__miles_"]}},{"message":"Property \"greenville_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["greenville_drive_distance__miles_"]}},{"message":"Property \"chattanooga_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["chattanooga_drive_distance__miles_"]}},{"message":"Property \"asheville_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["asheville_drive_distance__miles_"]}},{"message":"Property \"knoxville_drive_distance__miles_\" does not exist","code":"PROPERTY_DOESNT_EXIST","context":{"propertyName":["knoxville_drive_distance__miles_"]}}],"category":"VALIDATION_ERROR"}

Warning: Error checking for recent deals: Exception: Bandwidth quota exceeded: https://api.hubapi.com/crm/v3/objects/contacts/109370151/associations/deals. Try reducing the rate of data transfer.

Deal Creation [HTTP 201] (Pipeline: 878985997):
{"id":"59757544837","properties":{"createdate":"2026-04-28T12:26:32.690Z","days_to_close":"0","dealname":"New Inquiry - victorian-shingle","dealstage":"1320561848","hs_closed_amount":"0","hs_closed_amount_in_home_currency":"0","hs_closed_deal_close_date":"0","hs_closed_deal_create_date":"0","hs_closed_won_count":"0","hs_createdate":"2026-04-28T12:26:32.690Z","hs_days_to_close_raw":"0","hs_deal_stage_probability_shadow":"0.200000000000000011102230246251565404236316680908203125","hs_has_last_conversation_follow_ups":"false","hs_has_last_meeting_followups":"false","hs_is_closed":"false","hs_is_closed_count":"0","hs_is_closed_lost":"false","hs_is_closed_won":"false","hs_is_deal_split":"false","hs_is_open_count":"1","hs_lastmodifieddate":"2026-04-28T12:26:32.690Z","hs_num_associated_active_deal_registrations":"0","hs_num_associated_deal_registrations":"0","hs_num_associated_deal_splits":"0","hs_num_of_associated_line_items":"0","hs_num_target_accounts":"0","hs_number_of_call_engagements":"0","hs_number_of_inbound_calls":"0","hs_number_of_outbound_calls":"0","hs_number_of_overdue_tasks":"0","hs_object_id":"59757544837","hs_object_source":"INTEGRATION","hs_object_source_id":"20928005","hs_object_source_label":"INTEGRATION","hs_open_deal_create_date":"1777379192690","hs_projected_amount":"0","hs_projected_amount_in_home_currency":"0","hs_v2_date_entered_current_stage":"2026-04-28T12:26:32.690Z","hs_v2_time_in_current_stage":"2026-04-28T12:26:32.690Z","num_associated_contacts":"0","num_notes":"0","of_associated_tickets":"0","pipeline":"878985997"},"createdAt":"2026-04-28T12:26:32.690Z","updatedAt":"2026-04-28T12:26:32.690Z","archived":false,"url":"https://app.hubspot.com/contacts/6362600/record/0-3/59757544837"}

Inquiry Creation [HTTP 201]:
{"id":"53241960068","properties":{"bbm_location":"undefined","hs_createdate":"2026-04-28T12:26:33.039Z","hs_lastmodifieddate":"2026-04-28T12:26:33.039Z","hs_object_id":"53241960068","hs_object_source":"INTEGRATION","hs_object_source_id":"20928005","hs_object_source_label":"INTEGRATION","inquiry_name":"New Inquiry - victorian-shingle","product_slug":"victorian-shingle"},"createdAt":"2026-04-28T12:26:33.039Z","updatedAt":"2026-04-28T12:26:33.039Z","archived":false,"url":"https://app.hubspot.com/contacts/6362600/record/2-59384707/53241960068"}

Assoc Deal->Contact [HTTP 201]
Assoc Inquiry->Contact [HTTP 201]


--- CRITICAL ERROR ---
Exception: Bandwidth quota exceeded: https://api.hubapi.com/crm/v4/associations/2-59384707/deals/batch/create. Try reducing the rate of data transfer.
Exception: Bandwidth quota exceeded: https://api.hubapi.com/crm/v4/associations/2-59384707/deals/batch/create. Try reducing the rate of data transfer.
    at doPost (Code:336:30)
    at __GS_INTERNAL_top_function_call__.gs:1:8`;

  // 2. Run the function
  recoverBluemailFromLog(errorLog);
}

function recoverBluemailFromLog(logText) {
  Logger.log("Starting Recovery...");
  
  // Extract key details from the log using Regex
  const contactIdMatch = logText.match(/Contact ID:\s*(\d+)/);
  const slugMatch = logText.match(/Product Slug:\s*(.+)/);
  const locationMatch = logText.match(/Routed Location:\s*(.+)/);
  
  if (!contactIdMatch) {
    Logger.log("Error: Could not find Contact ID in the provided log.");
    return;
  }
  
  const recordId = contactIdMatch[1];
  const foundProduct = slugMatch ? slugMatch[1].trim() : "Unknown Product";
  const formattedProductLocation = locationMatch ? locationMatch[1].trim() : "Undefined";
  
  Logger.log(`Parsed -> Contact ID: ${recordId}, Product: ${foundProduct}, Location: ${formattedProductLocation}`);
  Logger.log("Fetching missing details from HubSpot...");

  // Fetch missing contact details from HubSpot
  const propertiesToFetch = "firstname,lastname,email,phone,mobilephone,zip,floating_contact_form_message,last_page_seen,is_a_contractor,measurement_method,site_address_line_1,site_address_line_2,site_address_city,site_address_state,site_address_zip_code";
  const contactUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${recordId}?properties=${propertiesToFetch}`;
  
  const response = UrlFetchApp.fetch(contactUrl, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + HUBSPOT_ACCESS_TOKEN },
    muteHttpExceptions: true
  });
  
  if (response.getResponseCode() !== 200) {
    Logger.log(`Error fetching contact from HubSpot: ${response.getContentText()}`);
    return;
  }
  
  const hsProps = JSON.parse(response.getContentText()).properties || {};
  
  // Format variables identically to the webhook script
  const firstName = hsProps.firstname || "Not Provided";
  const lastName = hsProps.lastname || "Not Provided";
  const email = hsProps.email || "Not Provided";
  
  // Strip 9-digit zips in recovery tool as well
  let postalCode = hsProps.zip || "Not Provided";
  if (postalCode !== "Not Provided") {
      let zipString = String(postalCode).trim();
      
      // If HubSpot treated the zip as a number and stripped leading zeros, restore them
      if (/^\d{3,4}$/.test(zipString)) {
        zipString = zipString.padStart(5, '0');
      }
      
      const zipMatch = zipString.match(/^\d{5}/);
      postalCode = zipMatch ? zipMatch[0] : zipString;
  }
  
  const floatingMessage = hsProps.floating_contact_form_message || "Not Provided";
  const lastPageSeen = hsProps.last_page_seen || "Not Provided";
  const contractor = hsProps.is_a_contractor || "Not Provided";
  const rawMeasurement = hsProps.measurement_method;
  const measurementMethod = rawMeasurement ? ({"eZ44Uy5eUq5jiG6NREYmY": "Drawing(s)", "HghiuGEdHDtlvwuo8-l-D": "Satellite Image"}[rawMeasurement] || rawMeasurement) : "Not Provided";
  
  const siteStreet1 = hsProps.site_address_line_1 || "Not Provided";
  const siteStreet2 = hsProps.site_address_line_2 || ""; 
  const siteCity = hsProps.site_address_city || "Not Provided";
  const siteState = hsProps.site_address_state || "Not Provided";
  const siteZip = hsProps.site_address_zip_code || "Not Provided";
  
  let phone = "Not Provided";
  const rawPhone = hsProps.phone || hsProps.mobilephone || "";
  if (rawPhone) {
    const cleaned = ('' + rawPhone).replace(/\D/g, '');
    const match = cleaned.match(/^(?:1)?(\d{3})(\d{3})(\d{4})$/);
    phone = match ? '(' + match[1] + ') ' + match[2] + '-' + match[3] : rawPhone;
  }

  // Build the Email
  const notificationSubject = `[RECOVERED] ${formattedProductLocation} - ${foundProduct} - ${firstName} ${lastName} - ${postalCode} - Bluemail`;
  
  const tableStyle = "border-collapse: collapse; width: 100%; max-width: 600px; font-family: Arial, sans-serif; font-size: 14px;";
  const thStyle = "border: 1px solid #dddddd; text-align: left; padding: 10px; background-color: #666666; color: #ffffff; font-weight: bold;";
  const tdLabelStyle = "border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; width: 35%; background-color: #f9f9f9;";
  const tdValueStyle = "border: 1px solid #dddddd; text-align: left; padding: 8px;";
  const hasValue = (val) => val && val !== "Not Provided" && val.toString().trim() !== "";

  let customerDetailsHtml = "";
  if (hasValue(firstName)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">First Name</td><td style="${tdValueStyle}">${firstName}</td></tr>`;
  if (hasValue(lastName)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Last Name</td><td style="${tdValueStyle}">${lastName}</td></tr>`;
  if (hasValue(email)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Email</td><td style="${tdValueStyle}"><a href="mailto:${email}">${email}</a></td></tr>`;
  if (hasValue(phone)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Phone Number</td><td style="${tdValueStyle}">${phone}</td></tr>`;
  if (hasValue(postalCode)) customerDetailsHtml += `<tr><td style="${tdLabelStyle}">Postal Code</td><td style="${tdValueStyle}">${postalCode}</td></tr>`;

  let projectDetailsHtml = "";
  projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Initial Product Slug</td><td style="${tdValueStyle}">${foundProduct}</td></tr>`;
  projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Product Location</td><td style="${tdValueStyle}">${formattedProductLocation}</td></tr>`;

  const hasSiteAddress = hasValue(siteStreet1) || hasValue(siteCity) || hasValue(siteState) || hasValue(siteZip);
  if (hasSiteAddress) {
    projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Site Address</td><td style="${tdValueStyle}">${hasValue(siteStreet1) ? siteStreet1 + '<br>' : ''}${hasValue(siteStreet2) ? siteStreet2 + '<br>' : ''}${hasValue(siteCity) ? siteCity + ', ' : ''}${hasValue(siteState) ? siteState : ''} ${hasValue(siteZip) ? siteZip : ''}</td></tr>`;
  }

  if (hasValue(measurementMethod)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Measurement Method</td><td style="${tdValueStyle}">${measurementMethod}</td></tr>`;
  if (hasValue(lastPageSeen)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Last Page Seen</td><td style="${tdValueStyle}"><a href="${lastPageSeen}">${lastPageSeen}</a></td></tr>`;
  if (hasValue(contractor)) projectDetailsHtml += `<tr><td style="${tdLabelStyle}">Is Contractor?</td><td style="${tdValueStyle}">${contractor}</td></tr>`;

  let messageHtml = "";
  if (hasValue(floatingMessage)) {
    messageHtml = `<tr><th colspan="2" style="${thStyle}">Customer Message</th></tr><tr><td colspan="2" style="${tdValueStyle}"><em>"${floatingMessage}"</em></td></tr>`;
  }

  const notificationHtml = `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; border-radius: 4px; font-family: Arial, sans-serif;">
      <strong>Note:</strong> This lead was recovered from an error log. It may have failed to associate with Deals/Inquiries in HubSpot. Contact ID: ${recordId}.
    </div>
    <table style="${tableStyle}">
      <tr><th colspan="2" style="${thStyle}">Customer Details</th></tr>
      ${customerDetailsHtml}
      <tr><th colspan="2" style="${thStyle}">Inquiry & Project Details</th></tr>
      ${projectDetailsHtml}
      ${messageHtml}
    </table>
  `;

  // Build Plain Text fallback dynamically
  const nameStr = [firstName, lastName].filter(n => hasValue(n)).join(' ');
  let plainTextLines = [`[RECOVERED] New Inquiry${nameStr ? ' from ' + nameStr : ''}.`];
  if (hasValue(email)) plainTextLines.push(`Email: ${email}`);
  if (hasValue(phone)) plainTextLines.push(`Phone: ${phone}`);
  if (hasValue(postalCode)) plainTextLines.push(`Zip: ${postalCode}`);
  if (hasSiteAddress) plainTextLines.push(`Site Address: ${[siteStreet1, siteStreet2, `${hasValue(siteCity) ? siteCity : ''}${hasValue(siteState) || hasValue(siteZip) ? ',' : ''} ${hasValue(siteState) ? siteState : ''} ${hasValue(siteZip) ? siteZip : ''}`.trim()].filter(Boolean).join(', ')}`);
  if (hasValue(measurementMethod)) plainTextLines.push(`Measurement Method: ${measurementMethod}`);
  if (hasValue(contractor)) plainTextLines.push(`Contractor: ${contractor}`);
  if (hasValue(floatingMessage)) plainTextLines.push(`Message: ${floatingMessage}`);
  
  const notificationPlainText = plainTextLines.join('\n');

  const emailOptions = { htmlBody: notificationHtml };
  if (SENDER_ALIAS) {
    const allowedAliases = GmailApp.getAliases();
    if (allowedAliases.includes(SENDER_ALIAS)) emailOptions.from = SENDER_ALIAS;
  }

  // Send the email
  GmailApp.sendEmail(NOTIFICATION_EMAIL, notificationSubject, notificationPlainText, emailOptions);
  
  Logger.log("Success! Recovered Bluemail sent.");
}