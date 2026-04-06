"use client";

import { type ReactNode, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StepDef = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
};

type MemberData = {
  fullName: string;
  email: string;
  usn: string;
  ieeeId: string;
  department: string;
  year: string;
};

type FormData = {
  teamName: string;
  track: string;
  teamSize: string;
  
  // Leader info
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDept: string;
  leaderYear: string;
  leaderUsn: string;
  leaderIeeeId: string;

  // Members dynamic
  members: MemberData[];

  // Submission
  ideaTitle: string; // Not explicitly in section 4, but good for context
  ideaDescription: string;
  pptLink: string;

  // Declaration
  checkIeee: boolean;
  checkAccurate: boolean;
  checkTerms: boolean;
};

const steps: StepDef[] = [
  {
    id: "team",
    label: "Team Info",
    title: "Section 1",
    subtitle: "Team Info",
  },
  {
    id: "leader",
    label: "Leader",
    title: "Section 2",
    subtitle: "Team Leader Details",
  },
  {
    id: "members",
    label: "Members",
    title: "Section 3",
    subtitle: "Team Members",
  },
  {
    id: "submission",
    label: "Submission",
    title: "Section 4",
    subtitle: "Idea Submission",
  },
  {
    id: "declaration",
    label: "Declaration",
    title: "Section 5",
    subtitle: "Declaration",
  },
];

const emptyMember = (): MemberData => ({
  fullName: "",
  email: "",
  usn: "",
  ieeeId: "",
  department: "",
  year: "",
});

const stepMotion = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

const fieldClass = (error?: boolean) =>
  cn(
    "h-12 w-full border-b-[1.5px] bg-[#1A1A1A] px-4 text-[15px] text-white placeholder:text-zinc-500 transition-all outline-none",
    error ? "border-amber-500" : "border-amber-500/30 focus:border-amber-500"
  );

