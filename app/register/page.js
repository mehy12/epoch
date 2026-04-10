"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CollegeCombobox from "@/components/ui/college-combobox";
import { collegeOptions } from "@/lib/college-options";

const smoothEase = [0.22, 1, 0.36, 1];

const trackOptions = [
  "AI for Social Good",
  "Sustainability Goals",
  "Cybersecurity & Blockchain",
];

const yearOptions = ["1st", "2nd", "3rd", "4th"];

const sectionSteps = [
  { id: "team-info", label: "Team Info" },
  { id: "team-leader", label: "Team Leader" },
  { id: "team-members", label: "Team Members" },
  { id: "declaration", label: "Declaration" },
];

function emptyMember() {
  return {
    fullName: "",
    email: "",
    usn: "",
    ieeeId: "",
    department: "",
    yearOfStudy: "",
  };
}

function initialFormData() {
  return {
    teamInfo: {
      teamName: "",
      track: "",
      teamSize: "2",
    },
    leader: {
      fullName: "",
      email: "",
      mobile: "",
      collegeName: "",
      collegeManual: false,
      department: "",
      yearOfStudy: "",
      usn: "",
      ieeeId: "",
    },
    members: {
      2: emptyMember(),
      3: emptyMember(),
      4: emptyMember(),
    },
    declaration: {
      infoAccurate: false,
      agreeTerms: false,
    },
  };
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhoneValid(value) {
  return /^\+?[0-9]{10,15}$/.test(value.trim());
}

async function checkDuplicateLeaderRegistration({ email, mobile }) {
  const response = await fetch("/api/register/check-duplicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      phone: mobile,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Could not validate registration uniqueness.");
  }

  return payload;
}

