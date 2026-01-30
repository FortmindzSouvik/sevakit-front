
const SourcesOfPersonalInformationComponent = () => {
  return (
    <div>
      <p>
        We may collect your personal information directly from you, from other
        parties, or from you indirectly through cookies and other technologies,
        including through the following sources:
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sources</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Directly from you</td>
              <td>
                When you: <br />
                1) Create a user account for our Services, or complete one of
                our questionnaires. <br />
                2) Provide information via our App. <br />
                3) Upload test results into <strong>Mykitbuddy</strong>. <br />
                4) Communicate with <strong>Mykitbuddy</strong> via interactive
                means.
              </td>
            </tr>
            <tr>
              <td>Indirectly from you</td>
              <td>
                For example, through inferences we make from information we
                collect from you while providing our Services to you.
              </td>
            </tr>
            <tr>
              <td>
                Directly and indirectly from integrations permitted by you
              </td>
              <td>
                For example, from App usage details that are collected
                automatically. For example, if you enable integration with Apple
                Health, Google Fit, and third-party Device for example permitted
                CGM data - We will have access to such data as shared by those
                apps.
              </td>
            </tr>
            <tr>
              <td>Automatically through Cookies and Other Technologies</td>
              <td>
                When you visit our Site or use our Services, this data may
                include your IP address, the date and time of your visit, your
                location, the pages and other content that you access, and the
                number of times you return to the Site. Collection may be
                performed by us or software and tools from third parties. We
                collect this information by using technologies such as: <br />
                <br />
                1) <strong>Log Files:</strong> A log file is a text file that
                resides on our servers, and which records relevant information
                about your interactions with our Services at the time of access.{" "}
                <br />
                2) <strong>Cookies:</strong> A cookie is a small data file that
                resides on your device, allowing us to identify your device and
                store certain information on your device. Log file data is used
                to enhance your experience when visiting our Site, such as
                ensuring that web browser settings work as intended for your
                device. You can configure your web browser to disable the use of
                embedded scripts. <br />
                3) <strong>Embedded Scripts:</strong> An embedded script is
                programming code (particularly JavaScript) that collects
                information about your interactions with our Site. The code is
                temporarily downloaded onto your device and is deactivated or
                deleted when you disconnect from our Site. <br />
                4) <strong>Pixels:</strong> Our website uses tracking pixels to
                collect information about your interactions with our site and
                emails. This helps us analyze site usage, personalize your
                experience, and enhance our marketing efforts. <br />
                5) We may also use other technologies to collect information for
                security and fraud prevention purposes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The information that you provide in each case will vary. Please provide
        relevant and specific information. If you provide any additional
        Personal Information beyond what we require, doing so is entirely your
        choice when communicating with us, and it will be at your own risk. We
        may retain the Personal Information that you choose to provide in those
        instances.
      </p>
    </div>
  );
};

export default SourcesOfPersonalInformationComponent;
