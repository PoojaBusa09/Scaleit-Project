# Security, Compliance & Access Control

## 1. Security First Mindset
We deal with sensitive corporate strategy and financial data. Security is not an addon; it is the foundation.

## 2. Compliance Standards
*   **SOC 2 Type II**: The target compliance standard for Enterprise Sales.
    *   *Requirement*: Audit logs for every data access.
    *   *Requirement*: Encrypted backups.
*   **GDPR / CCPA**:
    *   *Right to be Forgotten*: Automated script to hard-delete user data and scrub PII from logs.
    *   *Data Residency*: Architecture supports deploying distinct clusters in EU (Frankfurt) vs US (Virginia) if needed.

## 3. RBAC Matrix (Role-Based Access Control)
The system uses a granular permission bitmask.

| Feature / Action | Super Admin (SA) | PGN Staff (AM) | Mentor (M) | Client CEO (EC) | Client Team (STM) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Manage Billing** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **View All Tenants** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Assign Mentor** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create Rock** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Delete Rock** | ✅ | ✅ | ✅ | ✅ | Own Only |
| **View Financials** | ✅ | ❌ | ✅ (Assigned) | ✅ | ❌ (Configurable) |
| **Run Meeting** | ✅ | ❌ | ✅ | ✅ | ✅ |

*   **Configurable permission**: The CEO can toggle "Show Financials to Team" in settings.

## 4. Application Security Implementation

### 4.1. Authentication (Auth0 / Cognito)
*   Do not roll our own crypto. Use OIDC (OpenID Connect).
*   **MFA (Multi-Factor Auth)**: Enforced for all Admin and Mentor accounts. Optional for Clients.

### 4.2. API Security
*   **JWT Validation**: Every request is checked for valid signature.
*   **Scope Checks**: Decorators like `@Roles('ADMIN')` or `@Permissions('read:finance')` on every Controller method.

### 4.3. Data Protection
*   **At Rest**: AES-256 Encryption on EBS volumes and RDS.
*   **In Transit**: TLS 1.3 (HTTPS) only. HSTS Enabled.
*   **Secrets**: No API Keys in code. Use **AWS Secrets Manager** or **HashiCorp Vault**.

## 5. Vulnerability Management
*   **SCA (Software Composition Analysis)**: `npm audit` runs in CI pipeline to block packages with CVEs.
*   **SAST (Static Analysis)**: SonarQube scans for code smells (SQL Injection risks).
*   **Penetration Testing**: Annual 3rd party audit.
