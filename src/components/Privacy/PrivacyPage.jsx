import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, businessApplicationSchema, organizationSchema, localBusinessSchema } from '../../utils/seoSchemas';
import './PrivacyPage.css';

const PrivacyPage = () => (
  <main className="privacy-page">
    <Seo
      title="Privacy Policy | Leading Trading Est Bahrain"
      description="Privacy policy for Leading Trading Est website enquiries, quotation requests, RFQ attachments, careers submissions, portal access, backups, and business contact handling in Bahrain."
      canonicalPath="/privacy"
      keywords="Leading Trading Est privacy policy, LTE Bahrain data privacy, Bahrain RFQ privacy, medical supplier privacy policy"
      structuredData={[
        organizationSchema,
        localBusinessSchema,
        businessApplicationSchema,
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]),
      ]}
    />
    <section className="privacy-shell">
      <span className="privacy-eyebrow">Leading Trading Est Website Policy</span>
      <h1>Leading Trading Est Privacy Policy</h1>
      <p>
        Leading Trading Est is the official business website and operations app for public supply enquiries,
        quotation requests, staff, admin, catalog, backup, and business operations workflows. The company uses website
        forms to receive business enquiries, quotation requests, RFQ documents, careers submissions, and support
        messages. The information is used only to review the request, respond to the sender, prepare quotations,
        coordinate product availability, manage internal operations, or evaluate a submitted career profile.
      </p>

      <div className="privacy-grid">
        <article>
          <h2>Information Collected</h2>
          <p>
            Forms may collect name, email, phone, company or facility name, product requirement context, quantity,
            urgency, preferred contact method, message content, and optional RFQ attachments such as PDF, spreadsheet,
            or document files. Technical data such as browser user agent and IP address may be logged for security,
            spam prevention, and audit purposes.
          </p>
        </article>
        <article>
          <h2>How Information Is Used</h2>
          <p>
            Submitted information is used to contact the requester, verify product or service requirements, prepare
            quotations, coordinate follow-up, and maintain an internal record of procurement communication. Website
            submissions are not sold or used for unrelated advertising lists.
          </p>
        </article>
        <article>
          <h2>RFQ Attachments</h2>
          <p>
            Optional RFQ attachments are restricted to common business document formats and are forwarded to the
            relevant LTE team for review. Upload validation is used to reduce unsafe file types and protect the enquiry
            workflow.
          </p>
        </article>
        <article>
          <h2>Portal Access</h2>
          <p>
            Staff and admin portal records may include account details, role information, attendance records, client
            visits, orders, messages, notifications, and audit activity required to operate the business. Access is
            limited to authorized Leading Trading Est users.
          </p>
        </article>
        <article>
          <h2>Google Drive Backup Access</h2>
          <p>
            If Leading Trading Est connects to Google Drive for backup operations, Google access is used only to
            create, read, or manage business backup archives in the configured Leading Trading Est Drive folder. Google
            Drive data is not sold, used for advertising, or shared outside the operational backup workflow.
          </p>
        </article>
        <article>
          <h2>Retention And Contact</h2>
          <p>
            Enquiry records may be retained while the business request remains active and for reasonable operational
            record keeping. To request correction or removal of submitted website information, contact
            admin@lte-bh.com.
          </p>
        </article>
      </div>
    </section>
  </main>
);

export default PrivacyPage;
