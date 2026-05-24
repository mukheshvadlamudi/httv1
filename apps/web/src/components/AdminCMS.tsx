import React, { useState } from "react";
import { Sparkles, Plus, Trash2, CheckCircle2, ArrowRight, Settings } from "lucide-react";
import { Guide, GuideStep, GlossaryTerm } from "../data/mock-guides";

interface AdminCMSProps {
  onPublish: (newGuide: Guide) => void;
}

export function AdminCMS({ onPublish }: AdminCMSProps) {
  // Guide Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Email");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Dynamic Array States
  const [steps, setSteps] = useState<GuideStep[]>([
    { order: 1, title: "Step 1 Action", body: "Detailed plain-language instructions here." }
  ]);
  
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([
    { term: "Recovery email", definition: "A backup email address to help secure your account." }
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  // Steps manipulators
  const handleAddStep = () => {
    setSteps([...steps, { order: steps.length + 1, title: "", body: "" }]);
  };

  const handleRemoveStep = (idx: number) => {
    const updated = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
    setSteps(updated);
  };

  const handleStepChange = (idx: number, field: "title" | "body", val: string) => {
    const updated = steps.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    setSteps(updated);
  };

  // Glossary manipulators
  const handleAddGlossary = () => {
    setGlossary([...glossary, { term: "", definition: "" }]);
  };

  const handleRemoveGlossary = (idx: number) => {
    setGlossary(glossary.filter((_, i) => i !== idx));
  };

  const handleGlossaryChange = (idx: number, field: "term" | "definition", val: string) => {
    const updated = glossary.map((g, i) => i === idx ? { ...g, [field]: val } : g);
    setGlossary(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    const tagsArray = tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0);

    const newGuide: Guide = {
      id: slug,
      slug: slug,
      title: title,
      description: description,
      category: category,
      audience: "Beginner",
      difficulty: difficulty,
      estimatedMinutes: Number(estimatedMinutes),
      lastUpdated: new Date().toISOString().split("T")[0],
      steps: steps,
      glossary: glossary.filter((g) => g.term.trim().length > 0),
      tags: tagsArray
    };

    onPublish(newGuide);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* CMS Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900">Admin Guide Publishing Panel</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Author new guides and inject them directly into your local library in real-time.</p>
          </div>
        </div>
      </div>

      {/* Success Notification overlay */}
      {isSuccess ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-6 h-6 animate-bounce" />
          </div>
          <h4 className="font-sans font-bold text-base text-slate-900">Guide Published Successfully!</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
            Your new guide **{title}** has been injected into our in-memory database and is immediately available in the Guide Library!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setTitle("");
                setSlug("");
                setDescription("");
                setTagsInput("");
                setSteps([{ order: 1, title: "Step 1 Action", body: "Detailed plain-language instructions here." }]);
                setGlossary([{ term: "Recovery email", definition: "A backup email address to help secure your account." }]);
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors bg-white shadow-sm"
            >
              Publish Another
            </button>
          </div>
        </div>
      ) : (
        /* The CMS form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Meta Information */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-1 border-b border-slate-50 pb-3 mb-4">
              1. Guide Meta Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Guide Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Autofill slug
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                  }}
                  placeholder="e.g. How to recover a Facebook Account"
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. recover-facebook-account"
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs bg-slate-50 shadow-inner outline-none text-slate-600"
                >
                  <option value="Email">Email</option>
                  <option value="Security">Security</option>
                  <option value="AI & Tools">AI & Tools</option>
                  <option value="Communication">Communication</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs bg-slate-50 shadow-inner outline-none text-slate-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Est. Minutes
                </label>
                <input
                  type="number"
                  required
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Description / Subtitle
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief, plain-language summary of what the user will learn or do."
                className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. facebook, account recovery, security"
                className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
              />
            </div>
          </div>

          {/* Section 2: Steps Array */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-1">
                2. Step-by-Step Instructions
              </h4>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="border border-slate-100 rounded-2xl p-4 md:p-5 relative bg-slate-50/50">
                  <div className="absolute top-4 right-4">
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 text-[10px] font-bold bg-slate-900 text-white rounded-full flex items-center justify-center">
                      {step.order}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step Details</span>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                      placeholder={`e.g. Step ${idx + 1} action title`}
                      className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 bg-white rounded-xl text-xs outline-none"
                    />
                    <textarea
                      required
                      value={step.body}
                      onChange={(e) => handleStepChange(idx, "body", e.target.value)}
                      placeholder="Plain language instructions, avoiding any tech jargon."
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 bg-white rounded-xl text-xs outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Glossary Terms */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-1">
                3. Plain-Language Glossary Terms
              </h4>
              <button
                type="button"
                onClick={handleAddGlossary}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Term
              </button>
            </div>

            <div className="space-y-3">
              {glossary.map((gloss, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start border border-slate-100 rounded-2xl p-4 bg-slate-50/50 relative">
                  <div className="absolute top-4 right-4 sm:static">
                    <button
                      type="button"
                      onClick={() => handleRemoveGlossary(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={gloss.term}
                    onChange={(e) => handleGlossaryChange(idx, "term", e.target.value)}
                    placeholder="Technical term (e.g. Phishing)"
                    className="w-full sm:w-1/3 px-4 py-2 border border-slate-200 focus:border-slate-400 bg-white rounded-xl text-xs outline-none"
                  />

                  <input
                    type="text"
                    value={gloss.definition}
                    onChange={(e) => handleGlossaryChange(idx, "definition", e.target.value)}
                    placeholder="Simple definition in plain words"
                    className="w-full sm:w-2/3 px-4 py-2 border border-slate-200 focus:border-slate-400 bg-white rounded-xl text-xs outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Publish New Guide
          </button>
        </form>
      )}
    </div>
  );
}
