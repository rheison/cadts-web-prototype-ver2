const STORAGE_KEY = "cadts_secure_destroy_demo_v3_users";
const SESSION_KEY = "cadts_secure_destroy_current_user_v3";

const ROLES = [
  "Administrator",
  "Asset Owner",
  "Approver / Security Manager",
  "IT Technician",
  "Auditor / Compliance Reviewer",
  "Pending Role Assignment"
];

const STATUS_OPTIONS = ["Active", "Pending Role Assignment", "Suspended"];

const ROLE_PERMISSIONS = {
  "Administrator": ["dashboard", "assets", "requests", "approvals", "evidence", "certificates", "reports", "audit", "users", "about"],
  "Asset Owner": ["dashboard", "assets", "requests", "certificates", "about"],
  "Approver / Security Manager": ["dashboard", "requests", "approvals", "audit", "about"],
  "IT Technician": ["dashboard", "requests", "evidence", "certificates", "about"],
  "Auditor / Compliance Reviewer": ["dashboard", "certificates", "reports", "audit", "about"],
  "Pending Role Assignment": ["dashboard", "about"]
};

const demoData = {
  users: [
    {
      id: "USR-0001",
      name: "Rheison Maloles",
      email: "admin@cadts.demo",
      password: "admin123",
      role: "Administrator",
      status: "Active",
      created: "2026-05-26",
      lastLogin: ""
    },
    {
      id: "USR-0002",
      name: "Cortney Betz",
      email: "asset@cadts.demo",
      password: "demo123",
      role: "Asset Owner",
      status: "Active",
      created: "2026-05-26",
      lastLogin: ""
    },
    {
      id: "USR-0003",
      name: "Johnny Wade",
      email: "approver@cadts.demo",
      password: "demo123",
      role: "Approver / Security Manager",
      status: "Active",
      created: "2026-05-26",
      lastLogin: ""
    },
    {
      id: "USR-0004",
      name: "Tommy Duong",
      email: "tech@cadts.demo",
      password: "demo123",
      role: "IT Technician",
      status: "Active",
      created: "2026-05-26",
      lastLogin: ""
    },
    {
      id: "USR-0005",
      name: "Compliance Reviewer",
      email: "auditor@cadts.demo",
      password: "demo123",
      role: "Auditor / Compliance Reviewer",
      status: "Active",
      created: "2026-05-26",
      lastLogin: ""
    }
  ],
  assets: [
    {
      id: "AST-1001",
      name: "AWS S3 Evidence Archive Bucket",
      type: "Cloud Storage",
      owner: "Asset Owner",
      classification: "Confidential",
      location: "AWS us-west-2",
      status: "Active",
      created: "2026-05-01"
    },
    {
      id: "AST-1002",
      name: "Azure VM Disk Snapshot",
      type: "Virtual Disk",
      owner: "Infrastructure Team",
      classification: "Restricted",
      location: "Azure West US",
      status: "Pending Destruction",
      created: "2026-05-04"
    },
    {
      id: "AST-1003",
      name: "Retired Database Backup",
      type: "Database Backup",
      owner: "Data Services",
      classification: "Regulated",
      location: "Encrypted Backup Vault",
      status: "Active",
      created: "2026-05-08"
    },
    {
      id: "AST-1004",
      name: "Decommissioned Laptop SSD",
      type: "Digital Media",
      owner: "Endpoint Support",
      classification: "Internal",
      location: "Secure Storage Cage",
      status: "Destroyed",
      created: "2026-04-19"
    }
  ],
  requests: [
    {
      id: "REQ-2001",
      assetId: "AST-1002",
      requester: "Cortney Betz",
      requesterUserId: "USR-0002",
      reason: "Cloud snapshot has reached retention end date and must be sanitized.",
      method: "Cryptographic erase",
      priority: "High",
      status: "Pending Approval",
      approver: "Security Manager",
      technician: "IT Technician",
      dueDate: "2026-05-31",
      created: "2026-05-20",
      evidence: [],
      certificateId: ""
    },
    {
      id: "REQ-2002",
      assetId: "AST-1004",
      requester: "Endpoint Support",
      requesterUserId: "USR-0002",
      reason: "Physical SSD removed from service and destroyed under media disposal procedure.",
      method: "Physical shred",
      priority: "Medium",
      status: "Completed",
      approver: "Johnny Wade",
      technician: "Tommy Duong",
      dueDate: "2026-05-10",
      created: "2026-05-02",
      evidence: [
        {
          type: "Photo",
          fileName: "ssd_shred_bin_photo.jpg",
          description: "Image of serialized SSD in approved destruction container.",
          added: "2026-05-05 10:31"
        },
        {
          type: "Vendor Certificate",
          fileName: "vendor_cert_5512.pdf",
          description: "Vendor-provided destruction confirmation.",
          added: "2026-05-05 10:35"
        }
      ],
      certificateId: "CERT-3001",
      completed: "2026-05-05 10:38"
    }
  ],
  audit: [
    {
      time: "2026-05-02 08:21",
      role: "Administrator",
      action: "User Provisioned",
      details: "Demo role accounts created for classroom walkthrough."
    },
    {
      time: "2026-05-05 10:38",
      role: "IT Technician",
      action: "Destruction Completed",
      details: "REQ-2002 closed with evidence and certificate CERT-3001."
    },
    {
      time: "2026-05-20 14:02",
      role: "Asset Owner",
      action: "Request Submitted",
      details: "REQ-2001 submitted for AST-1002."
    }
  ]
};

