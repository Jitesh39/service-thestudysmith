import { db } from "./firebase-admin";

export async function migrateFromSheets() {
  try {
    // 1. Get Sheet URL from settings
    const settingsDoc = await db.collection("settings").doc("dashboard").get();
    if (!settingsDoc.exists || !settingsDoc.data()?.sheetUrl) {
      throw new Error("Google Sheet URL not found in Firestore settings.");
    }

    const sheetUrl = settingsDoc.data()?.sheetUrl;
    const csvUrl = sheetUrl.replace("/pubhtml", "/pub") + (sheetUrl.includes("?") ? "&" : "?") + "output=csv";

    // 2. Fetch and parse CSV
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error("Failed to fetch Google Sheet data.");
    const csvText = await response.text();

    const rows = csvText.split(/\r?\n/).filter(row => row.trim());
    if (rows.length < 1) return { success: false, message: "No data found in sheet." };

    // Simple CSV parser that handles quoted commas
    const splitRow = (row: string) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') inQuotes = !inQuotes;
        else if (row[i] === "," && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = "";
        } else {
          current += row[i];
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = splitRow(rows[0]).map(h => h.toLowerCase());
    const data = rows.slice(1).map(row => {
      const values = splitRow(row);
      return headers.reduce((acc, header, i) => {
        acc[header] = values[i] || "";
        return acc;
      }, {} as any);
    });

    console.log(`Found ${data.length} projects to migrate.`);

    // 3. Migrate to Firestore
    const batch = db.batch();
    const projectsCol = db.collection("projects");

    for (const project of data) {
      // Map columns based on user's list
      // Column Map:
      // sr. no -> srNo
      // project id -> projectId
      // project name -> projectName
      // email address -> email
      // name (client name) -> clientName
      // project status -> projectStatus
      // contact_status -> contactStatus
      // enquire date -> enquireDate
      // target date -> targetDate
      // assigned to -> assignedTo
      // payment (total amount) -> totalAmount
      // payment status -> paymentStatus
      // deployment status -> deploymentStatus
      // domain -> domain
      // domain plan -> domainPlan
      // domain name -> domainName
      // domain provider -> domainProvider

      const pId = project['project id'] || project['id'];
      if (!pId) continue;

      const totalAmount = parseFloat(project['payment (total amount)'] || project['payment'] || '0') || 0;
      const statusFromSheet = (project['payment status'] || project['p-status'] || 'pending').toLowerCase();
      
      let paymentStatus = "pending";
      let paidAmount = 0;

      if (statusFromSheet.includes("paid") || statusFromSheet.includes("full")) {
        paymentStatus = "paid";
        paidAmount = totalAmount;
      } else if (statusFromSheet.includes("50%") || statusFromSheet.includes("partial")) {
        paymentStatus = "partial";
        paidAmount = totalAmount / 2;
      }

      const projectData = {
        srNo: project['sr. no'] || "",
        projectId: pId,
        projectName: project['project name'] || project['title'] || "",
        email: project['email address'] || project['email'] || "",
        clientName: project['name (client name)'] || project['name'] || "",
        projectStatus: project['project status'] || project['status'] || "Pending",
        contactStatus: project['contact_status'] || "Pending",
        enquireDate: project['enquire date'] || project['date'] || "",
        targetDate: project['target date'] || project['deadline'] || "N/A",
        assignedTo: project['assigned to'] || "Unassigned",
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        paymentStatus: paymentStatus,
        deploymentStatus: project['deployment status'] || "Pending",
        domain: project['domain'] || "",
        domainPlan: project['domain plan'] || "",
        domainName: project['domain name'] || "",
        domainProvider: project['domain provider'] || "",
        createdAt: new Date(),
        migratedAt: new Date(),
      };

      const docRef = projectsCol.doc(pId);
      batch.set(docRef, projectData, { merge: true });
    }

    await batch.commit();
    return { success: true, count: data.length };

  } catch (error: any) {
    console.error("Migration error:", error);
    return { success: false, error: error.message };
  }
}
