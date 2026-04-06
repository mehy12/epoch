"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type TeamSize = "2" | "3" | "4";

type FormStep = {
  id: string;
  name: string;
  label: string;
};

type MemberInfo = {
  fullName: string;
  email: string;
  usn: string;
  ieeeId: string;
  yearOfStudy: string;
};

type RegistrationData = {
  teamName: string;
  track: string;
  teamSize: TeamSize;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderIeeeId: string;
  collegeName: string;
  department: string;
  collegeYear: string;
  collegeId: string;
  members: MemberInfo[];
  ideaTitle: string;
  ideaDescription: string;
  pptLink: string;
  confirmIeee: boolean;
  confirmAccurate: boolean;
  confirmTerms: boolean;
};

type ErrorMap = Record<string, boolean>;

const steps: FormStep[] = [
  { id: "team-info", name: "Team Info", label: "Team" },
  { id: "leader", name: "Team Leader", label: "Leader" },
  { id: "college", name: "College Info", label: "College" },
  { id: "members", name: "Team Members", label: "Members" },
  { id: "idea", name: "Idea Submission", label: "Idea" },
  { id: "review", name: "Review & Submit", label: "Review" },
];

const tracks = [
  { value: "ai-social-good", label: "AI for Social Good" },
  { value: "sustainability-goals", label: "Sustainability Goals" },
  { value: "cybersecurity-blockchain", label: "Cybersecurity & Blockchain" },
];

const yearOptions = ["1", "2", "3", "4"];

const emptyMember = (): MemberInfo => ({
  fullName: "",
  email: "",
  usn: "",
  ieeeId: "",
  yearOfStudy: "",
});

const stepTitle: Record<number, string> = {
  0: "Set up your team.",
  1: "Tell us about your leader.",
  2: "Where are you from?",
  3: "Add your teammates.",
  4: "Pitch your idea.",
  5: "Review your details.",
};