let state = ensureState(loadState());
let activeView = "dashboard";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : clone(demoData);
  } catch (error) {
    return clone(demoData);
  }
}

function ensureState(data) {
  const merged = {
    users: data.users && data.users.length ? data.users : clone(demoData.users),
    assets: data.assets || clone(demoData.assets),
    requests: data.requests || clone(demoData.requests),
    audit: data.audit || clone(demoData.audit)
  };
  return merged;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSessionUserId() {
  return localStorage.getItem(SESSION_KEY) || "";
}

function setSessionUserId(userId) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const sessionUserId = getSessionUserId();
  return state.users.find((user) => user.id === sessionUserId) || null;
}

function getActiveRole() {
  return getCurrentUser()?.role || "Pending Role Assignment";
}

function isAdmin() {
  return getActiveRole() === "Administrator";
}

function hasPermission(view) {
  return (ROLE_PERMISSIONS[getActiveRole()] || []).includes(view);
}

function today() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function timestamp() {
  const now = new Date();
  return now.toISOString().slice(0, 16).replace("T", " ");
}

function nextId(prefix, collection) {
  const nums = collection
    .map((item) => Number(String(item.id || "").replace(prefix + "-", "")))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(4, "0")}`;
}

function logAction(action, details) {
  const user = getCurrentUser();
  state.audit.unshift({
    time: timestamp(),
    role: user ? `${user.name} (${user.role})` : "System",
    action,
    details
  });
  saveState();
}

function resetState() {
  state = clone(demoData);
  saveState();
  setSessionUserId("USR-0001");
  activeView = "dashboard";
  toast("Demo data, users, and role accounts reset. Admin is signed in.");
  render();
}

function getAsset(assetId) {
  return state.assets.find((asset) => asset.id === assetId);
}

function getUser(userId) {
  return state.users.find((user) => user.id === userId);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(status) {
  const lower = String(status).toLowerCase();
  if (lower.includes("pending role")) return "pending-role";
  if (lower === "active") return "active";
  if (lower.includes("suspend")) return "suspended";
  if (lower.includes("pending")) return "pending";
  if (lower.includes("approved")) return "approved";
  if (lower.includes("complete")) return "completed";
  if (lower.includes("reject")) return "rejected";
  if (lower.includes("destroy")) return "destroyed";
  return "";
}

function badge(status) {
  return `<span class="status ${statusClass(status)}">${escapeHtml(status)}</span>`;
}

function toast(message) {
  const alertArea = document.getElementById("alertArea");
  if (!alertArea) return;
  alertArea.innerHTML = `<div class="alert">${escapeHtml(message)}</div>`;
  setTimeout(() => {
    alertArea.innerHTML = "";
  }, 3600);
}

function renderAuth() {
  const authRoot = document.getElementById("authRoot");
  const appShell = document.getElementById("appShell");
  authRoot.classList.remove("hidden");
  appShell.classList.add("hidden");

  authRoot.innerHTML = `
    <div class="auth-card">
      <section class="auth-panel">
        <p class="eyebrow">SecureDestroy CADTS</p>
        <h1>Role-Based Destruction Workflow Demo</h1>
        <p>Create a demo account, sign in as administrator, assign the user a role, then demonstrate the CADTS workflow through each role-specific dashboard.</p>
        <div class="auth-demo-list">
          <div class="demo-account"><strong>Admin</strong><span>admin@cadts.demo / admin123</span></div>
          <div class="demo-account"><strong>Asset Owner</strong><span>asset@cadts.demo / demo123</span></div>
          <div class="demo-account"><strong>Approver</strong><span>approver@cadts.demo / demo123</span></div>
          <div class="demo-account"><strong>Technician</strong><span>tech@cadts.demo / demo123</span></div>
          <div class="demo-account"><strong>Auditor</strong><span>auditor@cadts.demo / demo123</span></div>
        </div>
        <div class="auth-warning"><strong>Class demo note:</strong> accounts are stored in this browser for the GitHub Pages version. A true shared multi-device system needs a backend database and authentication service.</div>
      </section>

      <section class="auth-form-card">
        <div class="auth-tabs">
          <button id="showLoginBtn" class="active">Sign In</button>
          <button id="showRegisterBtn">Create Account</button>
        </div>
        <div id="authFormRoot"></div>
      </section>
    </div>
  `;

  bindAuthEvents();
  renderLoginForm();
}

function renderLoginForm() {
  const root = document.getElementById("authFormRoot");
  document.getElementById("showLoginBtn").classList.add("active");
  document.getElementById("showRegisterBtn").classList.remove("active");
  root.innerHTML = `
    <h2>Sign in</h2>
    <form id="loginForm">
      <label>Email <input type="email" name="email" required placeholder="admin@cadts.demo" /></label>
      <label>Password <input type="password" name="password" required placeholder="admin123" /></label>
      <button type="submit">Sign In</button>
      <button type="button" class="secondary" id="quickAdminBtn">Quick Admin Login</button>
    </form>
  `;
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("quickAdminBtn").addEventListener("click", () => loginWithCredentials("admin@cadts.demo", "admin123"));
}

function renderRegisterForm() {
  const root = document.getElementById("authFormRoot");
  document.getElementById("showLoginBtn").classList.remove("active");
  document.getElementById("showRegisterBtn").classList.add("active");
  root.innerHTML = `
    <h2>Create demo account</h2>
    <form id="registerForm">
      <label>Full Name <input name="name" required placeholder="Student Name" /></label>
      <label>Email <input type="email" name="email" required placeholder="student@school.edu" /></label>
      <label>Password <input type="password" name="password" minlength="4" required placeholder="Minimum 4 characters" /></label>
      <button type="submit">Create Account</button>
    </form>
    <div class="auth-warning">New accounts start as <strong>Pending Role Assignment</strong>. Sign in as administrator to assign Asset Owner, Approver, Technician, Auditor, or Administrator access.</div>
  `;
  document.getElementById("registerForm").addEventListener("submit", handleRegister);
}

function bindAuthEvents() {
  document.getElementById("showLoginBtn").addEventListener("click", renderLoginForm);
  document.getElementById("showRegisterBtn").addEventListener("click", renderRegisterForm);
}

function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  loginWithCredentials(form.get("email"), form.get("password"));
}

function loginWithCredentials(email, password) {
  const normalized = String(email || "").trim().toLowerCase();
  const user = state.users.find((item) => item.email.toLowerCase() === normalized && item.password === String(password || ""));
  if (!user) {
    alert("Sign in failed. Check the email and password.");
    return;
  }
  if (user.status === "Suspended") {
    alert("This account is suspended. Ask the administrator to reactivate it.");
    return;
  }
  user.lastLogin = timestamp();
  setSessionUserId(user.id);
  logAction("User Signed In", `${user.name} signed in as ${user.role}.`);
  saveState();
  activeView = "dashboard";
  render();
}

function handleRegister(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const email = String(form.get("email") || "").trim().toLowerCase();
  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    alert("That email already exists in the demo user list.");
    return;
  }
  const user = {
    id: nextId("USR", state.users),
    name: String(form.get("name") || "").trim(),
    email,
    password: String(form.get("password") || ""),
    role: "Pending Role Assignment",
    status: "Pending Role Assignment",
    created: today(),
    lastLogin: ""
  };
  state.users.push(user);
  saveState();
  setSessionUserId(user.id);
  logAction("User Registered", `${user.name} created an account and is waiting for role assignment.`);
  render();
}

function logout() {
  const user = getCurrentUser();
  if (user) logAction("User Signed Out", `${user.name} signed out.`);
  setSessionUserId("");
  activeView = "dashboard";
  render();
}

function setView(view) {
  if (!hasPermission(view)) {
    toast("This role does not have access to that screen.");
    return;
  }
  activeView = view;
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  render();
}

function ensureAllowedView() {
  if (!hasPermission(activeView)) {
    activeView = "dashboard";
  }
}

function updateNavigation() {
  document.querySelectorAll(".nav-link").forEach((btn) => {
    const allowed = hasPermission(btn.dataset.view);
    btn.classList.toggle("hidden", !allowed);
    btn.classList.toggle("active", btn.dataset.view === activeView);
  });
}

function roleNotice() {
  const user = getCurrentUser();
  const guidance = {
    "Administrator": "Administrator view: create users, assign roles, reset demo data, and monitor the full workflow.",
    "Asset Owner": "Asset Owner view: register assets and submit destruction requests for approval.",
    "Approver / Security Manager": "Approver view: review destruction requests and approve or reject them.",
    "IT Technician": "Technician view: record destruction action, attach evidence metadata, and close approved requests.",
    "Auditor / Compliance Reviewer": "Auditor view: review certificates, reports, and audit history.",
    "Pending Role Assignment": "Your account has been created. An administrator must assign your CADTS role before you can use the workflow screens."
  };
  return `<div class="notice"><strong>${escapeHtml(user.name)}</strong> is signed in as <span class="user-chip">${escapeHtml(user.role)}</span><br>${escapeHtml(guidance[user.role] || guidance["Pending Role Assignment"])}</div>`;
}

function render() {
  const user = getCurrentUser();
  if (!user) {
    renderAuth();
    return;
  }

  const authRoot = document.getElementById("authRoot");
  const appShell = document.getElementById("appShell");
  authRoot.classList.add("hidden");
  appShell.classList.remove("hidden");
  ensureAllowedView();
  updateNavigation();

  document.getElementById("currentUserName").textContent = user.name;
  document.getElementById("currentUserRole").textContent = `${user.role} • ${user.status}`;
  document.getElementById("resetDemoBtn").classList.toggle("hidden", !isAdmin());
  document.getElementById("exportAllBtn").classList.toggle("hidden", !(isAdmin() || getActiveRole() === "Auditor / Compliance Reviewer"));

  const titleMap = {
    dashboard: "Dashboard",
    assets: "Asset Registry",
    requests: "Destruction Requests",
    approvals: "Approval Queue",
    evidence: "Evidence & Closure",
    certificates: "Certificates",
    reports: "Reports",
    audit: "Audit Log",
    users: "Users & Roles",
    about: "About Prototype"
  };
  document.getElementById("viewTitle").textContent = titleMap[activeView] || "Dashboard";

  const views = {
    dashboard: renderDashboard,
    assets: renderAssets,
    requests: renderRequests,
    approvals: renderApprovals,
    evidence: renderEvidence,
    certificates: renderCertificates,
    reports: renderReports,
    audit: renderAudit,
    users: renderUsers,
    about: renderAbout
  };

  document.getElementById("viewRoot").innerHTML = roleNotice() + views[activeView]();
  bindViewEvents();
}

function renderDashboard() {
  const totalAssets = state.assets.length;
  const activeAssets = state.assets.filter((a) => a.status === "Active").length;
  const pendingApprovals = state.requests.filter((r) => r.status === "Pending Approval").length;
  const completed = state.requests.filter((r) => r.status === "Completed").length;
  const pendingUsers = state.users.filter((u) => u.status === "Pending Role Assignment").length;
  const statusCounts = state.requests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(statusCounts));

  return `
    <div class="grid four">
      <div class="metric"><span>Total Assets</span><strong>${totalAssets}</strong></div>
      <div class="metric"><span>Active Assets</span><strong>${activeAssets}</strong></div>
      <div class="metric"><span>Pending Approval</span><strong>${pendingApprovals}</strong></div>
      <div class="metric"><span>${isAdmin() ? "Pending Users" : "Completed"}</span><strong>${isAdmin() ? pendingUsers : completed}</strong></div>
    </div>

    ${getActiveRole() === "Pending Role Assignment" ? `
      <div class="card">
        <h3>Waiting for Role Assignment</h3>
        <p>Your account exists, but CADTS has not assigned a workflow role yet. For the demonstration, sign out, sign in as <strong>admin@cadts.demo</strong>, open <strong>Users & Roles</strong>, and assign this user a role.</p>
      </div>
    ` : ""}

    <div class="card">
      <h3>End-to-End CADTS Workflow</h3>
      <div class="workflow">
        <div class="step"><strong>1. Register</strong><span class="muted">Asset is added with owner, location, and classification.</span></div>
        <div class="step"><strong>2. Request</strong><span class="muted">Asset owner submits destruction request and method.</span></div>
        <div class="step"><strong>3. Approve</strong><span class="muted">Security manager approves, rejects, or returns request.</span></div>
        <div class="step"><strong>4. Destroy</strong><span class="muted">Technician performs approved destruction or sanitization.</span></div>
        <div class="step"><strong>5. Evidence</strong><span class="muted">Proof is recorded with logs, photos, screenshots, or certificates.</span></div>
        <div class="step"><strong>6. Report</strong><span class="muted">Certificate and compliance reports become available.</span></div>
      </div>
    </div>

    <div class="grid two">
      <div class="card">
        <h3>Request Status Summary</h3>
        ${Object.entries(statusCounts).map(([status, count]) => `
          <div class="bar-row">
            <span>${escapeHtml(status)}</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${(count / max) * 100}%"></div></div>
            <strong>${count}</strong>
          </div>
        `).join("") || `<p class="muted">No requests yet.</p>`}
      </div>

      <div class="card">
        <h3>Recent Audit Events</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Time</th><th>Action</th><th>Details</th></tr></thead>
            <tbody>
              ${state.audit.slice(0, 5).map((event) => `
                <tr>
                  <td>${escapeHtml(event.time)}</td>
                  <td>${escapeHtml(event.action)}</td>
                  <td>${escapeHtml(event.details)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAssets() {
  return `
    <div class="grid two">
      <div class="card">
        <h3>Register New Asset</h3>
        <form id="assetForm" class="form-grid">
          <label>Asset Name <input name="name" required placeholder="Retired cloud backup volume" /></label>
          <label>Asset Type
            <select name="type">
              <option>Cloud Storage</option>
              <option>Virtual Disk</option>
              <option>Database Backup</option>
              <option>Digital Media</option>
              <option>Application Record</option>
            </select>
          </label>
          <label>Owner <input name="owner" required value="${escapeHtml(getCurrentUser().name)}" /></label>
          <label>Classification
            <select name="classification">
              <option>Internal</option>
              <option>Confidential</option>
              <option>Restricted</option>
              <option>Regulated</option>
            </select>
          </label>
          <label class="full">Location <input name="location" required placeholder="AWS us-west-2 / Secure cage / Backup vault" /></label>
          <div class="full actions">
            <button type="submit">Register Asset</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h3>Asset Control Purpose</h3>
        <p>CADTS centralizes digital asset records so the organization can show what was destroyed, who approved it, who performed the action, and what evidence supports the closure.</p>
        <p class="muted">In this demo, access to this screen is controlled by the signed-in user role.</p>
      </div>
    </div>

    <div class="card">
      <h3>Asset Inventory</h3>
      ${assetTable(state.assets)}
    </div>
  `;
}

function assetTable(assets) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Asset ID</th><th>Name</th><th>Type</th><th>Owner</th><th>Class.</th><th>Location</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${assets.map((asset) => `
            <tr>
              <td>${escapeHtml(asset.id)}</td>
              <td>${escapeHtml(asset.name)}</td>
              <td>${escapeHtml(asset.type)}</td>
              <td>${escapeHtml(asset.owner)}</td>
              <td>${escapeHtml(asset.classification)}</td>
              <td>${escapeHtml(asset.location)}</td>
              <td>${badge(asset.status)}</td>
            </tr>
          `).join("") || `<tr><td colspan="7">No assets found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderRequests() {
  const selectableAssets = state.assets.filter((asset) => asset.status !== "Destroyed");
  return `
    <div class="grid two">
      <div class="card">
        <h3>Submit Destruction Request</h3>
        <form id="requestForm" class="form-grid">
          <label class="full">Asset
            <select name="assetId" required>
              ${selectableAssets.map((asset) => `<option value="${asset.id}">${asset.id} - ${escapeHtml(asset.name)}</option>`).join("")}
            </select>
          </label>
          <label>Requester <input name="requester" required value="${escapeHtml(getCurrentUser().name)}" /></label>
          <label>Priority
            <select name="priority">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
          <label>Destruction Method
            <select name="method">
              <option>Cryptographic erase</option>
              <option>Secure wipe</option>
              <option>Cloud object purge</option>
              <option>Physical shred</option>
              <option>Vendor certified destruction</option>
            </select>
          </label>
          <label>Due Date <input type="date" name="dueDate" required value="${today()}" /></label>
          <label class="full">Business Reason / Justification
            <textarea name="reason" required placeholder="Explain retention end date, legal requirement, decommissioning event, or security need."></textarea>
          </label>
          <div class="full actions">
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h3>Request Controls</h3>
        <p>The request stage captures the business reason, requested destruction method, priority, and due date. Once submitted, the item enters the approval queue.</p>
        <p class="muted">Demo path: Asset Owner submits request → Approver approves → Technician closes with evidence → Auditor reviews certificate/report.</p>
      </div>
    </div>

    <div class="card">
      <h3>All Destruction Requests</h3>
      ${requestTable(state.requests)}
    </div>
  `;
}

function requestTable(requests, includeActions = false) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Request ID</th><th>Asset</th><th>Requester</th><th>Method</th><th>Priority</th><th>Status</th><th>Due</th>${includeActions ? "<th>Actions</th>" : ""}</tr>
        </thead>
        <tbody>
          ${requests.map((request) => {
            const asset = getAsset(request.assetId);
            return `
              <tr>
                <td>${escapeHtml(request.id)}</td>
                <td><strong>${escapeHtml(request.assetId)}</strong><br><span class="muted">${escapeHtml(asset?.name || "Unknown asset")}</span></td>
                <td>${escapeHtml(request.requester)}</td>
                <td>${escapeHtml(request.method)}</td>
                <td>${escapeHtml(request.priority)}</td>
                <td>${badge(request.status)}</td>
                <td>${escapeHtml(request.dueDate)}</td>
                ${includeActions ? `
                  <td>
                    <div class="actions">
                      <button class="success" data-approve="${request.id}">Approve</button>
                      <button class="danger" data-reject="${request.id}">Reject</button>
                    </div>
                  </td>
                ` : ""}
              </tr>
            `;
          }).join("") || `<tr><td colspan="${includeActions ? 8 : 7}">No requests found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderApprovals() {
  const pending = state.requests.filter((request) => request.status === "Pending Approval");
  return `
    <div class="card">
      <h3>Approval Queue</h3>
      <p>Approvers verify the request is valid, confirm authorization, and ensure destruction is appropriate before any technician action occurs.</p>
      ${requestTable(pending, true)}
    </div>
  `;
}

function renderEvidence() {
  const workable = state.requests.filter((request) => request.status === "Approved - Pending Technician");
  const selected = workable[0];
  return `
    <div class="grid two">
      <div class="card">
        <h3>Record Evidence and Close Request</h3>
        ${workable.length ? `
          <form id="evidenceForm" class="form-grid">
            <label class="full">Approved Request
              <select name="requestId">
                ${workable.map((request) => {
                  const asset = getAsset(request.assetId);
                  return `<option value="${request.id}">${request.id} - ${request.assetId} - ${escapeHtml(asset?.name || "")}</option>`;
                }).join("")}
              </select>
            </label>
            <label>Evidence Type
              <select name="type">
                <option>System Log</option>
                <option>Screenshot</option>
                <option>Vendor Certificate</option>
                <option>Photo</option>
                <option>Ticket Reference</option>
              </select>
            </label>
            <label>File Name / Reference <input name="fileName" required placeholder="wipe-log-REQ-2001.txt" /></label>
            <label class="full">Evidence Description
              <textarea name="description" required placeholder="Summarize what the evidence proves."></textarea>
            </label>
            <div class="full actions">
              <button type="submit">Attach Evidence and Complete Destruction</button>
            </div>
          </form>
        ` : `<p class="muted">No approved requests are waiting for technician closure. Approve a pending request first.</p>`}
      </div>

      <div class="card">
        <h3>Closure Rule</h3>
        <p>A request cannot be completed until approval exists and at least one evidence record is attached. When closed, CADTS marks the asset destroyed and creates a certificate number.</p>
        ${selected ? `<p class="muted">Next available request: ${escapeHtml(selected.id)}</p>` : ""}
      </div>
    </div>

    <div class="card">
      <h3>Evidence Records</h3>
      ${evidenceTable()}
    </div>
  `;
}

function evidenceTable() {
  const rows = state.requests.flatMap((request) =>
    (request.evidence || []).map((evidence) => ({
      requestId: request.id,
      assetId: request.assetId,
      ...evidence
    }))
  );

  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Request</th><th>Asset</th><th>Type</th><th>File / Ref.</th><th>Description</th><th>Added</th></tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(row.requestId)}</td>
              <td>${escapeHtml(row.assetId)}</td>
              <td>${escapeHtml(row.type)}</td>
              <td>${escapeHtml(row.fileName)}</td>
              <td>${escapeHtml(row.description)}</td>
              <td>${escapeHtml(row.added)}</td>
            </tr>
          `).join("") || `<tr><td colspan="6">No evidence records yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderCertificates() {
  const completed = state.requests.filter((request) => request.status === "Completed");
  return `
    <div class="card">
      <h3>Certificates of Destruction</h3>
      <p>Certificates summarize the asset, approved destruction method, completion date, evidence record, and audit reference.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Certificate</th><th>Request</th><th>Asset</th><th>Method</th><th>Completed</th><th>Action</th></tr></thead>
          <tbody>
            ${completed.map((request) => {
              const asset = getAsset(request.assetId);
              return `
                <tr>
                  <td>${escapeHtml(request.certificateId)}</td>
                  <td>${escapeHtml(request.id)}</td>
                  <td>${escapeHtml(asset?.name || request.assetId)}</td>
                  <td>${escapeHtml(request.method)}</td>
                  <td>${escapeHtml(request.completed || "Not recorded")}</td>
                  <td><button data-certificate="${request.id}">View / Print</button></td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="6">No completed destructions yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReports() {
  const completed = state.requests.filter((r) => r.status === "Completed").length;
  const open = state.requests.filter((r) => r.status !== "Completed" && r.status !== "Rejected").length;
  const rejected = state.requests.filter((r) => r.status === "Rejected").length;
  const destroyedAssets = state.assets.filter((a) => a.status === "Destroyed").length;

  return `
    <div class="grid four">
      <div class="metric"><span>Completed</span><strong>${completed}</strong></div>
      <div class="metric"><span>Open</span><strong>${open}</strong></div>
      <div class="metric"><span>Rejected</span><strong>${rejected}</strong></div>
      <div class="metric"><span>Destroyed Assets</span><strong>${destroyedAssets}</strong></div>
    </div>

    <div class="card">
      <h3>Compliance Report</h3>
      <p>This report supports audit review by listing request status, asset classification, destruction method, evidence count, and certificate ID.</p>
      <div class="actions">
        <button id="exportRequestsBtn">Export Requests CSV</button>
        <button id="exportAssetsBtn" class="secondary">Export Assets CSV</button>
      </div>
    </div>

    <div class="card">
      <h3>Report Table</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Request</th><th>Asset</th><th>Classification</th><th>Method</th><th>Status</th><th>Evidence Count</th><th>Certificate</th></tr></thead>
          <tbody>
            ${state.requests.map((request) => {
              const asset = getAsset(request.assetId);
              return `
                <tr>
                  <td>${escapeHtml(request.id)}</td>
                  <td>${escapeHtml(asset?.name || request.assetId)}</td>
                  <td>${escapeHtml(asset?.classification || "")}</td>
                  <td>${escapeHtml(request.method)}</td>
                  <td>${badge(request.status)}</td>
                  <td>${(request.evidence || []).length}</td>
                  <td>${escapeHtml(request.certificateId || "N/A")}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAudit() {
  return `
    <div class="card">
      <h3>Audit Log</h3>
      <p>The audit log records key workflow actions. In a production system this would be append-only and protected from alteration.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Time</th><th>User / Role</th><th>Action</th><th>Details</th></tr></thead>
          <tbody>
            ${state.audit.map((event) => `
              <tr>
                <td>${escapeHtml(event.time)}</td>
                <td>${escapeHtml(event.role)}</td>
                <td>${escapeHtml(event.action)}</td>
                <td>${escapeHtml(event.details)}</td>
              </tr>
            `).join("") || `<tr><td colspan="4">No audit events found.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderUsers() {
  return `
    <div class="grid two">
      <div class="card">
        <h3>Create User as Administrator</h3>
        <form id="adminCreateUserForm" class="form-grid">
          <label>Full Name <input name="name" required placeholder="Student Name" /></label>
          <label>Email <input type="email" name="email" required placeholder="student@school.edu" /></label>
          <label>Password <input name="password" required value="demo123" /></label>
          <label>Role
            <select name="role">
              ${ROLES.filter((role) => role !== "Pending Role Assignment").map((role) => `<option>${role}</option>`).join("")}
            </select>
          </label>
          <div class="full actions"><button type="submit">Create Active User</button></div>
        </form>
      </div>

      <div class="card">
        <h3>Role Permissions</h3>
        <div class="permission-grid">
          <div class="permission-card"><strong>Admin</strong><span class="muted">Users, roles, full workflow, reset, exports.</span></div>
          <div class="permission-card"><strong>Asset Owner</strong><span class="muted">Assets, requests, certificates.</span></div>
          <div class="permission-card"><strong>Approver</strong><span class="muted">Queue review, approval, rejection, audit review.</span></div>
          <div class="permission-card"><strong>Technician</strong><span class="muted">Evidence entry and destruction closure.</span></div>
          <div class="permission-card"><strong>Auditor</strong><span class="muted">Certificates, reports, audit log.</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Users and Role Assignment</h3>
      <p>Use this table during the live demo. A student can create an account at the login screen, then the administrator assigns the user a role here.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th><th>Last Login</th><th>Admin Action</th></tr></thead>
          <tbody>
            ${state.users.map((user) => `
              <tr>
                <td><strong>${escapeHtml(user.name)}</strong><br><span class="muted">${escapeHtml(user.id)}</span></td>
                <td>${escapeHtml(user.email)}</td>
                <td>${badge(user.role)}</td>
                <td>${badge(user.status)}</td>
                <td>${escapeHtml(user.created)}</td>
                <td>${escapeHtml(user.lastLogin || "Never")}</td>
                <td>
                  <div class="user-row-actions">
                    <select class="compact-select" data-role-select="${user.id}">
                      ${ROLES.map((role) => `<option ${role === user.role ? "selected" : ""}>${role}</option>`).join("")}
                    </select>
                    <select class="compact-select" data-status-select="${user.id}">
                      ${STATUS_OPTIONS.map((status) => `<option ${status === user.status ? "selected" : ""}>${status}</option>`).join("")}
                    </select>
                    <button data-save-user="${user.id}">Save</button>
                    ${user.id !== getCurrentUser().id ? `<button class="danger" data-delete-user="${user.id}">Delete</button>` : ""}
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="card">
      <h3>Prototype Scope</h3>
      <p><strong>SecureDestroy / CADTS</strong> is a web-based prototype for tracking cloud and digital media asset destruction from asset registration through certificate generation.</p>
      <p>This version demonstrates user account creation, administrator role assignment, role-specific navigation, asset inventory, destruction requests, approval actions, technician evidence recording, certificate generation, CSV export, and audit logs.</p>
      <p class="muted"><strong>Important limitation:</strong> This GitHub Pages version stores users and records in the browser using localStorage. That works for a classroom demonstration on one browser, but it is not a production login system. A real multi-user deployment needs hosted authentication, a database, access-control rules, encrypted evidence storage, and append-only audit logs.</p>
    </div>

    <div class="card">
      <h3>Recommended Production Architecture</h3>
      <div class="workflow">
        <div class="step"><strong>Web UI</strong><span class="muted">React, Vue, or standard HTML/CSS/JS interface.</span></div>
        <div class="step"><strong>Auth</strong><span class="muted">Real login, password reset, and session management.</span></div>
        <div class="step"><strong>Database</strong><span class="muted">Shared users, assets, requests, roles, approvals, and audit records.</span></div>
        <div class="step"><strong>Evidence Storage</strong><span class="muted">Encrypted files, screenshots, logs, and vendor certificates.</span></div>
        <div class="step"><strong>RBAC</strong><span class="muted">Role-based access and separation of duties.</span></div>
        <div class="step"><strong>Audit Controls</strong><span class="muted">Immutable logging and compliance reporting.</span></div>
      </div>
    </div>
  `;
}

function bindViewEvents() {
  const assetForm = document.getElementById("assetForm");
  if (assetForm) {
    assetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(assetForm);
      const asset = {
        id: nextId("AST", state.assets),
        name: form.get("name"),
        type: form.get("type"),
        owner: form.get("owner"),
        classification: form.get("classification"),
        location: form.get("location"),
        status: "Active",
        created: today()
      };
      state.assets.unshift(asset);
      logAction("Asset Registered", `${asset.id} registered: ${asset.name}.`);
      saveState();
      toast(`Asset ${asset.id} registered.`);
      render();
    });
  }

  const requestForm = document.getElementById("requestForm");
  if (requestForm) {
    requestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(requestForm);
      const currentUser = getCurrentUser();
      const request = {
        id: nextId("REQ", state.requests),
        assetId: form.get("assetId"),
        requester: form.get("requester"),
        requesterUserId: currentUser.id,
        reason: form.get("reason"),
        method: form.get("method"),
        priority: form.get("priority"),
        status: "Pending Approval",
        approver: "Security Manager",
        technician: "IT Technician",
        dueDate: form.get("dueDate"),
        created: today(),
        evidence: [],
        certificateId: ""
      };
      state.requests.unshift(request);
      const asset = getAsset(request.assetId);
      if (asset) asset.status = "Pending Destruction";
      logAction("Request Submitted", `${request.id} submitted for ${request.assetId}.`);
      saveState();
      toast(`Request ${request.id} submitted for approval.`);
      render();
    });
  }

  document.querySelectorAll("[data-approve]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = state.requests.find((item) => item.id === button.dataset.approve);
      if (!request) return;
      request.status = "Approved - Pending Technician";
      request.approver = getCurrentUser().name;
      const asset = getAsset(request.assetId);
      if (asset) asset.status = "Approved for Destruction";
      logAction("Request Approved", `${request.id} approved for ${request.assetId}.`);
      saveState();
      toast(`${request.id} approved and sent to technician queue.`);
      render();
    });
  });

  document.querySelectorAll("[data-reject]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = state.requests.find((item) => item.id === button.dataset.reject);
      if (!request) return;
      request.status = "Rejected";
      request.approver = getCurrentUser().name;
      const asset = getAsset(request.assetId);
      if (asset) asset.status = "Active";
      logAction("Request Rejected", `${request.id} rejected for ${request.assetId}.`);
      saveState();
      toast(`${request.id} rejected.`);
      render();
    });
  });

  const evidenceForm = document.getElementById("evidenceForm");
  if (evidenceForm) {
    evidenceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(evidenceForm);
      const request = state.requests.find((item) => item.id === form.get("requestId"));
      if (!request) return;
      const evidence = {
        type: form.get("type"),
        fileName: form.get("fileName"),
        description: form.get("description"),
        added: timestamp()
      };
      request.evidence.push(evidence);
      request.status = "Completed";
      request.completed = timestamp();
      request.technician = getCurrentUser().name;
      request.certificateId = nextId("CERT", state.requests.map((r) => ({ id: r.certificateId || "CERT-0000" })));
      const asset = getAsset(request.assetId);
      if (asset) asset.status = "Destroyed";
      logAction("Destruction Completed", `${request.id} completed for ${request.assetId}; certificate ${request.certificateId} generated.`);
      saveState();
      toast(`${request.id} completed and certificate ${request.certificateId} generated.`);
      render();
    });
  }

  const createUserForm = document.getElementById("adminCreateUserForm");
  if (createUserForm) {
    createUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(createUserForm);
      const email = String(form.get("email") || "").trim().toLowerCase();
      if (state.users.some((user) => user.email.toLowerCase() === email)) {
        alert("That email already exists.");
        return;
      }
      const user = {
        id: nextId("USR", state.users),
        name: String(form.get("name") || "").trim(),
        email,
        password: String(form.get("password") || ""),
        role: form.get("role"),
        status: "Active",
        created: today(),
        lastLogin: ""
      };
      state.users.push(user);
      logAction("User Created", `${user.name} created by administrator as ${user.role}.`);
      saveState();
      toast(`${user.name} created as ${user.role}.`);
      render();
    });
  }

  document.querySelectorAll("[data-save-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.saveUser;
      const user = getUser(userId);
      if (!user) return;
      const role = document.querySelector(`[data-role-select="${userId}"]`).value;
      const status = document.querySelector(`[data-status-select="${userId}"]`).value;
      user.role = role;
      user.status = status;
      if (role !== "Pending Role Assignment" && status === "Pending Role Assignment") {
        user.status = "Active";
      }
      logAction("User Role Updated", `${user.name} set to ${user.role} with status ${user.status}.`);
      saveState();
      toast(`${user.name} updated.`);
      render();
    });
  });

  document.querySelectorAll("[data-delete-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const user = getUser(button.dataset.deleteUser);
      if (!user) return;
      if (!confirm(`Delete demo user ${user.name}?`)) return;
      state.users = state.users.filter((item) => item.id !== user.id);
      logAction("User Deleted", `${user.name} removed from demo user list.`);
      saveState();
      toast(`${user.name} deleted.`);
      render();
    });
  });

  document.querySelectorAll("[data-certificate]").forEach((button) => {
    button.addEventListener("click", () => showCertificate(button.dataset.certificate));
  });

  const exportRequestsBtn = document.getElementById("exportRequestsBtn");
  if (exportRequestsBtn) exportRequestsBtn.addEventListener("click", exportRequests);

  const exportAssetsBtn = document.getElementById("exportAssetsBtn");
  if (exportAssetsBtn) exportAssetsBtn.addEventListener("click", exportAssets);
}

