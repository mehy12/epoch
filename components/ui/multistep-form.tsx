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
  1: "We need one primary point of contact for communication.",
  2: "Help us identify your college and academic details.",
  3: "Add the remaining members based on your chosen team size.",
  4: "Share your idea in a concise and clear format.",
  5: "Confirm everything looks correct before submitting.",
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
    y: 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    y: 0,
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
      }, 1500);
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
      "h-14 rounded-xl border border-[#24242A] bg-[#050505] px-4 text-[15px] font-medium text-white placeholder:text-[#52525B] transition-all duration-200 outline-none focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/50 hover:border-[#3F3F46]",
      errors[name] && "border-[#EF4444] hover:border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/50"
    );

  const selectClass = (name: string) =>
    cn(
      "h-14 rounded-xl border border-[#24242A] bg-[#050505] px-4 text-[15px] font-medium text-white placeholder:text-[#52525B] transition-all duration-200 outline-none focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/50 hover:border-[#3F3F46]",
      errors[name] && "border-[#EF4444] hover:border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/50"
    );

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="rounded-[24px] border border-[#24242A] bg-[#121214]/90 backdrop-blur-2xl text-white shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <CardContent className="py-20 px-8 text-center sm:px-12 w-full flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#F59E0B]/10 border border-[#F59E0B]/20"
            >
              <Check className="h-10 w-10 text-[#F59E0B]" strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Registration Received
            </h2>
            <p className="text-[#A1A1AA] text-[15px] leading-relaxed max-w-md mx-auto">
              Your application has been securely recorded. Screening results will be announced on April 28, 2026. Keep an eye on your inbox.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-16">
      {/* Refined Stepper */}
      <div className="mb-10 sm:mb-12 relative px-2">
        <div className="absolute left-0 right-0 top-5 h-[2px] bg-[#24242A] rounded-full mx-6" />
        <motion.div
          className="absolute left-0 top-5 h-[2px] bg-[#F59E0B] transition-all duration-500 ease-out rounded-full mx-6"
          style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${currentStep === 0 ? 0 : 20}px)` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (index <= currentStep) {
                      setDirection(index > currentStep ? 1 : -1);
                      setCurrentStep(index);
                    }
                  }}
                  className={cn(
                    "z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-[#F59E0B] text-[#050505] shadow-[0_0_20px_rgba(245,158,11,0.3)] border-transparent"
                      : isComplete
                      ? "bg-[#121214] border-2 border-[#F59E0B] text-[#F59E0B]"
                      : "bg-[#121214] border border-[#24242A] text-[#52525B]"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                </motion.button>
                <span
                  className={cn(
                    "mt-3 text-[12px] font-medium tracking-wide transition-colors hidden sm:block",
                    isActive ? "text-[#F5F5F5]" : isComplete ? "text-[#A1A1AA]" : "text-[#52525B]"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="rounded-[24px] border border-[#24242A] bg-[#121214]/90 backdrop-blur-3xl text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardHeader className="px-6 py-8 sm:px-10 sm:py-10 border-b border-[#24242A]/50">
              <CardTitle className="text-2xl sm:text-[28px] font-semibold text-white tracking-tight">
                {stepTitle[currentStep]}
              </CardTitle>
              <CardDescription className="text-[#A1A1AA] text-[15px] mt-2">
                {stepSubtitle[currentStep]}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-8 sm:px-10 sm:py-10 space-y-6">
              {currentStep === 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="teamName">
                      Team Name
                    </Label>
                    <Input
                      id="teamName"
                      placeholder="e.g. Phoenix Protocol"
                      value={formData.teamName}
                      onChange={(e) => updateField("teamName", e.target.value)}
                      className={fieldClass("teamName")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]">Primary Track</Label>
                    <Select
                      value={formData.track}
                      onValueChange={(value) => updateField("track", value)}
                    >
                      <SelectTrigger className={selectClass("track")}>
                        <SelectValue placeholder="Choose a domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-[#24242A] text-white">
                        {tracks.map((item) => (
                          <SelectItem key={item.value} value={item.value} className="focus:bg-[#1F1F24] focus:text-white">
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]">Team Size</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(value: TeamSize) => updateField("teamSize", value)}
                    >
                      <SelectTrigger className={selectClass("teamSize")}>
                        <SelectValue placeholder="Members count" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-[#24242A] text-white">
                        <SelectItem value="2" className="focus:bg-[#1F1F24]">2 Members</SelectItem>
                        <SelectItem value="3" className="focus:bg-[#1F1F24]">3 Members</SelectItem>
                        <SelectItem value="4" className="focus:bg-[#1F1F24]">4 Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="leaderName">
                      Legal Full Name
                    </Label>
                    <Input
                      id="leaderName"
                      placeholder="Jane Doe"
                      value={formData.leaderName}
                      onChange={(e) => updateField("leaderName", e.target.value)}
                      className={fieldClass("leaderName")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="leaderEmail">
                      Email Address
                    </Label>
                    <Input
                      id="leaderEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.leaderEmail}
                      onChange={(e) => updateField("leaderEmail", e.target.value)}
                      className={fieldClass("leaderEmail")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="leaderMobile">
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

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="leaderIeeeId">
                      IEEE Membership ID
                    </Label>
                    <Input
                      id="leaderIeeeId"
                      placeholder="Enter 8 or 9 digit IEEE ID"
                      value={formData.leaderIeeeId}
                      onChange={(e) => updateField("leaderIeeeId", e.target.value)}
                      className={fieldClass("leaderIeeeId")}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="collegeName">
                      Institution Name
                    </Label>
                    <Input
                      id="collegeName"
                      placeholder="e.g. Vemana Institute of Technology"
                      value={formData.collegeName}
                      onChange={(e) => updateField("collegeName", e.target.value)}
                      className={fieldClass("collegeName")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="department">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. CSE / ISE / ECE"
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      className={fieldClass("department")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]">Year of Study</Label>
                    <Select
                      value={formData.collegeYear}
                      onValueChange={(value) => updateField("collegeYear", value)}
                    >
                      <SelectTrigger className={selectClass("collegeYear")}>
                        <SelectValue placeholder="Select current year" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-[#24242A] text-white">
                        {yearOptions.map((value) => (
                          <SelectItem key={value} value={value} className="focus:bg-[#1F1F24]">
                            Year {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="collegeId">
                      USN / University ID
                    </Label>
                    <Input
                      id="collegeId"
                      placeholder="Enter official roll number"
                      value={formData.collegeId}
                      onChange={(e) => updateField("collegeId", e.target.value)}
                      className={fieldClass("collegeId")}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  {formData.members.map((member, idx) => (
                    <motion.div
                      key={idx}
                      className="rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/50 p-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F1F24] text-[#A1A1AA] text-xs font-medium">
                          {idx + 2}
                        </div>
                        <h4 className="text-[#F5F5F5] font-medium tracking-wide">
                          Teammate Profile
                        </h4>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3 md:col-span-2">
                          <Label className="text-[#F5F5F5] font-medium text-[14px]">Full Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={member.fullName}
                            onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                            className={fieldClass(`m-${idx}-fullName`)}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#F5F5F5] font-medium text-[14px]">Email</Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={member.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            className={fieldClass(`m-${idx}-email`)}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#F5F5F5] font-medium text-[14px]">USN</Label>
                          <Input
                            placeholder="University roll number"
                            value={member.usn}
                            onChange={(e) => updateMember(idx, "usn", e.target.value)}
                            className={fieldClass(`m-${idx}-usn`)}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#F5F5F5] font-medium text-[14px]">IEEE ID</Label>
                          <Input
                            placeholder="Active IEEE membership"
                            value={member.ieeeId}
                            onChange={(e) => updateMember(idx, "ieeeId", e.target.value)}
                            className={fieldClass(`m-${idx}-ieeeId`)}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#F5F5F5] font-medium text-[14px]">Year of Study</Label>
                          <Select
                            value={member.yearOfStudy}
                            onValueChange={(value) => updateMember(idx, "yearOfStudy", value)}
                          >
                            <SelectTrigger className={selectClass(`m-${idx}-yearOfStudy`)}>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121214] border-[#24242A] text-white">
                              {yearOptions.map((value) => (
                                <SelectItem key={`${idx}-${value}`} value={value} className="focus:bg-[#1F1F24]">
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
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="ideaTitle">
                      Project Title
                    </Label>
                    <Input
                      id="ideaTitle"
                      placeholder="What is your hack called?"
                      value={formData.ideaTitle}
                      onChange={(e) => updateField("ideaTitle", e.target.value)}
                      className={fieldClass("ideaTitle")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="ideaDescription">
                      Executive Summary
                    </Label>
                    <Textarea
                      id="ideaDescription"
                      maxLength={300}
                      placeholder="Briefly describe the core problem, your proposed solution, and expected impact (max 300 chars)."
                      value={formData.ideaDescription}
                      onChange={(e) => updateField("ideaDescription", e.target.value)}
                      className={cn(fieldClass("ideaDescription"), "min-h-[160px] py-4 resize-none")}
                    />
                    <div className="flex justify-end">
                      <p className={cn("text-xs transition-colors", formData.ideaDescription.length >= 300 ? "text-[#EF4444]" : "text-[#71717A]")}>
                        {formData.ideaDescription.length} / 300
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#F5F5F5] font-medium text-[14px]" htmlFor="pptLink">
                      Presentation Deck (Google Drive)
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
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/40 p-5">
                      <h4 className="text-[#71717A] text-[12px] font-medium tracking-widest uppercase mb-3">Team</h4>
                      <p className="text-[15px] text-[#F5F5F5] font-medium">{formData.teamName}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">{tracks.find((t) => t.value === formData.track)?.label || "-"}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">{formData.teamSize} Members</p>
                    </div>

                    <div className="rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/40 p-5">
                      <h4 className="text-[#71717A] text-[12px] font-medium tracking-widest uppercase mb-3">Leader</h4>
                      <p className="text-[15px] text-[#F5F5F5] font-medium">{formData.leaderName}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">{formData.leaderEmail}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">+91 {formData.leaderMobile}</p>
                    </div>

                    <div className="rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/40 p-5 md:col-span-2">
                      <h4 className="text-[#71717A] text-[12px] font-medium tracking-widest uppercase mb-3">Institution</h4>
                      <p className="text-[15px] text-[#F5F5F5] font-medium">{formData.collegeName}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">{formData.department} · Year {formData.collegeYear}</p>
                      <p className="text-[14px] text-[#A1A1AA] mt-1">ID: {formData.collegeId}</p>
                    </div>

                    <div className="rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/40 p-5 md:col-span-2">
                      <h4 className="text-[#71717A] text-[12px] font-medium tracking-widest uppercase mb-3">Project Idea</h4>
                      <p className="text-[15px] text-[#F5F5F5] font-medium">{formData.ideaTitle}</p>
                      <p className="mt-2 text-[14px] text-[#A1A1AA] leading-relaxed">{formData.ideaDescription}</p>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-[#24242A]/60 bg-[#0A0A0A]/40 p-5">
                    <h4 className="text-[#71717A] text-[12px] font-medium tracking-widest uppercase mb-1">Agreements</h4>
                    
                    <label className="flex items-center gap-3 cursor-pointer group py-1">
                      <Checkbox
                        checked={formData.confirmIeee}
                        onCheckedChange={(checked) => updateField("confirmIeee", Boolean(checked))}
                        className="h-5 w-5 rounded-md border-[#3F3F46] data-[state=checked]:bg-[#F59E0B] data-[state=checked]:text-[#050505] data-[state=checked]:border-[#F59E0B]"
                      />
                      <span className={cn("text-[14px] transition-colors group-hover:text-[#F5F5F5]", errors.confirmIeee ? "text-[#EF4444]" : "text-[#A1A1AA]")}>
                        All members currently hold active IEEE memberships
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group py-1">
                      <Checkbox
                        checked={formData.confirmAccurate}
                        onCheckedChange={(checked) => updateField("confirmAccurate", Boolean(checked))}
                        className="h-5 w-5 rounded-md border-[#3F3F46] data-[state=checked]:bg-[#F59E0B] data-[state=checked]:text-[#050505] data-[state=checked]:border-[#F59E0B]"
                      />
                      <span className={cn("text-[14px] transition-colors group-hover:text-[#F5F5F5]", errors.confirmAccurate ? "text-[#EF4444]" : "text-[#A1A1AA]")}>
                        All provided information is accurate and final
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group py-1">
                      <Checkbox
                        checked={formData.confirmTerms}
                        onCheckedChange={(checked) => updateField("confirmTerms", Boolean(checked))}
                        className="h-5 w-5 rounded-md border-[#3F3F46] data-[state=checked]:bg-[#F59E0B] data-[state=checked]:text-[#050505] data-[state=checked]:border-[#F59E0B]"
                      />
                      <span className={cn("text-[14px] transition-colors group-hover:text-[#F5F5F5]", errors.confirmTerms ? "text-[#EF4444]" : "text-[#A1A1AA]")}>
                        I agree to EPOCH '26 Terms and Conditions
                      </span>
                    </label>

                    <div className="mt-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 p-4 flex items-start gap-3">
                      <div className="mt-0.5 text-[#F59E0B]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[14px] text-[#F5F5F5] font-medium">Round 1 Registration Fee: ₹300 / team</p>
                        <p className="text-[13px] text-[#F59E0B]/80 mt-1">Payment links will be securely shared post-screening.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        </AnimatePresence>

        <div className="px-6 py-6 sm:px-10 bg-[#0A0A0A]/50 border-t border-[#24242A]/50">
          <div className="flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-[#A1A1AA] text-[14px] font-medium">
                Step {currentStep + 1} of {steps.length} <span className="mx-2 opacity-50">·</span> {currentStepName}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                type="button"
                onClick={goBack}
                disabled={currentStep === 0 || isSubmitting}
                className={cn(
                  "h-12 px-6 rounded-xl font-medium transition-all",
                  currentStep === 0 ? "opacity-0 cursor-default" : "bg-transparent text-[#A1A1AA] hover:text-white hover:bg-[#1F1F24]"
                )}
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={goNext}
                disabled={isSubmitting}
                className="h-12 px-8 min-w-[140px] rounded-xl font-medium bg-[#F59E0B] text-[#050505] hover:bg-[#FFB833] focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-[#121214] shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
                    Processing...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  "Complete Registration"
                ) : (
                  <>
                    Continue
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
