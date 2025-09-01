import { parseDMARCAggregateXML } from '../parser';

const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<feedback>
  <report_metadata>
    <org_name>example.net</org_name>
    <report_id>rep-2025-08-27-0001</report_id>
    <date_range>
      <begin>1727308800</begin>
      <end>1727395200</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>sigmacode.ai</domain>
    <adkim>r</adkim>
    <aspf>r</aspf>
    <p>none</p>
  </policy_published>
  <record>
    <row>
      <source_ip>203.0.113.9</source_ip>
      <count>2</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>sigmacode.ai</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>sigmacode.ai</domain>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>sigmacode.ai</domain>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
</feedback>`;

describe('parseDMARCAggregateXML', () => {
  it('parses a minimal valid aggregate report', () => {
    const parsed = parseDMARCAggregateXML(sampleXML);
    const meta = parsed.feedback.report_metadata;
    const policy = parsed.feedback.policy_published;
    const recordsRaw = parsed.feedback.record;
    const records = Array.isArray(recordsRaw) ? recordsRaw : recordsRaw ? [recordsRaw] : [];

    expect(meta?.org_name).toBe('example.net');
    expect(meta?.report_id).toBe('rep-2025-08-27-0001');
    expect(policy?.domain).toBe('sigmacode.ai');
    expect(records.length).toBeGreaterThanOrEqual(1);
    const r0 = records[0];
    expect(r0.row?.source_ip).toBe('203.0.113.9');
    expect(r0.row?.count).toBe(2);
    expect(r0.row?.policy_evaluated?.disposition).toBe('none');
    expect(r0.row?.policy_evaluated?.dkim).toBe('pass');
    expect(r0.row?.policy_evaluated?.spf).toBe('pass');
    expect(r0.identifiers?.header_from).toBe('sigmacode.ai');
  });

  it('throws on invalid xml', () => {
    expect(() => parseDMARCAggregateXML('<not-xml>')).toThrow();
  });
});
