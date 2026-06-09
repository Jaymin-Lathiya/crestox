// Long-form content for the Integrations resource page.
// Rendered via dangerouslySetInnerHTML inside ResourcePage's .cx-content card.
export const integrationsContent = `
<h2 id="the-infrastructure-behind-crestox">The Infrastructure Behind Crestox</h2><p>Crestox connects with a carefully selected set of third-party services to deliver payments, identity verification, communications, and platform security. Every integration is chosen based on reliability, regulatory standing, and data protection standards.</p>
<p>This page explains what external systems Crestox connects with, what data is shared with each, and what that means for you as a user.</p>
<blockquote>
<p><strong>Third-Party Disclosure Notice:</strong> Crestox shares certain user data with third-party service providers solely to the extent necessary to operate the platform. All data sharing is governed by Crestox's <a href="#">Privacy Policy</a>, the applicable <a href="#">Terms of Use</a>, and the data processing agreements in place with each provider. Crestox does not sell user data to third parties. Third-party providers operate under their own terms of service and privacy policies, which are linked in the relevant sections below.</p>
</blockquote>
<hr>
<h2 id="table-of-contents">Table of Contents</h2><ol>
<li><a href="#1-payments">Payments</a></li>
<li><a href="#2-identity-amp-verification-kyc">Identity &amp; Verification (KYC)</a></li>
<li><a href="#3-communications">Communications</a></li>
<li><a href="#4-security-amp-authentication">Security &amp; Authentication</a></li>
<li><a href="#5-future-integrations">Future Integrations</a></li>
<li><a href="#6-api-ecosystem">API Ecosystem</a></li>
<li><a href="#7-data-sharing-summary">Data Sharing Summary</a></li>
</ol>
<hr>
<h2 id="1-payments">1. Payments</h2><p><strong>How Crestox processes transactions securely.</strong></p>
<p>All financial transactions on the Crestox platform — including fractal purchases, resale proceeds, and artist payouts — are processed through regulated payment infrastructure. Crestox does not store, process, or transmit payment card data directly. All sensitive payment data is handled exclusively by our payment providers in accordance with applicable Payment Card Industry (PCI-DSS) standards.</p>
<h3 id="payment-gateway">Payment Gateway</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Provider</strong></td>
<td><em>(Payment gateway partner — to be published upon commercial agreement confirmation)</em></td>
</tr>
<tr>
<td><strong>Purpose</strong></td>
<td>Processing collector purchases, secondary market transactions, and platform fee collection</td>
</tr>
<tr>
<td><strong>Data Shared</strong></td>
<td>Transaction amount, currency, user identifier, device metadata</td>
</tr>
<tr>
<td><strong>Data NOT Shared</strong></td>
<td>Full card numbers, CVV codes, bank account credentials</td>
</tr>
<tr>
<td><strong>Regulatory Standard</strong></td>
<td>PCI-DSS compliant</td>
</tr>
<tr>
<td><strong>Provider Privacy Policy</strong></td>
<td><em>(Link to be added)</em></td>
</tr>
</tbody></table>
<h3 id="payouts-amp-banking-infrastructure">Payouts &amp; Banking Infrastructure</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Provider</strong></td>
<td><em>(Banking or payout infrastructure partner — to be published upon confirmation)</em></td>
</tr>
<tr>
<td><strong>Purpose</strong></td>
<td>Processing artist and owner earnings payouts to registered bank accounts</td>
</tr>
<tr>
<td><strong>Data Shared</strong></td>
<td>Verified account holder name, bank account details (as provided by the user during KYC), payout amount</td>
</tr>
<tr>
<td><strong>Regulatory Standard</strong></td>
<td>Reserve Bank of India (RBI) compliant payment processing</td>
</tr>
<tr>
<td><strong>Provider Privacy Policy</strong></td>
<td><em>(Link to be added)</em></td>
</tr>
</tbody></table>
<blockquote>
<p><strong>Notice:</strong> Crestox processes all payments in Indian Rupees (INR). Currency conversion, international wire transfers, and cross-border payments are not currently supported. Payout timelines are governed by the terms of the relevant Artist Agreement or Owner Agreement and are subject to the processing schedules of the payout infrastructure provider. Crestox is not liable for delays caused by banking infrastructure partners.</p>
</blockquote>
<hr>
<h2 id="2-identity-amp-verification-kyc">2. Identity &amp; Verification (KYC)</h2><p><strong>How Crestox verifies users and meets regulatory obligations.</strong></p>
<p>Crestox is required to verify the identity of users who transact on the platform. This is a regulatory compliance requirement under applicable Indian financial regulations and is intended to protect the platform and its users from fraud, money laundering, and identity misrepresentation.</p>
<p>Know Your Customer (KYC) verification is mandatory for:</p>
<ul>
<li>Collectors before their first fractal purchase</li>
<li>Artists before their first payout is processed</li>
<li>Owners before artwork listings are approved</li>
<li>Curators before they are authorised to manage listings</li>
</ul>
<h3 id="kyc-provider">KYC Provider</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Provider</strong></td>
<td><em>(KYC / identity verification partner — to be published upon confirmation)</em></td>
</tr>
<tr>
<td><strong>Purpose</strong></td>
<td>Document verification, identity confirmation, liveness checks, and PAN/Aadhaar validation where applicable</td>
</tr>
<tr>
<td><strong>Data Shared</strong></td>
<td>Government-issued ID documents (as uploaded by the user), name, date of birth, address, facial biometric data (where liveness check is required)</td>
</tr>
<tr>
<td><strong>Data Retention by Provider</strong></td>
<td>Governed by the provider's data retention policy — refer to their Privacy Policy</td>
</tr>
<tr>
<td><strong>Regulatory Basis</strong></td>
<td>Prevention of Money Laundering Act (PMLA), RBI KYC directions</td>
</tr>
<tr>
<td><strong>Provider Privacy Policy</strong></td>
<td><em>(Link to be added)</em></td>
</tr>
</tbody></table>
<h3 id="what-happens-to-your-kyc-data">What Happens to Your KYC Data</h3><ul>
<li>KYC documents and verification results are stored in accordance with Crestox's <a href="#">Privacy Policy</a> and applicable legal retention requirements.</li>
<li>Crestox does not use your KYC documents for any purpose other than identity verification and regulatory compliance.</li>
<li>Verified status is recorded on your Crestox account. If your KYC is rejected, you will be notified and given the opportunity to resubmit with corrected documentation.</li>
<li>Crestox does not share KYC data with other users, artists, collectors, or third parties other than the KYC provider and, where legally required, regulatory authorities.</li>
</ul>
<blockquote>
<p><strong>Important:</strong> Failure to complete KYC will result in restricted account functionality. Specifically, collectors who have not completed KYC cannot complete fractal purchases, and artists who have not completed KYC will not receive payouts regardless of sales activity. Crestox cannot waive KYC requirements on individual request.</p>
</blockquote>
<hr>
<h2 id="3-communications">3. Communications</h2><p><strong>How Crestox sends you notifications, updates, and transactional messages.</strong></p>
<p>Crestox uses third-party communication infrastructure to deliver email notifications, in-app alerts, and transactional messages. These services are used solely to communicate platform activity to users. Crestox does not use these providers for third-party advertising or data monetisation.</p>
<h3 id="email-infrastructure">Email Infrastructure</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Provider</strong></td>
<td><em>(Email infrastructure partner — to be published upon confirmation)</em></td>
</tr>
<tr>
<td><strong>Purpose</strong></td>
<td>Transactional emails (purchase confirmations, payout notifications, submission status updates, account security alerts) and platform communications</td>
</tr>
<tr>
<td><strong>Data Shared</strong></td>
<td>Email address, user name, transaction or event reference, notification content</td>
</tr>
<tr>
<td><strong>Marketing Emails</strong></td>
<td>Sent only to users who have opted in. Opt-out is available at any time from account settings or via the unsubscribe link in any marketing email.</td>
</tr>
<tr>
<td><strong>Provider Privacy Policy</strong></td>
<td><em>(Link to be added)</em></td>
</tr>
</tbody></table>
<h3 id="push-amp-in-app-notifications">Push &amp; In-App Notifications</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Purpose</strong></td>
<td>Real-time alerts for fractal purchases, resale activity, submission status changes, and security events</td>
</tr>
<tr>
<td><strong>Control</strong></td>
<td>Notification preferences can be managed in your account settings at any time</td>
</tr>
<tr>
<td><strong>Data Shared</strong></td>
<td>Device token (anonymised), notification content, user identifier</td>
</tr>
</tbody></table>
<blockquote>
<p><strong>Transactional vs. Marketing Communications:</strong> Transactional messages — including purchase confirmations, payout receipts, KYC status updates, and security alerts — are sent to all registered users and cannot be disabled, as they are necessary for the operation of your account. Marketing and promotional communications are opt-in only.</p>
</blockquote>
<hr>
<h2 id="4-security-amp-authentication">4. Security &amp; Authentication</h2><p><strong>How Crestox protects your account and the platform.</strong></p>
<h3 id="authentication">Authentication</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Method</strong></td>
<td>Email and password authentication with mandatory two-factor authentication (2FA) for all accounts</td>
</tr>
<tr>
<td><strong>2FA Provider</strong></td>
<td>Time-based one-time passwords (TOTP) via authenticator app, or SMS OTP</td>
</tr>
<tr>
<td><strong>Session Management</strong></td>
<td>Sessions expire after a defined period of inactivity. Concurrent session limits apply.</td>
</tr>
<tr>
<td><strong>Password Storage</strong></td>
<td>Passwords are never stored in plain text. All passwords are hashed using industry-standard cryptographic methods.</td>
</tr>
</tbody></table>
<h3 id="platform-security-monitoring">Platform Security Monitoring</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Purpose</strong></td>
<td>Detection of fraudulent activity, unauthorised access attempts, unusual transaction patterns, and platform abuse</td>
</tr>
<tr>
<td><strong>Data Used</strong></td>
<td>IP address, device fingerprint, session metadata, transaction patterns</td>
</tr>
<tr>
<td><strong>User Impact</strong></td>
<td>Accounts flagged by monitoring systems may be temporarily restricted pending review. Users will be notified and given the opportunity to verify their identity.</td>
</tr>
</tbody></table>
<h3 id="data-encryption">Data Encryption</h3><table>
<thead>
<tr>
<th>Detail</th>
<th>Information</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Data in Transit</strong></td>
<td>All data transmitted between your device and Crestox servers is encrypted using TLS 1.2 or higher</td>
</tr>
<tr>
<td><strong>Data at Rest</strong></td>
<td>Sensitive user data stored on Crestox infrastructure is encrypted at rest</td>
</tr>
</tbody></table>
<blockquote>
<p><strong>Security Incident Notification:</strong> In the event of a confirmed data breach affecting your personal information, Crestox will notify affected users in accordance with applicable data protection law, including the provisions of the Digital Personal Data Protection Act, 2023 (India). For the full security policy, refer to our <a href="#">Privacy Policy</a>.</p>
</blockquote>
<hr>
<h2 id="5-future-integrations">5. Future Integrations</h2><p>Crestox is building institutional and cultural partnerships to expand the quality and depth of artwork available on the platform, and to create new onboarding pathways for artists and collectors.</p>
<p>The following categories represent integration directions under active development or consideration. These are disclosed here for transparency with enterprise partners, institutions, and developers evaluating the platform.</p>
<h3 id="galleries">Galleries</h3><table>
<thead>
<tr>
<th>Integration Type</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Commercial Gallery Partnerships</strong></td>
<td>Enable galleries to onboard their represented artists and submit artworks directly through a dedicated gallery account tier</td>
</tr>
<tr>
<td><strong>Artwork Sourcing</strong></td>
<td>Facilitate co-listing arrangements where gallery-authenticated artworks are made available for fractionalization on Crestox</td>
</tr>
</tbody></table>
<p><em>Status: Under development. No partner announcements at this time.</em></p>
<hr>
<h3 id="museums-amp-cultural-institutions">Museums &amp; Cultural Institutions</h3><table>
<thead>
<tr>
<th>Integration Type</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Collection Partnerships</strong></td>
<td>Explore fractionalization of museum-owned or deaccessioned works in compliance with applicable cultural property regulations</td>
</tr>
<tr>
<td><strong>Heritage Collaborations</strong></td>
<td>Partner with cultural institutions to bring historically significant artworks to the Crestox platform under appropriate licensing and provenance frameworks</td>
</tr>
</tbody></table>
<p><em>Status: Exploratory. Subject to regulatory, legal, and institutional approval processes.</em></p>
<blockquote>
<p><strong>Notice on Cultural Property:</strong> Any artwork sourced through institutional partnerships will be subject to the same submission review, authenticity verification, and grading process applied to all listings on Crestox. Crestox will not list artworks that are subject to unresolved repatriation claims, cultural property disputes, or export restrictions under applicable law.</p>
</blockquote>
<hr>
<h3 id="universities-amp-academic-institutions">Universities &amp; Academic Institutions</h3><table>
<thead>
<tr>
<th>Integration Type</th>
<th>Purpose</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Artist Onboarding Pipelines</strong></td>
<td>Partner with art schools and universities to create verified onboarding pathways for emerging artists, including expedited profile review</td>
</tr>
<tr>
<td><strong>Residency &amp; Grant Documentation</strong></td>
<td>Enable academic achievement records to be submitted as part of artist verification</td>
</tr>
</tbody></table>
<p><em>Status: Exploratory. Partnership terms to be developed.</em></p>
<hr>
<h3 id="enterprise-amp-investor-api-access">Enterprise &amp; Investor API Access</h3><p><em>See <a href="#6-api-ecosystem">API Ecosystem</a> below.</em></p>
<hr>
<h2 id="6-api-ecosystem">6. API Ecosystem</h2><p><strong>Programmatic access to Crestox data and functionality.</strong></p>
<h3 id="current-status">Current Status</h3><p>Crestox does not currently offer a public API. Platform data and functionality are accessible exclusively through the Crestox web and mobile applications.</p>
<h3 id="planned-private-api-access">Planned: Private API Access</h3><p>Crestox intends to release a private API for approved enterprise partners, institutional investors, and accredited developers. This is currently under development.</p>
<p>The planned API will provide:</p>
<table>
<thead>
<tr>
<th>Capability</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Read Access — Marketplace Data</strong></td>
<td>Programmatic access to approved artwork listings, fractal availability, and aggregated price data</td>
</tr>
<tr>
<td><strong>Read Access — Portfolio Data</strong></td>
<td>Access to your own fractal holdings and transaction history (scoped to the authenticated account only)</td>
</tr>
<tr>
<td><strong>Write Access — Transactions</strong></td>
<td>Fractal purchase and listing management via API, subject to the same KYC and compliance requirements as platform transactions</td>
</tr>
<tr>
<td><strong>Webhook Notifications</strong></td>
<td>Event-driven notifications for transaction completions, listing status changes, and portfolio updates</td>
</tr>
</tbody></table>
<h3 id="authentication-planned">Authentication (Planned)</h3><p>API access will use OAuth 2.0 with scoped access tokens. All API requests will require:</p>
<ul>
<li>A valid API key issued to an approved developer or enterprise account</li>
<li>Bearer token authentication on every request</li>
<li>Requests over HTTPS only — unencrypted connections will be rejected</li>
</ul>
<h3 id="developer-documentation">Developer Documentation</h3><p>Developer documentation will be published at <code>developers.crestox.com</code> at the time of API launch. Documentation will include endpoint references, authentication guides, rate limits, error codes, and code examples.</p>
<blockquote>
<p><strong>API Access Notice:</strong> Access to the Crestox API will be subject to a separate <a href="#">API Terms of Service</a> and, where applicable, a signed Data Processing Agreement. API access will not be granted to accounts that have not completed KYC verification. Crestox reserves the right to revoke API access for violation of the API Terms of Service, platform misuse, or security concerns, with or without prior notice depending on the nature of the violation.</p>
</blockquote>
<hr>
<h2 id="7-data-sharing-summary">7. Data Sharing Summary</h2><p>A consolidated reference of all third-party data sharing in one place.</p>
<table>
<thead>
<tr>
<th>Provider Category</th>
<th>Data Shared</th>
<th>Purpose</th>
<th>User Can Opt Out?</th>
</tr>
</thead>
<tbody><tr>
<td>Payment Gateway</td>
<td>Transaction amount, user ID, device metadata</td>
<td>Process fractal purchases and fees</td>
<td>No — required to transact</td>
</tr>
<tr>
<td>Payout Infrastructure</td>
<td>Account holder name, bank details, payout amount</td>
<td>Deliver artist and owner earnings</td>
<td>No — required to receive payouts</td>
</tr>
<tr>
<td>KYC / Identity Verification</td>
<td>Government ID, name, DOB, address, biometric (liveness)</td>
<td>Regulatory identity verification</td>
<td>No — required to transact</td>
</tr>
<tr>
<td>Email Infrastructure</td>
<td>Email address, notification content</td>
<td>Transactional and opted-in marketing emails</td>
<td>Partial — marketing only</td>
</tr>
<tr>
<td>Security Monitoring</td>
<td>IP address, device fingerprint, session data</td>
<td>Fraud detection and platform security</td>
<td>No — required for platform integrity</td>
</tr>
<tr>
<td>Push Notifications</td>
<td>Device token, notification content</td>
<td>Real-time platform alerts</td>
<td>Yes — via account settings</td>
</tr>
</tbody></table>
<blockquote>
<p>For full details on data collection, retention, and your rights as a data subject under the Digital Personal Data Protection Act, 2023, refer to the <a href="#">Privacy Policy</a>.</p>
</blockquote>
<hr>
<h2 id="questions-about-integrations-or-data-sharing">Questions About Integrations or Data Sharing?</h2><p>If you have questions about how Crestox uses third-party services or how your data is handled, contact us:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:privacy@crestox.com">privacy@crestox.com</a></li>
<li><strong>Help Centre:</strong> <a href="#">help.crestox.com</a></li>
<li><strong>Response Time:</strong> Within 5 business days for data-related queries</li>
</ul>
<p>To submit a formal data access, correction, or deletion request, use the process described in the <a href="#">Privacy Policy</a>.</p>
<hr>
<p><em>Last updated: June 2026</em>
<em>Integration details, provider names, and API specifications are subject to change. This page will be updated as partnerships are confirmed and new integrations are launched.</em></p>
`;