const labelClass = "block font-mono text-[10px] tracking-widest text-zinc-400 uppercase mb-1.5";

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 border-l-[3px] border-amber-500 pl-4">
      <h2 className="text-xl font-bold tracking-tight text-white uppercase">{title}</h2>
      <p className="text-sm font-medium text-zinc-400">{subtitle}</p>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500/80 font-bold">{title}</p>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-1.5 text-xs font-mono">
      <p className="text-zinc-500 uppercase">{label}</p>
      <p className="text-right text-zinc-100 break-all">{value || "-"}</p>
    </div>
  );
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    teamName: "",
    track: "",
    teamSize: "2",
    leaderName: "",
    leaderEmail: "",
    leaderMobile: "",
    leaderCollege: "",
    leaderDept: "",
    leaderYear: "",
    leaderUsn: "",
    leaderIeeeId: "",
    members: [emptyMember(), emptyMember(), emptyMember()],
    ideaTitle: "",
    ideaDescription: "",
    pptLink: "",
    checkIeee: false,
    checkAccurate: false,
    checkTerms: false,
  });

  const [formErrors, setFormErrors] = useState<Set<string>>(new Set());

  const teamSizeNum = useMemo(() => {
    const parsed = Number.parseInt(formData.teamSize || "2", 10);
    return Number.isNaN(parsed) ? 2 : parsed;
  }, [formData.teamSize]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors.has(field as string)) {
      setFormErrors((prev) => {
        const next = new Set(prev);
        next.delete(field as string);
        return next;
      });
    }
  };

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
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

  const nextStep = () => {
    if (isStepValid()) {
      if (currentStep < steps.length - 1) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      // Trigger error highlights
      const errors = new Set<string>();
      if (currentStep === 0) {
        if (!formData.teamName) errors.add("teamName");
        if (!formData.track) errors.add("track");
        if (!formData.teamSize) errors.add("teamSize");
      } else if (currentStep === 1) {
        if (!formData.leaderName) errors.add("leaderName");
        if (!formData.leaderEmail) errors.add("leaderEmail");
        if (!formData.leaderMobile) errors.add("leaderMobile");
        if (!formData.leaderCollege) errors.add("leaderCollege");
        if (!formData.leaderDept) errors.add("leaderDept");
        if (!formData.leaderYear) errors.add("leaderYear");
        if (!formData.leaderUsn) errors.add("leaderUsn");
        if (!formData.leaderIeeeId) errors.add("leaderIeeeId");
      }
      setFormErrors(errors);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      setIsSubmitting(true);
      window.setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1300);
    } else {
       // Highlight errors for final step
       const errors = new Set<string>();
       if (!formData.checkIeee) errors.add("checkIeee");
       if (!formData.checkAccurate) errors.add("checkAccurate");
       if (!formData.checkTerms) errors.add("checkTerms");
       setFormErrors(errors);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.teamName.trim() !== "" && formData.track !== "" && formData.teamSize !== "";
      case 1:
        return (
          formData.leaderName.trim() !== "" &&
          formData.leaderEmail.trim() !== "" &&
          formData.leaderMobile.trim() !== "" &&
          formData.leaderCollege.trim() !== "" &&
          formData.leaderDept.trim() !== "" &&
          formData.leaderYear !== "" &&
          formData.leaderUsn.trim() !== "" &&
          formData.leaderIeeeId.trim() !== ""
        );
      case 2:
        return formData.members.slice(0, teamSizeNum - 1).every(
          (m) => m.fullName && m.email && m.usn && m.ieeeId && m.department && m.year
        );
      case 3:
        return formData.ideaDescription.trim() !== "" && formData.pptLink.trim() !== "";
      case 4:
        return formData.checkIeee && formData.checkAccurate && formData.checkTerms;
      default:
        return true;
    }
  };

  const progressPct = (currentStep / (steps.length - 1)) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5">
            <CheckCircle2 className="h-10 w-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">
              EPOCH &apos;26 — Registration Received
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              Screening results will be announced April 28, 2026. Check your email for further instructions.
            </p>
          </div>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Redirecting in</p>
            <p className="text-4xl font-mono text-amber-500 font-bold tabular-nums">00:05</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-12 font-sans text-white sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Top Stepper */}
        <div className="mb-12">
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isDone = index < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (index < currentStep) setCurrentStep(index);
                    }}
                    className={cn(
                      "h-3 w-3 rounded-full transition-all duration-300",
                      isCurrent && "bg-white ring-4 ring-white/20",
                      isDone && "bg-amber-500",
                      !isCurrent && !isDone && "bg-zinc-800"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-mono tracking-widest uppercase transition-colors duration-300",
                      isCurrent ? "text-white font-bold" : "text-zinc-600"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
            {/* Progress Line */}
            <div className="absolute top-[5px] left-0 w-full h-[1px] bg-zinc-800 -z-0" />
            <motion.div
              className="absolute top-[5px] left-0 h-[1px] bg-amber-500 -z-0"
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <Card className="w-full border-none bg-transparent shadow-none">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepMotion}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <CardContent className="p-0">
                <SectionHeader title={steps[currentStep].title} subtitle={steps[currentStep].subtitle} />

                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <Label className={labelClass}>Team Name</Label>
                      <Input
                        value={formData.teamName}
                        onChange={(e) => updateFormData("teamName", e.target.value)}
                        placeholder="e.g. Team Zenith"
                        className={fieldClass(formErrors.has("teamName"))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className={labelClass}>Track</Label>
                      <Select value={formData.track} onValueChange={(value) => updateFormData("track", value)}>
                        <SelectTrigger className={fieldClass(formErrors.has("track"))}>
                          <SelectValue placeholder="Select a track" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
                          <SelectItem value="ai-social-good">AI for Social Good</SelectItem>
                          <SelectItem value="sustainability">Sustainability Goals</SelectItem>
                          <SelectItem value="cybersecurity-blockchain">Cybersecurity & Blockchain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className={labelClass}>Team Size</Label>
                      <Select value={formData.teamSize} onValueChange={(value) => updateFormData("teamSize", value)}>
                        <SelectTrigger className={fieldClass(formErrors.has("teamSize"))}>
                          <SelectValue placeholder="Number of members" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
                          <SelectItem value="2">2 Members</SelectItem>
                          <SelectItem value="3">3 Members</SelectItem>
                          <SelectItem value="4">4 Members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {[
                      { id: "leaderName", label: "Full Name", placeholder: "Full name", type: "text" },
                      { id: "leaderEmail", label: "Email Address", placeholder: "email@example.com", type: "email" },
                      { id: "leaderMobile", label: "Mobile Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
                      { id: "leaderCollege", label: "College Name", placeholder: "College Name", type: "text" },
                      { id: "leaderDept", label: "Department", placeholder: "e.g. CSE", type: "text" },
                      { id: "leaderUsn", label: "USN / College ID", placeholder: "USN/ID", type: "text" },
                      { id: "leaderIeeeId", label: "IEEE Membership ID", placeholder: "IEEE ID", type: "text" },
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className={labelClass}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id as keyof FormData] as string}
                          onChange={(e) => updateFormData(field.id as keyof FormData, e.target.value)}
                          className={fieldClass(formErrors.has(field.id))}
                        />
                        {field.id === "leaderIeeeId" && (
                          <p className="text-[10px] text-amber-500/60 font-mono italic mt-1">
                            * IEEE membership is mandatory for all members
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <Label className={labelClass}>Year of Study</Label>
                      <Select value={formData.leaderYear} onValueChange={(value) => updateFormData("leaderYear", value)}>
                        <SelectTrigger className={fieldClass(formErrors.has("leaderYear"))}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    {Array.from({ length: teamSizeNum - 1 }).map((_, memberIndex) => (
                      <motion.div
                        key={memberIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: memberIndex * 0.1 }}
                        className="space-y-6 pt-6 border-t border-white/5 first:border-t-0 first:pt-0"
                      >
                        <p className="text-[10px] font-mono tracking-widest text-amber-500/80 font-bold uppercase">
                          Member {memberIndex + 2}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        {[
                          { field: "fullName", label: "Full Name", placeholder: "Full name", type: "text" },
                          { field: "email", label: "Email", placeholder: "email@example.com", type: "email" },
                          { field: "usn", label: "USN / College ID", placeholder: "USN/ID", type: "text" },
                          { field: "ieeeId", label: "IEEE Membership ID", placeholder: "IEEE ID", type: "text" },
                          { field: "department", label: "Department", placeholder: "Department", type: "text" },
                        ].map((field) => (
                          <div key={field.field} className="space-y-1.5">
                            <Label className={labelClass}>{field.label}</Label>
                            <Input
                              type={field.type}
                              value={formData.members[memberIndex][field.field as keyof MemberData]}
                              onChange={(e) =>
                                updateMember(memberIndex, field.field as keyof MemberData, e.target.value)
                              }
                              placeholder={field.placeholder}
                              className={fieldClass()}
                            />
                          </div>
                        ))}
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Year of Study</Label>
                          <Select
                            value={formData.members[memberIndex].year}
                            onValueChange={(value) => updateMember(memberIndex, "year", value)}
                          >
                            <SelectTrigger className={fieldClass()}>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <Label className={labelClass}>Brief Idea Description</Label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {formData.ideaDescription.length}/300
                        </span>
                      </div>
                      <Textarea
                        maxLength={300}
                        value={formData.ideaDescription}
                        onChange={(e) => updateFormData("ideaDescription", e.target.value)}
                        placeholder="Describe your idea in under 300 characters..."
                        className={cn(fieldClass(formErrors.has("ideaDescription")), "min-h-[120px] py-4 resize-none")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className={labelClass}>PPT / Presentation Link (Google Drive)</Label>
                      <Input
                        value={formData.pptLink}
                        onChange={(e) => updateFormData("pptLink", e.target.value)}
                        placeholder="Drive link to your PPT"
                        className={fieldClass(formErrors.has("pptLink"))}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                      {[
                        { field: "checkIeee", label: "All team members are active IEEE members" },
                        { field: "checkAccurate", label: "The information provided is accurate" },
                        { field: "checkTerms", label: "I agree to the terms and conditions of EPOCH '26" },
                      ].map((item) => (
                        <label
                          key={item.field}
                          className={cn(
                            "flex items-start gap-4 p-4 transition-all duration-300 border border-white/5 bg-[#141414] hover:bg-[#1A1A1A] cursor-pointer group",
                            formErrors.has(item.field) && "border-amber-500/50 bg-amber-500/5"
                          )}
                        >
                          <Checkbox
                            checked={formData[item.field as keyof FormData] as boolean}
                            onCheckedChange={(value) =>
                              updateFormData(item.field as keyof FormData, Boolean(value))
                            }
                            className="mt-0.5 border-zinc-700 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black"
                          />
                          <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase font-mono tracking-tight leading-relaxed">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="p-4 border border-amber-500/20 bg-amber-500/5 space-y-1">
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-tight">Round 1 Fee: ₹300 per team</p>
                      <p className="text-[10px] text-amber-500/60 font-mono">
                        Payment details will be shared after screening on April 28.
                      </p>
                    </div>
                  </div>
                )}

                <CardFooter className="flex flex-col items-stretch gap-6 p-0 mt-10">
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 rounded-full border border-white/5 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all font-mono text-[10px] uppercase tracking-widest"
                  >
                    <ChevronLeft className="mr-2 h-3.5 w-3.5" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    disabled={isSubmitting}
                    className={cn(
                      "w-full sm:min-w-[200px] h-12 rounded-full font-bold uppercase tracking-tighter transition-all duration-300",
                      currentStep === steps.length - 1
                        ? "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        : "bg-white text-black hover:bg-zinc-200"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{currentStep === steps.length - 1 ? "Submit Registration" : "Next Section"}</span>
                        {currentStep === steps.length - 1 ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <p className="text-[9px] font-mono tracking-[0.3em] text-zinc-600 uppercase">
                    Step {currentStep + 1} // {steps.length}
                  </p>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
              </CardFooter>
            </CardContent>
          </motion.div>
        </AnimatePresence>
      </Card>
      </div>
    </div>
  );
}