function showCertificate(requestId) {
  const request = state.requests.find((item) => item.id === requestId);
  const asset = getAsset(request?.assetId);
  if (!request || !asset) return;

  const evidenceList = (request.evidence || [])
    .map((item) => `<li>${escapeHtml(item.type)}: ${escapeHtml(item.fileName)} - ${escapeHtml(item.description)}</li>`)
    .join("");

  document.getElementById("modalContent").innerHTML = `
    <div class="certificate">
      <h2>Certificate of Destruction</h2>
      <p class="muted" style="text-align:center;">Cloud Asset Destruction Tracking System</p>
      <div class="seal">CADTS</div>
      <p>This certificate confirms that the asset listed below has been recorded as destroyed or sanitized in the SecureDestroy CADTS workflow.</p>
      <table>
        <tbody>
          <tr><th>Certificate ID</th><td>${escapeHtml(request.certificateId)}</td></tr>
          <tr><th>Request ID</th><td>${escapeHtml(request.id)}</td></tr>
          <tr><th>Asset ID</th><td>${escapeHtml(asset.id)}</td></tr>
          <tr><th>Asset Name</th><td>${escapeHtml(asset.name)}</td></tr>
          <tr><th>Classification</th><td>${escapeHtml(asset.classification)}</td></tr>
          <tr><th>Location</th><td>${escapeHtml(asset.location)}</td></tr>
          <tr><th>Destruction Method</th><td>${escapeHtml(request.method)}</td></tr>
          <tr><th>Approved By</th><td>${escapeHtml(request.approver)}</td></tr>
          <tr><th>Completed By</th><td>${escapeHtml(request.technician)}</td></tr>
          <tr><th>Completion Date</th><td>${escapeHtml(request.completed)}</td></tr>
        </tbody>
      </table>
      <h3>Evidence Attached</h3>
      <ul>${evidenceList || "<li>No evidence listed.</li>"}</ul>
      <p class="muted">Prototype certificate for academic demonstration only.</p>
      <div class="actions">
        <button onclick="window.print()">Print Certificate</button>
      </div>
    </div>
  `;
  openModal();
}

