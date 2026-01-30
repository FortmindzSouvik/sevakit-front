
const SharingInformationComponent = () => {
  return (
    <div>
      <p>
        We share your Personal Information as necessary to provide the Services,
        including with our dietitian and, if and as when applicable, to others.
        We also share your Personal Information with third-party vendors who
        provide services necessary for the intended use of our Services. Below
        is a current list (subject to change) of such third-party vendors:
      </p>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Third Party
            </th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Use of Data
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>AWS</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              Backend Services
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              Microsoft
            </td>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              For communicating with you
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        We will not otherwise disclose your Personal Information to any third
        party except as necessary for a legitimate use as described in this
        Policy, in connection with a bona fide legal dispute (where the
        information is relevant and in response to a valid, compulsory legal
        process), or as otherwise required by law.
      </p>
      <p>
        We do not sell, trade, share, or rent your Personal Information to
        unaffiliated third parties.
      </p>
      <p>
        In the event of a merger, acquisition, bankruptcy, or other sale or
        disposition of all or a portion of Seva Healthcare IT LLC assets, we may
        disclose Personal Information to the acquiring party(s). In that case,
        the successor’s use of your Personal Information will continue to be
        subject to this Policy unless a court orders otherwise or the successor
        provides notice that your Personal Information will be subject to their
        own privacy policy. If you submit any Personal Information after such a
        transfer, that information will be subject to the successor’s privacy
        policy.
      </p>
    </div>
  );
};

export default SharingInformationComponent;