const stepSubtitle: Record<number, string> = {
  0: "Start with your core team details and preferred track.",
  1: "We need one point of contact for communication.",
  2: "Help us identify your institution details.",
  3: "Member 2 onward is generated from team size.",
  4: "Share your idea in a concise and clear format.",
  5: "Confirm everything before submitting registration.",
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
  }),
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});

  const [formData, setFormData] = useState<RegistrationData>({
    teamName: "",
    track: "",
    teamSize: "2",
    leaderName: "",
    leaderEmail: "",
    leaderMobile: "",
    leaderIeeeId: "",
    collegeName: "",
    department: "",
    collegeYear: "",
    collegeId: "",
    members: [emptyMember()],
    ideaTitle: "",
    ideaDescription: "",
    pptLink: "",
    confirmIeee: false,
    confirmAccurate: false,
    confirmTerms: false,
  });

  useEffect(() => {
    const requiredMembers = Math.max(Number(formData.teamSize) - 1, 1);
    setFormData((prev) => {
      const nextMembers = [...prev.members];
      while (nextMembers.length < requiredMembers) {
        nextMembers.push(emptyMember());
      }
      return {
        ...prev,
        members: nextMembers.slice(0, requiredMembers),
      };
    });
  }, [formData.teamSize]);

  const currentStepName = useMemo(() => steps[currentStep].name, [currentStep]);

  const updateField = <K extends keyof RegistrationData>(
    field: K,
    value: RegistrationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMember = (
    index: number,
    field: keyof MemberInfo,
    value: string
  ) => {
    setFormData((prev) => {
      const nextMembers = [...prev.members];
      nextMembers[index] = {
        ...nextMembers[index],
        [field]: value,
      };
      return {
        ...prev,
        members: nextMembers,
      };
    });
  };

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateStep = (stepIndex: number): ErrorMap => {
    const nextErrors: ErrorMap = {};

    if (stepIndex === 0) {
      if (!formData.teamName.trim()) nextErrors.teamName = true;
      if (!formData.track) nextErrors.track = true;
      if (!formData.teamSize) nextErrors.teamSize = true;
    }

    if (stepIndex === 1) {
      if (!formData.leaderName.trim()) nextErrors.leaderName = true;
      if (!formData.leaderEmail.trim()) nextErrors.leaderEmail = true;
      if (!formData.leaderMobile.trim()) nextErrors.leaderMobile = true;
      if (!formData.leaderIeeeId.trim()) nextErrors.leaderIeeeId = true;
    }

    if (stepIndex === 2) {
      if (!formData.collegeName.trim()) nextErrors.collegeName = true;
      if (!formData.department.trim()) nextErrors.department = true;
      if (!formData.collegeYear) nextErrors.collegeYear = true;
      if (!formData.collegeId.trim()) nextErrors.collegeId = true;
    }

    if (stepIndex === 3) {
      formData.members.forEach((member, idx) => {
        if (!member.fullName.trim()) nextErrors[`m-${idx}-fullName`] = true;
        if (!member.email.trim()) nextErrors[`m-${idx}-email`] = true;
        if (!member.usn.trim()) nextErrors[`m-${idx}-usn`] = true;
        if (!member.ieeeId.trim()) nextErrors[`m-${idx}-ieeeId`] = true;
        if (!member.yearOfStudy) nextErrors[`m-${idx}-yearOfStudy`] = true;
      });
    }

    if (stepIndex === 4) {
      if (!formData.ideaTitle.trim()) nextErrors.ideaTitle = true;
      if (!formData.ideaDescription.trim()) nextErrors.ideaDescription = true;
      if (formData.ideaDescription.length > 300) {
        nextErrors.ideaDescription = true;
      }
      if (!formData.pptLink.trim() || !isValidUrl(formData.pptLink)) {
        nextErrors.pptLink = true;
      }
    }

    if (stepIndex === 5) {
      if (!formData.confirmIeee) nextErrors.confirmIeee = true;
      if (!formData.confirmAccurate) nextErrors.confirmAccurate = true;
      if (!formData.confirmTerms) nextErrors.confirmTerms = true;
    }

    return nextErrors;
  };

  const goNext = () => {
    const nextErrors = validateStep(currentStep);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      window.setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1300);
      return;
    }

    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrors({});
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const fieldClass = (name: string) =>
    cn(
      "h-11 rounded-xl border border-zinc-700 bg-[#111111] text-white placeholder:text-zinc-500 focus-visible:border-[#F59E0B] focus-visible:ring-0 focus-visible:ring-offset-0",
      errors[name] && "border-[#F59E0B] ring-1 ring-[#F59E0B]/55"
    );

  const selectClass = (name: string) =>
    cn(
      "h-11 rounded-xl border border-zinc-700 bg-[#111111] text-white focus:border-[#F59E0B] focus:ring-0 focus:ring-offset-0",
      errors[name] && "border-[#F59E0B] ring-1 ring-[#F59E0B]/55"
    );

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <Card className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#F59E0B] bg-[#F59E0B]/15">
              <Check className="h-6 w-6 text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-black tracking-wide text-[#F59E0B]">
              REGISTRATION RECEIVED.
            </h2>
            <p className="mt-4 text-zinc-300 text-base leading-relaxed max-w-xl mx-auto">
              Screening results announced April 28, 2026. Check your email for
              confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative px-1">
          <div className="absolute left-0 right-0 top-4 h-px bg-zinc-700" />
          <div
            className="absolute left-0 top-4 h-px bg-[#F59E0B] transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="relative grid grid-cols-6 gap-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= currentStep) {
                        setDirection(index > currentStep ? 1 : -1);
                        setCurrentStep(index);
                      }
                    }}
                    className={cn(
                      "z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition-colors",
                      isActive && "bg-[#F59E0B] border-[#F59E0B] text-black",
                      isComplete && "bg-transparent border-[#F59E0B] text-[#F59E0B]",
                      !isActive && !isComplete && "bg-zinc-800 border-zinc-600 text-zinc-400"
                    )}
                  >
                    {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </button>
                  <span
                    className={cn(
                      "mt-2 text-[10px] sm:text-[11px] tracking-wide",
                      isActive ? "text-[#F59E0B]" : "text-zinc-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <Card className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {stepTitle[currentStep]}
              </CardTitle>
              <CardDescription className="text-zinc-400 text-base">
                {stepSubtitle[currentStep]}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {currentStep === 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white font-semibold" htmlFor="teamName">
                      Team Name
                    </Label>
                    <Input
                      id="teamName"
                      placeholder="Enter your team name"
                      value={formData.teamName}
                      onChange={(e) => updateField("teamName", e.target.value)}
                      className={fieldClass("teamName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold">Track</Label>
                    <Select
                      value={formData.track}
                      onValueChange={(value) => updateField("track", value)}
                    >
                      <SelectTrigger className={selectClass("track")}>
                        <SelectValue placeholder="Choose a track" />
                      </SelectTrigger>
                      <SelectContent>
                        {tracks.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold">Team Size</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(value: TeamSize) => updateField("teamSize", value)}
                    >
                      <SelectTrigger className={selectClass("teamSize")}>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white font-semibold" htmlFor="leaderName">
                      Full Name
                    </Label>
                    <Input
                      id="leaderName"
                      placeholder="Team leader full name"
                      value={formData.leaderName}
                      onChange={(e) => updateField("leaderName", e.target.value)}
                      className={fieldClass("leaderName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="leaderEmail">
                      Email
                    </Label>
                    <Input
                      id="leaderEmail"
                      type="email"
                      placeholder="leader@example.com"
                      value={formData.leaderEmail}
                      onChange={(e) => updateField("leaderEmail", e.target.value)}
                      className={fieldClass("leaderEmail")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="leaderMobile">
                      Mobile Number
                    </Label>
                    <Input
                      id="leaderMobile"
                      placeholder="10-digit number"
                      value={formData.leaderMobile}
                      onChange={(e) => updateField("leaderMobile", e.target.value)}
                      className={fieldClass("leaderMobile")}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white font-semibold" htmlFor="leaderIeeeId">
                      IEEE Membership ID
                    </Label>
                    <Input
                      id="leaderIeeeId"
                      placeholder="Enter IEEE membership ID"
                      value={formData.leaderIeeeId}
                      onChange={(e) => updateField("leaderIeeeId", e.target.value)}
                      className={fieldClass("leaderIeeeId")}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white font-semibold" htmlFor="collegeName">
                      College Name
                    </Label>
                    <Input
                      id="collegeName"
                      placeholder="Vemana Institute of Technology"
                      value={formData.collegeName}
                      onChange={(e) => updateField("collegeName", e.target.value)}
                      className={fieldClass("collegeName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="department">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="CSE / ISE / ECE"
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      className={fieldClass("department")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold">Year of Study</Label>
                    <Select
                      value={formData.collegeYear}
                      onValueChange={(value) => updateField("collegeYear", value)}
                    >
                      <SelectTrigger className={selectClass("collegeYear")}>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((value) => (
                          <SelectItem key={value} value={value}>
                            Year {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white font-semibold" htmlFor="collegeId">
                      USN / College ID
                    </Label>
                    <Input
                      id="collegeId"
                      placeholder="Enter USN or college ID"
                      value={formData.collegeId}
                      onChange={(e) => updateField("collegeId", e.target.value)}
                      className={fieldClass("collegeId")}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  {formData.members.map((member, idx) => (
                    <motion.div
                      key={idx}
                      className="rounded-xl border border-zinc-700/90 bg-[#111111] p-4"
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      layout
                    >
                      <h4 className="text-[#F59E0B] font-semibold text-sm uppercase tracking-wider mb-3">
                        Member {idx + 2}
                      </h4>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-white font-semibold">Full Name</Label>
                          <Input
                            placeholder="Member full name"
                            value={member.fullName}
                            onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                            className={fieldClass(`m-${idx}-fullName`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white font-semibold">Email</Label>
                          <Input
                            type="email"
                            placeholder="member@example.com"
                            value={member.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            className={fieldClass(`m-${idx}-email`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white font-semibold">USN</Label>
                          <Input
                            placeholder="USN"
                            value={member.usn}
                            onChange={(e) => updateMember(idx, "usn", e.target.value)}
                            className={fieldClass(`m-${idx}-usn`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white font-semibold">IEEE Membership ID</Label>
                          <Input
                            placeholder="IEEE ID"
                            value={member.ieeeId}
                            onChange={(e) => updateMember(idx, "ieeeId", e.target.value)}
                            className={fieldClass(`m-${idx}-ieeeId`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white font-semibold">Year of Study</Label>
                          <Select
                            value={member.yearOfStudy}
                            onValueChange={(value) => updateMember(idx, "yearOfStudy", value)}
                          >
                            <SelectTrigger className={selectClass(`m-${idx}-yearOfStudy`)}>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {yearOptions.map((value) => (
                                <SelectItem key={`${idx}-${value}`} value={value}>
                                  Year {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="ideaTitle">
                      Idea Title
                    </Label>
                    <Input
                      id="ideaTitle"
                      placeholder="Name your hackathon idea"
                      value={formData.ideaTitle}
                      onChange={(e) => updateField("ideaTitle", e.target.value)}
                      className={fieldClass("ideaTitle")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="ideaDescription">
                      Brief Description
                    </Label>
                    <Textarea
                      id="ideaDescription"
                      maxLength={300}
                      placeholder="Describe the problem, approach, and impact (max 300 chars)."
                      value={formData.ideaDescription}
                      onChange={(e) => updateField("ideaDescription", e.target.value)}
                      className={cn(fieldClass("ideaDescription"), "min-h-[120px]")}
                    />
                    <p className="text-xs text-zinc-400 text-right">
                      {formData.ideaDescription.length}/300
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="pptLink">
                      PPT Link (Google Drive URL)
                    </Label>
                    <Input
                      id="pptLink"
                      placeholder="https://drive.google.com/..."
                      value={formData.pptLink}
                      onChange={(e) => updateField("pptLink", e.target.value)}
                      className={fieldClass("pptLink")}
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
                      <p className="text-[#F59E0B] uppercase text-xs tracking-wider font-semibold mb-2">Team Info</p>
                      <p className="text-sm text-zinc-200"><span className="text-zinc-400">Team:</span> {formData.teamName}</p>
                      <p className="text-sm text-zinc-200"><span className="text-zinc-400">Track:</span> {tracks.find((t) => t.value === formData.track)?.label || "-"}</p>
                      <p className="text-sm text-zinc-200"><span className="text-zinc-400">Team Size:</span> {formData.teamSize}</p>
                    </div>

                    <div className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
                      <p className="text-[#F59E0B] uppercase text-xs tracking-wider font-semibold mb-2">Team Leader</p>
                      <p className="text-sm text-zinc-200">{formData.leaderName}</p>
                      <p className="text-sm text-zinc-200">{formData.leaderEmail}</p>
                      <p className="text-sm text-zinc-200">{formData.leaderMobile}</p>
                      <p className="text-sm text-zinc-200">IEEE: {formData.leaderIeeeId}</p>
                    </div>

                    <div className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
                      <p className="text-[#F59E0B] uppercase text-xs tracking-wider font-semibold mb-2">College</p>
                      <p className="text-sm text-zinc-200">{formData.collegeName}</p>
                      <p className="text-sm text-zinc-200">{formData.department}</p>
                      <p className="text-sm text-zinc-200">Year {formData.collegeYear}</p>
                      <p className="text-sm text-zinc-200">ID: {formData.collegeId}</p>
                    </div>

                    <div className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
                      <p className="text-[#F59E0B] uppercase text-xs tracking-wider font-semibold mb-2">Idea</p>
                      <p className="text-sm text-zinc-200">{formData.ideaTitle}</p>
                      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{formData.ideaDescription}</p>
                      <p className="mt-2 text-sm text-zinc-200 break-all">{formData.pptLink}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
                    <p className="text-[#F59E0B] uppercase text-xs tracking-wider font-semibold mb-2">Team Members</p>
                    <div className="space-y-2">
                      {formData.members.map((member, idx) => (
                        <div key={`review-member-${idx}`} className="text-sm text-zinc-200">
                          Member {idx + 2}: {member.fullName} | {member.email} | {member.usn} | IEEE {member.ieeeId} | Year {member.yearOfStudy}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-zinc-700 bg-[#111111] p-4">
                    <label
                      className={cn(
                        "flex items-start gap-3 rounded-lg border border-zinc-700 px-3 py-2",
                        errors.confirmIeee && "border-[#F59E0B]"
                      )}
                    >
                      <Checkbox
                        checked={formData.confirmIeee}
                        onCheckedChange={(checked) => updateField("confirmIeee", Boolean(checked))}
                      />
                      <span className="text-sm text-zinc-200">All members are active IEEE members</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-start gap-3 rounded-lg border border-zinc-700 px-3 py-2",
                        errors.confirmAccurate && "border-[#F59E0B]"
                      )}
                    >
                      <Checkbox
                        checked={formData.confirmAccurate}
                        onCheckedChange={(checked) => updateField("confirmAccurate", Boolean(checked))}
                      />
                      <span className="text-sm text-zinc-200">Information provided is accurate</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-start gap-3 rounded-lg border border-zinc-700 px-3 py-2",
                        errors.confirmTerms && "border-[#F59E0B]"
                      )}
                    >
                      <Checkbox
                        checked={formData.confirmTerms}
                        onCheckedChange={(checked) => updateField("confirmTerms", Boolean(checked))}
                      />
                      <span className="text-sm text-zinc-200">I agree to EPOCH '26 terms and conditions</span>
                    </label>

                    <p className="pt-2 text-sm text-[#F59E0B] font-semibold">
                      Round 1 Registration Fee: ₹300 per team. Payment details shared post screening.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        </AnimatePresence>

        <CardFooter className="justify-between gap-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0 || isSubmitting}
            className="h-11 min-w-[120px] rounded-xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900 hover:text-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <Button
            type="button"
            onClick={goNext}
            disabled={isSubmitting}
            className="h-11 min-w-[180px] rounded-xl bg-[#F59E0B] text-black hover:bg-[#d98900]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : currentStep === steps.length - 1 ? (
              "SUBMIT REGISTRATION"
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <p className="mt-4 text-center text-sm text-zinc-400 tracking-wide">
        Step {currentStep + 1} of {steps.length}: {currentStepName}
      </p>
    </div>
  );
}