function openModal() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function rowsToCsv(rows) {
  return rows.map((row) =>
    row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")
  ).join("\n");
}

function downloadFile(fileName, text, mimeType = "text/csv") {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportAudit() {
  const rows = [["Time", "User / Role", "Action", "Details"], ...state.audit.map((event) => [event.time, event.role, event.action, event.details])];
  downloadFile("cadts-audit-log.csv", rowsToCsv(rows));
}

function exportRequests() {
  const rows = [
    ["Request ID", "Asset ID", "Requester", "Method", "Priority", "Status", "Due Date", "Evidence Count", "Certificate ID"],
    ...state.requests.map((request) => [
      request.id,
      request.assetId,
      request.requester,
      request.method,
      request.priority,
      request.status,
      request.dueDate,
      (request.evidence || []).length,
      request.certificateId
    ])
  ];
  downloadFile("cadts-requests-report.csv", rowsToCsv(rows));
}

function exportAssets() {
  const rows = [
    ["Asset ID", "Name", "Type", "Owner", "Classification", "Location", "Status", "Created"],
    ...state.assets.map((asset) => [asset.id, asset.name, asset.type, asset.owner, asset.classification, asset.location, asset.status, asset.created])
  ];
  downloadFile("cadts-assets-report.csv", rowsToCsv(rows));
}

function bindGlobalEvents() {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.getElementById("resetDemoBtn").addEventListener("click", resetState);
  document.getElementById("exportAllBtn").addEventListener("click", exportAudit);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  document.querySelectorAll("[data-close-modal]").forEach((item) => {
    item.addEventListener("click", closeModal);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  saveState();
  bindGlobalEvents();
  render();
});
