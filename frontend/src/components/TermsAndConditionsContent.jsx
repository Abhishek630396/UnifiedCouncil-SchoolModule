const communicationItems = [
  "Date and time of exam",
  "Hall Ticket Number",
  "Guidelines for appearing for the exam",
  "Link to appear for the exam",
  "Other useful information",
];

const internationalAchieversItems = [
  "All certificates, such as Certificate of Appreciation, Certificate of Scholarship, Certificate of Distinction, Certificate of Brilliance, and Certificate of Participation, are issued digitally only.",
  "All cash awards are issued in the form of cheques.",
  "International Achievers do not receive medals.",
  "Rewards are provided in the form of subscriptions and are communicated through e-mail only.",
];

function TermsAndConditionsContent() {
  return (
    <div className="space-y-5 text-sm leading-7 text-slate-700 md:text-base">
      <p className="font-bold text-slate-900">
        I agree to the Terms and Conditions for Unified Online Olympiads.
      </p>
      <p>
        Please ensure that the information filled in is complete and accurate. Any incorrect
        or false information may lead to cancellation of registration/examination. This
        information may be shared with the school for verification/authentication purposes.
      </p>
      <p>
        Once the exam begins, we seek parents&apos; impartial vigilance, support, and
        cooperation for the smooth conduct of this year&apos;s Olympiads. In the role of an
        invigilator, we trust that every parent will ensure that his/her child does not
        indulge in any unfair practices during the exam. Parents are also requested not to
        assist their child during the examination, so that the student&apos;s true potential can
        be assessed.
      </p>
      <p>
        We may allot the test date or allow you to select the test date based on the
        feasibility of participation and the number of students appearing at a time, as
        permitted by the available data.
      </p>
      <div>
        <p className="mb-3">
          The following information will be sent, as and when necessary, to all registered
          students through the SMS/E-mail provided during the registration process.
        </p>
        <ul className="space-y-2 pl-5">
          {communicationItems.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p>
        In case of non-receipt of any of the above information 10 days before the date of
        the exam, students should immediately write to exam@unifiedcouncil.com informing us
        of the same.
      </p>
      <p>
        All books are sent as e-books in PDF format through e-mail/SMS. Students can
        download them at their convenience. No hard copies will be provided.
      </p>
      <p>
        If you subscribe to the online packages of www.olympiadcoach.com along with Olympiad
        registrations, the packages will be activated within two working days from the date
        of payment. A User ID and password will be sent to your registered e-mail ID/SMS to
        access the packages.
      </p>
      <p>
        It is strongly recommended that students appear for the online exam using a Desktop
        PC, Laptop, Tablet, or Smartphone.
      </p>
      <p>
        The Desktop/Laptop/Tablet/Smartphone must have good internet connectivity, a
        connected and active webcam, and the latest version of Google Chrome. Without these
        minimum requirements, a student may not be able to appear for the exam.
      </p>
      <p>
        Students are required to read all questions silently and not aloud. The voice level
        may be randomly recorded during the exam to ensure it remains within permissible
        limits.
      </p>
      <p>A student&apos;s picture(s) may be captured randomly during the exam.</p>
      <p>
        In case of a tie in deciding a rank due to the same marks, the time taken to
        complete the test will be considered. The student who completes the test in less time
        will be awarded the higher rank.
      </p>
      <p>
        If there is a tie in the claim for a prize or award, Unified Council may decide the
        winner through a Zoom interview-exam or by any other method it deems appropriate. The
        decision of Unified Council shall be final, irrevocable, and binding on all
        claimants.
      </p>
      <p>A student will be eligible for only one award, whichever is higher in the hierarchy.</p>
      <p>
        30% TDS is applicable as per the Income Tax Act under Section 194B on all cash
        awards above 10000/-.
      </p>
      <div>
        <h3 className="font-bold text-slate-900">International Achievers, please note:</h3>
        <ul className="mt-3 space-y-2 pl-5">
          {internationalAchieversItems.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">Exam Schedule & Re-scheduling Policy</h3>
        <p className="mt-3">
          Students are required to appear for the examination strictly as per the Unified
          Olympiads schedule. Once the scheduled exam window has concluded, re-scheduling
          will not be permitted under any circumstances, as it may affect the integrity of
          the examination and timely declaration of results. Parents are therefore requested
          to carefully review the exam dates before completing registration.
        </p>
      </div>
      <p>This year, all Olympiads will be conducted in one level only.</p>
      <p>
        Individual digital certificates and SPR will be made available digitally to every
        participating student for download.
      </p>
      <p>
        In case of suspected use of unfair means during the exam, tampering, or any
        malpractice in single or multiple instances, Unified Council reserves the right to
        cancel the exam at the individual and/or multiple levels as it deems appropriate. No
        marks, certificates, or fee refunds will be provided in such cases. The decision of
        Unified Council in all matters shall be final and binding.
      </p>
      <p>
        If the dates and timings of any Olympiad are changed, students will be informed in
        advance.
      </p>
      <p>
        We look forward to wholehearted support from parents in making the younger generation
        fundamentally stronger and more competitive, in their own interest.
      </p>
      <p>
        If an exam is conducted on two dates, a student may appear for the exam on only one
        of the two dates. If a student attempts the exam on both dates, the exam will be
        cancelled, and no result, certificate, or award will be issued.
      </p>
      <p>
        In case of any dispute or disagreement, the decision of Unified Council shall be
        final and binding on all. Any legal disputes shall be subject to the jurisdiction of
        Hyderabad courts only. The above information may be updated from time to time.
        Students, parents, and schools are advised to visit this page regularly to stay
        updated.
      </p>
      <div>
        <h3 className="font-bold text-slate-900">TDS applicable</h3>
        <p className="mt-3">
          30% TDS is applicable as per the Income Tax Act under Section 194B on all cash
          awards above 10000/-.
        </p>
      </div>
    </div>
  );
}

export default TermsAndConditionsContent;
