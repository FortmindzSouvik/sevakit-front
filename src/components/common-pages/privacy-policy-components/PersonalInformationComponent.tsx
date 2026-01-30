const PersonalInformationComponent = () => {
  return (
    <div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[900px]">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Examples</th>
                <th className="text-left p-3 font-medium whitespace-nowrap">
                  Collected (Yes/No)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Contact information",
                  "Name, email address, phone number, billing and mailing address, and zip code",
                  "Yes",
                ],
                [
                  "Identifiers",
                  ` This may include your username, IP address, online identifiers,
                online advertising identifiers, and device identifiers or serial
                numbers`,
                  "Yes",
                ],
                [
                  "Personal characteristics or traits",
                  `This includes demographic data, including those regarding
                characteristics protected by law, gender, and physical
                characteristics or description`,
                  "Yes",
                ],
                [
                  "Commercial Information",
                  `Payment account details/services purchased, obtained, or
                considered, and/or other purchasing or consuming histories or
                tendencies`,
                  "Yes",
                ],
                [
                  "Internet/Network Information",
                  ` This includes browsing history, search history, usage
                information, information regarding a consumer's interaction with
                our site, app, or advertisement`,
                  "Yes",
                ],
                [
                  "Geolocation Data",
                  `This may include your approximate geolocation`,
                  "Yes",
                ],
                [
                  "Audio, electronic, visual, or similar information",
                  `This includes audio recordings of customer service calls`,
                  "Yes",
                ],
                [
                  "Health-related data",
                  `Such health information as necessary to properly provide the
                services, including but not limited to blood glucose data,
                diabetes status, and pre-existing conditions`,
                  "Yes",
                ],
                [
                  "Legally Protected Classifications",
                  `Age and/or sex (including gender, pregnancy, and other related
                conditions)`,
                  "Yes",
                ],
                [
                  "Biometric Information",
                  `Physiological, behavioral, and biological characteristics or
                activity patterns used to extract a similar identifier`,
                  "Yes",
                ],
                [
                  "User generated content",
                  `This includes any content or material you publish, post, or
                submit to us, such as photos and videos`,
                  "Yes",
                ],
                [
                  "Contact information ",
                  `Name, email address, phone number, billing and mailing address, and zip code`,
                  "Yes",
                ],
                [
                  "Identifiers ",
                  `This may include your username, IP address, online identifiers, online advertising identifiers, and device identifiers or serial numbers `,
                  "Yes",
                ],
              ].map(([title, desc, collected], index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 align-top font-medium">{title}</td>
                  <td className="p-3 align-top wrap-break-words">{desc}</td>
                  <td className="p-3 align-top">{collected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PersonalInformationComponent;
