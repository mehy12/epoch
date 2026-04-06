"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const steps = [
  { id: "team", title: "Team Info" },
  { id: "leader", title: "Team Leader" },
  { id: "college", title: "College Info" },
  { id: "members", title: "Team Members" },
  { id: "idea", title: "Idea Submission" },
  { id: "review", title: "Review" },
];

interface MemberData {
  fullName: string;
  email: string;
  usn: string;
  ieeeId: string;
  year: string;
}

interface FormData {
  teamName: string;
  track: string;
  teamSize: string;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderIeeeId: string;
  college: string;
  department: string;
  year: string;
  usn: string;
  members: MemberData[];
  ideaTitle: string;
  ideaDescription: string;
  pptLink: string;
  checkIeee: boolean;
  checkAccurate: boolean;
  checkTerms: boolean;
}

const emptyMember = (): MemberData => ({
  fullName: "",
  email: "",
  usn: "",
  ieeeId: "",
  year: "",
});

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const AMBER = "#F59E0B";

const EpochRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    teamName: "",
    track: "",
    teamSize: "",
    leaderName: "",
    leaderEmail: "",
    leaderMobile: "",
    leaderIeeeId: "",
    college: "",
    department: "",
    year: "",
    usn: "",
    members: [emptyMember(), emptyMember(), emptyMember()],
    ideaTitle: "",
    ideaDescription: "",
    pptLink: "",
    checkIeee: false,
    checkAccurate: false,
    checkTerms: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    setFormData((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, members };
    });
  };

  const teamSizeNum = parseInt(formData.teamSize || "2", 10);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
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
          formData.leaderIeeeId.trim() !== ""
        );
      case 2:
        return (
          formData.college.trim() !== "" &&
          formData.department.trim() !== "" &&
          formData.year !== "" &&
          formData.usn.trim() !== ""
        );
      case 3:
        return formData.members.slice(0, teamSizeNum - 1).every(
          (m) => m.fullName && m.email && m.usn && m.ieeeId && m.year
        );
      case 4:
        return formData.ideaTitle.trim() !== "" && formData.ideaDescription.trim() !== "";
      case 5:
        return formData.checkIeee && formData.checkAccurate && formData.checkTerms;
      default:
        return true;
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-1 border-b border-white/10 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value || "-"}</span>
    </div>
  );

  const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <p className="text-xs font-bold tracking-widest mb-2" style={{ color: AMBER }}>
        {title}
      </p>
      {children}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border shadow-md rounded-3xl overflow-hidden bg-[#1A1A1A] border-white/10 text-center px-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 size={56} color={AMBER} />
              <h2 className="text-2xl font-bold text-white tracking-tight">REGISTRATION RECEIVED.</h2>
              <p className="font-medium" style={{ color: AMBER }}>
                Screening results will be announced on April 28, 2026.
              </p>
              <p className="text-gray-400 text-sm">Check your email for confirmation.</p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-lg mx-auto py-8"
      style={{ background: "#0A0A0A", minHeight: "100vh", padding: "2rem 1rem" }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <motion.div key={index} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                className={cn("w-4 h-4 rounded-full cursor-pointer transition-colors duration-300")}
                style={{
                  background: index <= currentStep ? AMBER : "#333",
                  boxShadow: index === currentStep ? `0 0 0 4px ${AMBER}33` : "none",
                }}
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className="text-xs mt-1.5 hidden sm:block"
                style={{ color: index === currentStep ? AMBER : "#666", fontFamily: "monospace" }}
              >
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "#222" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: AMBER }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          className="border shadow-md rounded-3xl overflow-hidden"
          style={{ background: "#1A1A1A", borderColor: "#2a2a2a" }}
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial="hidden" animate="visible" exit="exit" variants={contentVariants}>
                {currentStep === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Set up your team.</CardTitle>
                      <CardDescription>Choose your track and team size.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="teamName">
                          Team Name
                        </Label>
                        <Input
                          id="teamName"
                          placeholder="e.g. Team Zenith"
                          value={formData.teamName}
                          onChange={(e) => updateFormData("teamName", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white">Track</Label>
                        <Select value={formData.track} onValueChange={(v) => updateFormData("track", v)}>
                          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#F59E0B]">
                            <SelectValue placeholder="Select a track" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                            <SelectItem value="ai-social-good">AI for Social Good</SelectItem>
                            <SelectItem value="sustainability">Sustainability Goals</SelectItem>
                            <SelectItem value="cybersecurity-blockchain">Cybersecurity & Blockchain</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white">Team Size</Label>
                        <Select value={formData.teamSize} onValueChange={(v) => updateFormData("teamSize", v)}>
                          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#F59E0B]">
                            <SelectValue placeholder="Number of members" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                            <SelectItem value="2">2 Members</SelectItem>
                            <SelectItem value="3">3 Members</SelectItem>
                            <SelectItem value="4">4 Members</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Tell us about your leader.</CardTitle>
                      <CardDescription>The team leader's details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { id: "leaderName", label: "Full Name", placeholder: "Full name", type: "text" },
                        {
                          id: "leaderEmail",
                          label: "Email Address",
                          placeholder: "email@example.com",
                          type: "email",
                        },
                        {
                          id: "leaderMobile",
                          label: "Mobile Number",
                          placeholder: "+91 XXXXX XXXXX",
                          type: "tel",
                        },
                        {
                          id: "leaderIeeeId",
                          label: "IEEE Membership ID",
                          placeholder: "IEEE ID",
                          type: "text",
                        },
                      ].map((field) => (
                        <motion.div key={field.id} variants={fadeInUp} className="space-y-2">
                          <Label className="text-white" htmlFor={field.id}>
                            {field.label}
                          </Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.id as keyof FormData] as string}
                            onChange={(e) => updateFormData(field.id as keyof FormData, e.target.value)}
                            className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                          />
                        </motion.div>
                      ))}
                      <p className="text-xs text-gray-500 font-mono">* IEEE membership is mandatory for all members</p>
                    </CardContent>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Where are you from?</CardTitle>
                      <CardDescription>Your college and academic details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="college">
                          College Name
                        </Label>
                        <Input
                          id="college"
                          placeholder="e.g. Vemana Institute of Technology"
                          value={formData.college}
                          onChange={(e) => updateFormData("college", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="department">
                          Department
                        </Label>
                        <Input
                          id="department"
                          placeholder="e.g. Computer Science"
                          value={formData.department}
                          onChange={(e) => updateFormData("department", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white">Year of Study</Label>
                        <Select value={formData.year} onValueChange={(v) => updateFormData("year", v)}>
                          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#F59E0B]">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="usn">
                          USN / College ID
                        </Label>
                        <Input
                          id="usn"
                          placeholder="e.g. 1VE21CS001"
                          value={formData.usn}
                          onChange={(e) => updateFormData("usn", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Add your teammates.</CardTitle>
                      <CardDescription>Details for remaining {teamSizeNum - 1} member(s).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Array.from({ length: teamSizeNum - 1 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="space-y-3 pl-3"
                          style={{ borderLeft: `2px solid ${AMBER}` }}
                        >
                          <p
                            className="text-xs font-bold tracking-widest"
                            style={{ color: AMBER, fontFamily: "monospace" }}
                          >
                            MEMBER {i + 2}
                          </p>
                          {[
                            {
                              field: "fullName",
                              label: "Full Name",
                              placeholder: "Full name",
                              type: "text",
                            },
                            {
                              field: "email",
                              label: "Email",
                              placeholder: "email@example.com",
                              type: "email",
                            },
                            {
                              field: "usn",
                              label: "USN / College ID",
                              placeholder: "e.g. 1VE21CS002",
                              type: "text",
                            },
                            {
                              field: "ieeeId",
                              label: "IEEE Membership ID",
                              placeholder: "IEEE ID",
                              type: "text",
                            },
                          ].map((f) => (
                            <div key={f.field} className="space-y-1">
                              <Label className="text-white text-xs">{f.label}</Label>
                              <Input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={formData.members[i][f.field as keyof MemberData]}
                                onChange={(e) => updateMember(i, f.field as keyof MemberData, e.target.value)}
                                className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                              />
                            </div>
                          ))}
                          <div className="space-y-1">
                            <Label className="text-white text-xs">Year of Study</Label>
                            <Select value={formData.members[i].year} onValueChange={(v) => updateMember(i, "year", v)}>
                              <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#F59E0B]">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Pitch your idea.</CardTitle>
                      <CardDescription>Tell us what you're building.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="ideaTitle">
                          Idea Title
                        </Label>
                        <Input
                          id="ideaTitle"
                          placeholder="Your project name"
                          value={formData.ideaTitle}
                          onChange={(e) => updateFormData("ideaTitle", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-white" htmlFor="ideaDescription">
                            Brief Description
                          </Label>
                          <span className="text-xs font-mono" style={{ color: AMBER }}>
                            {formData.ideaDescription.length}/300
                          </span>
                        </div>
                        <Textarea
                          id="ideaDescription"
                          placeholder="Describe your idea in under 300 characters..."
                          maxLength={300}
                          value={formData.ideaDescription}
                          onChange={(e) => updateFormData("ideaDescription", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B] min-h-[100px]"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label className="text-white" htmlFor="pptLink">
                          PPT / Presentation Link
                        </Label>
                        <Input
                          id="pptLink"
                          placeholder="Google Drive link to your PPT"
                          value={formData.pptLink}
                          onChange={(e) => updateFormData("pptLink", e.target.value)}
                          className="bg-[#111] border-[#333] text-white placeholder:text-gray-500 focus:border-[#F59E0B]"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Review your details.</CardTitle>
                      <CardDescription>Confirm everything before submitting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ReviewSection title="TEAM INFO">
                        <ReviewRow label="Team Name" value={formData.teamName} />
                        <ReviewRow label="Track" value={formData.track} />
                        <ReviewRow label="Team Size" value={formData.teamSize} />
                      </ReviewSection>
                      <ReviewSection title="TEAM LEADER">
                        <ReviewRow label="Name" value={formData.leaderName} />
                        <ReviewRow label="Email" value={formData.leaderEmail} />
                        <ReviewRow label="Mobile" value={formData.leaderMobile} />
                        <ReviewRow label="IEEE ID" value={formData.leaderIeeeId} />
                      </ReviewSection>
                      <ReviewSection title="COLLEGE INFO">
                        <ReviewRow label="College" value={formData.college} />
                        <ReviewRow label="Department" value={formData.department} />
                        <ReviewRow label="Year" value={formData.year} />
                        <ReviewRow label="USN" value={formData.usn} />
                      </ReviewSection>
                      <ReviewSection title="IDEA">
                        <ReviewRow label="Title" value={formData.ideaTitle} />
                        <ReviewRow label="PPT Link" value={formData.pptLink || "Not provided"} />
                      </ReviewSection>

                      <div
                        className="p-3 rounded-lg text-sm"
                        style={{ borderLeft: `3px solid ${AMBER}`, background: "#111" }}
                      >
                        <p className="text-white font-semibold">Round 1 Fee: ₹300 per team</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Payment details will be shared after screening on April 28, 2026.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        {[
                          { field: "checkIeee", label: "All team members are active IEEE members" },
                          { field: "checkAccurate", label: "All information provided is accurate" },
                          { field: "checkTerms", label: "I agree to the terms and conditions of EPOCH '26" },
                        ].map((item) => (
                          <div key={item.field} className="flex items-center space-x-3">
                            <Checkbox
                              id={item.field}
                              checked={formData[item.field as keyof FormData] as boolean}
                              onCheckedChange={(v) =>
                                updateFormData(item.field as keyof FormData, v as boolean)
                              }
                              style={{ borderColor: AMBER }}
                            />
                            <Label htmlFor={item.field} className="text-gray-300 text-sm cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 rounded-2xl border-[#333] text-white hover:bg-[#222]"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-1 rounded-2xl font-bold"
                  style={{ background: AMBER, color: "#000" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "SUBMIT REGISTRATION" : "Next"}
                      {currentStep === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="mt-4 text-center text-sm"
        style={{ color: "#555", fontFamily: "monospace" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
};

export default EpochRegistrationForm;