export default function RegisterPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionSteps[0].id);

  const sectionRefs = useRef({});

  const teamSize = Number(formData.teamInfo.teamSize);
  const activeStepIndex = sectionSteps.findIndex((step) => step.id === activeSection);
  const visibleMemberIndexes = useMemo(
    () => Array.from({ length: Math.max(teamSize - 1, 0) }, (_, idx) => idx + 2),
    [teamSize]
  );

  useEffect(() => {
    const sections = sectionSteps
      .map((step) => sectionRefs.current[step.id])
      .filter(Boolean);

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (inView?.target?.id) {
          setActiveSection(inView.target.id);
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.2, 0.4, 0.65],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getError = (path) => (submitAttempted ? errors[path] : "");

  const getSectionIdForError = (path) => {
    if (!path) {
      return "team-info";
    }

    if (path.startsWith("teamInfo.")) {
      return "team-info";
    }

    if (path.startsWith("leader.")) {
      return "team-leader";
    }

    if (path.startsWith("members.")) {
      return "team-members";
    }

    if (path.startsWith("declaration.")) {
      return "declaration";
    }

    return "team-info";
  };

  const getFieldIdForError = (path) => {
    if (!path) {
      return null;
    }

    const directMap = {
      "teamInfo.teamName": "teamName",
      "teamInfo.track": "track",
      "teamInfo.teamSize": "teamSize",
      "leader.fullName": "leaderFullName",
      "leader.email": "leaderEmail",
      "leader.mobile": "leaderMobile",
      "leader.collegeName": "leaderCollegeName",
      "leader.department": "leaderDepartment",
      "leader.yearOfStudy": "leaderYearOfStudy",
      "leader.usn": "leaderUsn",
      "leader.ieeeId": "leaderIeeeId",
      "declaration.infoAccurate": "declarationInfoAccurate",
      "declaration.agreeTerms": "declarationAgreeTerms",
    };

    if (directMap[path]) {
      return directMap[path];
    }

    const memberMatch = path.match(/^members\.(\d+)\.(.+)$/);
    if (!memberMatch) {
      return null;
    }

    const memberNumber = memberMatch[1];
    const field = memberMatch[2];
    const suffixMap = {
      fullName: "FullName",
      email: "Email",
      usn: "Usn",
      ieeeId: "IeeeId",
      department: "Department",
      yearOfStudy: "YearOfStudy",
    };

    const suffix = suffixMap[field];
    if (!suffix) {
      return null;
    }

    return `member${memberNumber}${suffix}`;
  };

  const validateForm = (data) => {
    const next = {};

    if (!data.teamInfo.teamName.trim()) {
      next["teamInfo.teamName"] = "Team name is required.";
    }

    if (!trackOptions.includes(data.teamInfo.track)) {
      next["teamInfo.track"] = "Choose a valid track.";
    }

    if (!["2", "3", "4"].includes(data.teamInfo.teamSize)) {
      next["teamInfo.teamSize"] = "Team size must be 2, 3, or 4.";
    }

    if (!data.leader.fullName.trim()) {
      next["leader.fullName"] = "Leader full name is required.";
    }

    if (!isEmailValid(data.leader.email)) {
      next["leader.email"] = "Enter a valid leader email address.";
    }

    if (!isPhoneValid(data.leader.mobile)) {
      next["leader.mobile"] = "Enter a valid mobile number (10-15 digits).";
    }

    if (!data.leader.collegeName.trim()) {
      next["leader.collegeName"] = "College name is required.";
    }

    if (!data.leader.department.trim()) {
      next["leader.department"] = "Department is required.";
    }

    if (!yearOptions.includes(data.leader.yearOfStudy)) {
      next["leader.yearOfStudy"] = "Choose the year of study.";
    }

    if (!data.leader.usn.trim()) {
      next["leader.usn"] = "USN / College ID is required.";
    }

    for (let memberNumber = 2; memberNumber <= Number(data.teamInfo.teamSize); memberNumber += 1) {
      const member = data.members[memberNumber];
      const base = `members.${memberNumber}`;

      if (!member.fullName.trim()) {
        next[`${base}.fullName`] = `Member ${memberNumber} full name is required.`;
      }

      if (!isEmailValid(member.email)) {
        next[`${base}.email`] = `Member ${memberNumber} email is invalid.`;
      }

      if (!member.usn.trim()) {
        next[`${base}.usn`] = `Member ${memberNumber} USN / College ID is required.`;
      }

      if (!member.department.trim()) {
        next[`${base}.department`] = `Member ${memberNumber} department is required.`;
      }

      if (!yearOptions.includes(member.yearOfStudy)) {
        next[`${base}.yearOfStudy`] = `Member ${memberNumber} year of study is required.`;
      }
    }

    if (!data.declaration.infoAccurate) {
      next["declaration.infoAccurate"] = "Confirm that the information is accurate.";
    }

    if (!data.declaration.agreeTerms) {
      next["declaration.agreeTerms"] = "You must agree to the EPOCH '26 terms and conditions.";
    }

    return next;
  };

  useEffect(() => {
    if (!submitAttempted) {
      return;
    }

    setErrors(validateForm(formData));
  }, [formData, submitAttempted]);

  const sectionMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.5, ease: smoothEase },
      };

  const updateTeamInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      teamInfo: {
        ...prev.teamInfo,
        [field]: value,
      },
    }));
  };

  const updateLeader = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
      },
    }));
  };

  const updateMember = (memberNumber, field, value) => {
    setFormData((prev) => ({
      ...prev,
      members: {
        ...prev.members,
        [memberNumber]: {
          ...prev.members[memberNumber],
          [field]: value,
        },
      },
    }));
  };

  const updateDeclaration = (field, checked) => {
    setFormData((prev) => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [field]: checked,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmitError("");

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorPath = Object.keys(nextErrors)[0];
      const targetSectionId = getSectionIdForError(firstErrorPath);
      const sectionNode = sectionRefs.current[targetSectionId];

      if (sectionNode) {
        sectionNode.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
        setActiveSection(targetSectionId);
      }

      window.requestAnimationFrame(() => {
        const explicitFieldId = getFieldIdForError(firstErrorPath);
        const explicitField = explicitFieldId ? document.getElementById(explicitFieldId) : null;

        if (explicitField && typeof explicitField.focus === "function") {
          explicitField.focus({ preventScroll: true });
          return;
        }

        if (!sectionNode) {
          return;
        }

        const fallbackField = sectionNode.querySelector(
          "input.is-invalid, select.is-invalid, textarea.is-invalid, .register-checkitem.is-invalid input[type='checkbox']"
        );

        if (fallbackField && typeof fallbackField.focus === "function") {
          fallbackField.focus({ preventScroll: true });
        }
      });

      return;
    }

    try {
      setIsSubmitting(true);

      const duplicateCheck = await checkDuplicateLeaderRegistration({
        email: formData?.leader?.email,
        mobile: formData?.leader?.mobile,
      });

      if (duplicateCheck?.exists) {
        const duplicateErrors = {};

        if (duplicateCheck.matchesEmail) {
          duplicateErrors["leader.email"] = "This email is already registered.";
        }

        if (duplicateCheck.matchesPhone) {
          duplicateErrors["leader.mobile"] = "This mobile number is already registered.";
        }

        setErrors((prev) => ({
          ...prev,
          ...duplicateErrors,
        }));

        const duplicateIdSuffix = duplicateCheck?.teamId
          ? ` Existing Team ID: ${duplicateCheck.teamId}.`
          : "";

        setSubmitError(
          `This leader email/mobile is already registered. Please use the existing registration.${duplicateIdSuffix}`
        );

        const leaderSection = sectionRefs.current["team-leader"];
        if (leaderSection) {
          leaderSection.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
          });
          setActiveSection("team-leader");
        }

        return;
      }

      window.sessionStorage.setItem("epoch-registration-draft", JSON.stringify(formData));
      router.push("/register/payment");
    } catch (error) {
      setSubmitError(error.message || "Could not move to payment step. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationMessages = submitAttempted ? Object.values(errors) : [];
  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="bg-glow bg-glow-one" aria-hidden="true" />
      <div className="bg-glow bg-glow-two" aria-hidden="true" />

      <main className="register-page-shell">
        <section className="register-page-content">
          <div className="register-intro">
            <a className="register-back" href="/">
              Back to Home
            </a>
            <p className="section-label">EPOCH '26</p>
            <h1>Registration Form</h1>
            <p className="register-intro-copy">
              Complete all required sections to register your team for EPOCH '26.
            </p>
          </div>

          <nav className="register-progress" aria-label="Registration section progress">
            {sectionSteps.map((step, index) => {
              const isActive = activeStepIndex === index;
              const isCompleted = activeStepIndex > index;

              return (
                <button
                  key={step.id}
                  type="button"
                  className={`register-progress-step${isActive ? " is-active" : ""}${
                    isCompleted ? " is-complete" : ""
                  }`}
                  onClick={() => {
                    const section = sectionRefs.current[step.id];
                    if (section) {
                      section.scrollIntoView({
                        behavior: reduceMotion ? "auto" : "smooth",
                        block: "start",
                      });
                    }
                    setActiveSection(step.id);
                  }}
                >
                  <span className="register-progress-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="register-progress-label">{step.label}</span>
                </button>
              );
            })}
          </nav>

          <form className="register-form" noValidate onSubmit={handleSubmit}>
            {validationMessages.length > 0 ? (
              <div className="register-error-summary" role="alert" aria-live="polite">
                <p>Please fix the highlighted fields before submitting.</p>
                <ul>
                  {validationMessages.map((message, index) => (
                    <li key={`${message}-${index}`}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <motion.section
              id="team-info"
              className="register-section"
              ref={(node) => {
                sectionRefs.current["team-info"] = node;
              }}
              onFocusCapture={() => setActiveSection("team-info")}
              {...sectionMotion}
            >
              <h2 className="register-section-title">Section 1 - Team Info</h2>
              <div className="register-grid register-grid-three">
                <div className="register-field">
                  <label className="register-label" htmlFor="teamName">
                    Team Name <span className="register-required">*</span>
                  </label>
                  <input
                    id="teamName"
                    className={`register-control${getError("teamInfo.teamName") ? " is-invalid" : ""}`}
                    type="text"
                    value={formData.teamInfo.teamName}
                    onChange={(event) => updateTeamInfo("teamName", event.target.value)}
                    aria-invalid={Boolean(getError("teamInfo.teamName"))}
                    aria-describedby={getError("teamInfo.teamName") ? "teamName-error" : undefined}
                  />
                  {getError("teamInfo.teamName") ? (
                    <p id="teamName-error" className="register-error">
                      {getError("teamInfo.teamName")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="track">
                    Track <span className="register-required">*</span>
                  </label>
                  <select
                    id="track"
                    className={`register-control${getError("teamInfo.track") ? " is-invalid" : ""}`}
                    value={formData.teamInfo.track}
                    onChange={(event) => updateTeamInfo("track", event.target.value)}
                    aria-invalid={Boolean(getError("teamInfo.track"))}
                    aria-describedby={getError("teamInfo.track") ? "track-error" : undefined}
                  >
                    <option value="">Select a track</option>
                    {trackOptions.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                  {getError("teamInfo.track") ? (
                    <p id="track-error" className="register-error">
                      {getError("teamInfo.track")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="teamSize">
                    Team Size <span className="register-required">*</span>
                  </label>
                  <select
                    id="teamSize"
                    className={`register-control${getError("teamInfo.teamSize") ? " is-invalid" : ""}`}
                    value={formData.teamInfo.teamSize}
                    onChange={(event) => updateTeamInfo("teamSize", event.target.value)}
                    aria-invalid={Boolean(getError("teamInfo.teamSize"))}
                    aria-describedby={getError("teamInfo.teamSize") ? "teamSize-error" : undefined}
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  {getError("teamInfo.teamSize") ? (
                    <p id="teamSize-error" className="register-error">
                      {getError("teamInfo.teamSize")}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="team-leader"
              className="register-section"
              ref={(node) => {
                sectionRefs.current["team-leader"] = node;
              }}
              onFocusCapture={() => setActiveSection("team-leader")}
              {...sectionMotion}
            >
              <h2 className="register-section-title">Section 2 - Team Leader Details</h2>
              <div className="register-grid register-grid-two">
                <div className="register-field">
                  <label className="register-label" htmlFor="leaderFullName">
                    Full Name <span className="register-required">*</span>
                  </label>
                  <input
                    id="leaderFullName"
                    className={`register-control${getError("leader.fullName") ? " is-invalid" : ""}`}
                    type="text"
                    value={formData.leader.fullName}
                    onChange={(event) => updateLeader("fullName", event.target.value)}
                    aria-invalid={Boolean(getError("leader.fullName"))}
                    aria-describedby={getError("leader.fullName") ? "leaderFullName-error" : undefined}
                  />
                  {getError("leader.fullName") ? (
                    <p id="leaderFullName-error" className="register-error">
                      {getError("leader.fullName")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderEmail">
                    Email <span className="register-required">*</span>
                  </label>
                  <input
                    id="leaderEmail"
                    className={`register-control${getError("leader.email") ? " is-invalid" : ""}`}
                    type="email"
                    value={formData.leader.email}
                    onChange={(event) => updateLeader("email", event.target.value)}
                    aria-invalid={Boolean(getError("leader.email"))}
                    aria-describedby={getError("leader.email") ? "leaderEmail-error" : undefined}
                  />
                  {getError("leader.email") ? (
                    <p id="leaderEmail-error" className="register-error">
                      {getError("leader.email")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderMobile">
                    Mobile Number <span className="register-required">*</span>
                  </label>
                  <input
                    id="leaderMobile"
                    className={`register-control${getError("leader.mobile") ? " is-invalid" : ""}`}
                    type="tel"
                    value={formData.leader.mobile}
                    onChange={(event) => updateLeader("mobile", event.target.value)}
                    aria-invalid={Boolean(getError("leader.mobile"))}
                    aria-describedby={getError("leader.mobile") ? "leaderMobile-error" : undefined}
                  />
                  {getError("leader.mobile") ? (
                    <p id="leaderMobile-error" className="register-error">
                      {getError("leader.mobile")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderCollegeName">
                    College Name <span className="register-required">*</span>
                  </label>
                  <CollegeCombobox
                    id="leaderCollegeName"
                    value={formData.leader.collegeName}
                    manualMode={Boolean(formData.leader.collegeManual)}
                    colleges={collegeOptions}
                    error={getError("leader.collegeName")}
                    placeholder="Search your college..."
                    onChange={({ collegeName, collegeManual }) => {
                      setFormData((prev) => ({
                        ...prev,
                        leader: {
                          ...prev.leader,
                          collegeName,
                          collegeManual,
                        },
                      }));
                    }}
                  />
                  {getError("leader.collegeName") ? (
                    <p id="leaderCollegeName-error" className="register-error">
                      {getError("leader.collegeName")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderDepartment">
                    Department <span className="register-required">*</span>
                  </label>
                  <input
                    id="leaderDepartment"
                    className={`register-control${getError("leader.department") ? " is-invalid" : ""}`}
                    type="text"
                    value={formData.leader.department}
                    onChange={(event) => updateLeader("department", event.target.value)}
                    aria-invalid={Boolean(getError("leader.department"))}
                    aria-describedby={getError("leader.department") ? "leaderDepartment-error" : undefined}
                  />
                  {getError("leader.department") ? (
                    <p id="leaderDepartment-error" className="register-error">
                      {getError("leader.department")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderYearOfStudy">
                    Year of Study <span className="register-required">*</span>
                  </label>
                  <select
                    id="leaderYearOfStudy"
                    className={`register-control${getError("leader.yearOfStudy") ? " is-invalid" : ""}`}
                    value={formData.leader.yearOfStudy}
                    onChange={(event) => updateLeader("yearOfStudy", event.target.value)}
                    aria-invalid={Boolean(getError("leader.yearOfStudy"))}
                    aria-describedby={getError("leader.yearOfStudy") ? "leaderYearOfStudy-error" : undefined}
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {getError("leader.yearOfStudy") ? (
                    <p id="leaderYearOfStudy-error" className="register-error">
                      {getError("leader.yearOfStudy")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderUsn">
                    USN / College ID <span className="register-required">*</span>
                  </label>
                  <input
                    id="leaderUsn"
                    className={`register-control${getError("leader.usn") ? " is-invalid" : ""}`}
                    type="text"
                    value={formData.leader.usn}
                    onChange={(event) => updateLeader("usn", event.target.value)}
                    aria-invalid={Boolean(getError("leader.usn"))}
                    aria-describedby={getError("leader.usn") ? "leaderUsn-error" : undefined}
                  />
                  {getError("leader.usn") ? (
                    <p id="leaderUsn-error" className="register-error">
                      {getError("leader.usn")}
                    </p>
                  ) : null}
                </div>

                <div className="register-field">
                  <label className="register-label" htmlFor="leaderIeeeId">
                    IEEE Membership ID (Optional)
                  </label>
                  <input
                    id="leaderIeeeId"
                    className={`register-control${getError("leader.ieeeId") ? " is-invalid" : ""}`}
                    type="text"
                    value={formData.leader.ieeeId}
                    onChange={(event) => updateLeader("ieeeId", event.target.value)}
                    aria-invalid={Boolean(getError("leader.ieeeId"))}
                    aria-describedby={getError("leader.ieeeId") ? "leaderIeeeId-error" : undefined}
                  />
                  {getError("leader.ieeeId") ? (
                    <p id="leaderIeeeId-error" className="register-error">
                      {getError("leader.ieeeId")}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="team-members"
              className="register-section"
              ref={(node) => {
                sectionRefs.current["team-members"] = node;
              }}
              onFocusCapture={() => setActiveSection("team-members")}
              {...sectionMotion}
            >
              <h2 className="register-section-title">Section 3 - Team Members</h2>
              <p className="register-section-copy">
                Member blocks are shown based on team size. Team leader details are captured in Section 2.
              </p>

              <div className="register-member-stack">
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleMemberIndexes.map((memberNumber) => {
                    const member = formData.members[memberNumber];
                    return (
                      <motion.article
                        key={memberNumber}
                        className="register-member-card"
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, y: 18 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, y: -10 }}
                        transition={{ duration: 0.35, ease: smoothEase }}
                        layout
                      >
                        <h3>Member {memberNumber} Details</h3>
                        <div className="register-grid register-grid-two">
                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}FullName`}>
                              Full Name <span className="register-required">*</span>
                            </label>
                            <input
                              id={`member${memberNumber}FullName`}
                              className={`register-control${
                                getError(`members.${memberNumber}.fullName`) ? " is-invalid" : ""
                              }`}
                              type="text"
                              value={member.fullName}
                              onChange={(event) =>
                                updateMember(memberNumber, "fullName", event.target.value)
                              }
                              aria-invalid={Boolean(getError(`members.${memberNumber}.fullName`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.fullName`)
                                  ? `member${memberNumber}FullName-error`
                                  : undefined
                              }
                            />
                            {getError(`members.${memberNumber}.fullName`) ? (
                              <p id={`member${memberNumber}FullName-error`} className="register-error">
                                {getError(`members.${memberNumber}.fullName`)}
                              </p>
                            ) : null}
                          </div>

                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}Email`}>
                              Email <span className="register-required">*</span>
                            </label>
                            <input
                              id={`member${memberNumber}Email`}
                              className={`register-control${
                                getError(`members.${memberNumber}.email`) ? " is-invalid" : ""
                              }`}
                              type="email"
                              value={member.email}
                              onChange={(event) => updateMember(memberNumber, "email", event.target.value)}
                              aria-invalid={Boolean(getError(`members.${memberNumber}.email`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.email`)
                                  ? `member${memberNumber}Email-error`
                                  : undefined
                              }
                            />
                            {getError(`members.${memberNumber}.email`) ? (
                              <p id={`member${memberNumber}Email-error`} className="register-error">
                                {getError(`members.${memberNumber}.email`)}
                              </p>
                            ) : null}
                          </div>

                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}Usn`}>
                              USN / College ID <span className="register-required">*</span>
                            </label>
                            <input
                              id={`member${memberNumber}Usn`}
                              className={`register-control${
                                getError(`members.${memberNumber}.usn`) ? " is-invalid" : ""
                              }`}
                              type="text"
                              value={member.usn}
                              onChange={(event) => updateMember(memberNumber, "usn", event.target.value)}
                              aria-invalid={Boolean(getError(`members.${memberNumber}.usn`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.usn`) ? `member${memberNumber}Usn-error` : undefined
                              }
                            />
                            {getError(`members.${memberNumber}.usn`) ? (
                              <p id={`member${memberNumber}Usn-error`} className="register-error">
                                {getError(`members.${memberNumber}.usn`)}
                              </p>
                            ) : null}
                          </div>

                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}IeeeId`}>
                              IEEE Membership ID (Optional)
                            </label>
                            <input
                              id={`member${memberNumber}IeeeId`}
                              className={`register-control${
                                getError(`members.${memberNumber}.ieeeId`) ? " is-invalid" : ""
                              }`}
                              type="text"
                              value={member.ieeeId}
                              onChange={(event) => updateMember(memberNumber, "ieeeId", event.target.value)}
                              aria-invalid={Boolean(getError(`members.${memberNumber}.ieeeId`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.ieeeId`)
                                  ? `member${memberNumber}IeeeId-error`
                                  : undefined
                              }
                            />
                            {getError(`members.${memberNumber}.ieeeId`) ? (
                              <p id={`member${memberNumber}IeeeId-error`} className="register-error">
                                {getError(`members.${memberNumber}.ieeeId`)}
                              </p>
                            ) : null}
                          </div>

                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}Department`}>
                              Department <span className="register-required">*</span>
                            </label>
                            <input
                              id={`member${memberNumber}Department`}
                              className={`register-control${
                                getError(`members.${memberNumber}.department`) ? " is-invalid" : ""
                              }`}
                              type="text"
                              value={member.department}
                              onChange={(event) =>
                                updateMember(memberNumber, "department", event.target.value)
                              }
                              aria-invalid={Boolean(getError(`members.${memberNumber}.department`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.department`)
                                  ? `member${memberNumber}Department-error`
                                  : undefined
                              }
                            />
                            {getError(`members.${memberNumber}.department`) ? (
                              <p id={`member${memberNumber}Department-error`} className="register-error">
                                {getError(`members.${memberNumber}.department`)}
                              </p>
                            ) : null}
                          </div>

                          <div className="register-field">
                            <label className="register-label" htmlFor={`member${memberNumber}YearOfStudy`}>
                              Year of Study <span className="register-required">*</span>
                            </label>
                            <select
                              id={`member${memberNumber}YearOfStudy`}
                              className={`register-control${
                                getError(`members.${memberNumber}.yearOfStudy`) ? " is-invalid" : ""
                              }`}
                              value={member.yearOfStudy}
                              onChange={(event) =>
                                updateMember(memberNumber, "yearOfStudy", event.target.value)
                              }
                              aria-invalid={Boolean(getError(`members.${memberNumber}.yearOfStudy`))}
                              aria-describedby={
                                getError(`members.${memberNumber}.yearOfStudy`)
                                  ? `member${memberNumber}YearOfStudy-error`
                                  : undefined
                              }
                            >
                              <option value="">Select year</option>
                              {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {getError(`members.${memberNumber}.yearOfStudy`) ? (
                              <p id={`member${memberNumber}YearOfStudy-error`} className="register-error">
                                {getError(`members.${memberNumber}.yearOfStudy`)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.section>

            <motion.section
              id="declaration"
              className="register-section"
              ref={(node) => {
                sectionRefs.current.declaration = node;
              }}
              onFocusCapture={() => setActiveSection("declaration")}
              {...sectionMotion}
            >
              <h2 className="register-section-title">Section 4 - Declaration</h2>

              <div className="register-checklist" role="group" aria-label="Registration declarations">
                <label
                  className={`register-checkitem${
                    getError("declaration.infoAccurate") ? " is-invalid" : ""
                  }`}
                >
                  <input
                    id="declarationInfoAccurate"
                    type="checkbox"
                    checked={formData.declaration.infoAccurate}
                    onChange={(event) => updateDeclaration("infoAccurate", event.target.checked)}
                  />
                  <span>The information provided is accurate</span>
                </label>
                {getError("declaration.infoAccurate") ? (
                  <p className="register-error">{getError("declaration.infoAccurate")}</p>
                ) : null}

                <label
                  className={`register-checkitem${
                    getError("declaration.agreeTerms") ? " is-invalid" : ""
                  }`}
                >
                  <input
                    id="declarationAgreeTerms"
                    type="checkbox"
                    checked={formData.declaration.agreeTerms}
                    onChange={(event) => updateDeclaration("agreeTerms", event.target.checked)}
                  />
                  <span>I agree to the terms and conditions of EPOCH '26</span>
                </label>
                {getError("declaration.agreeTerms") ? (
                  <p className="register-error">{getError("declaration.agreeTerms")}</p>
                ) : null}
              </div>

              <div className="register-fee-note">
                Registration Fee: ₹1500 per team. Slots are first come, first serve after payment.
              </div>

              {submitError ? (
                <p className="register-error" role="alert" aria-live="polite">
                  {submitError}
                </p>
              ) : null}

              <button className="register-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "OPENING PAYMENT..." : "PROCEED TO PAYMENT"}
              </button>
            </motion.section>
          </form>
        </section>
      </main>
    </>
  );
}
