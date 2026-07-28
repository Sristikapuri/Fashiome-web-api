"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { handleGenerateProfileFromImage } from "@/lib/actions/home-action";
import { handleSaveSilhouetteProfile } from "@/lib/actions/silhouette-action";

// ─── Data ────────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { key: "male", label: "MALE", emoji: "♂" },
  { key: "female", label: "FEMALE", emoji: "♀" },
  { key: "nb", label: "NON-BINARY", emoji: "⚧" },
];

const BUILD_PILLS = [
  { key: "slim", label: "SLIM", icon: "🏃" },
  { key: "athletic", label: "ATHLETIC", icon: "💪" },
  { key: "rectangle", label: "RECTANGLE", icon: "⬜" },
  { key: "inverted_triangle", label: "INV TRIANGLE", icon: "🔺" },
  { key: "pear", label: "PEAR", icon: "🍐" },
  { key: "curvy", label: "CURVY", icon: "⌛" },
];

const SKIN_TONE_CARDS = [
  {
    key: "fair",
    title: "Tone 01",
    label: "Fair",
    from: "#EFE1D3",
    to: "#D9C3B3",
  },
  {
    key: "olive",
    title: "Tone 02",
    label: "Olive",
    from: "#E2C58F",
    to: "#8C5A32",
  },
  {
    key: "deep",
    title: "Tone 03",
    label: "Deep",
    from: "#B57646",
    to: "#5F351E",
  },
];

const SHADE_OPTIONS = [
  { key: "fair", hex: "#EBDCcB" },
  { key: "light", hex: "#E9C99D" },
  { key: "warm", hex: "#D0A16C" },
  { key: "olive", hex: "#B57941" },
  { key: "deep", hex: "#6D4428" },
];

const FACE_SHAPES = [
  { key: "oval", label: "OVAL", icon: "🥚" },
  { key: "square", label: "SQUARE", icon: "⬜" },
  { key: "round", label: "ROUND", icon: "⭕" },
  { key: "heart", label: "HEART", icon: "🫀" },
];

const STEP_HEADERS = [
  {
    title: "Curate Your Silhouette",
    subtitle: "Step 1 of 3: Personalised fit details.",
  },
  {
    title: "Choose your skin tone\nfor perfect colour matching",
    subtitle:
      "Our AI uses this to curate high-end fashion suggestions that complement your natural radiance.",
  },
  {
    title: "Discover your\nperfect fit",
    subtitle:
      "Step 3 of 3: Select your face shape or upload a portrait for AI-powered personalisation.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SilhouettePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(0); // 0 | 1 | 2
  const [loading, setLoading] = useState(false);
  const [analyzingPortrait, setAnalyzingPortrait] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  // Step-1 state
  const [gender, setGender] = useState("female");
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [build, setBuild] = useState("slim");

  // Step-2 state
  const [skinTone, setSkinTone] = useState("fair");

  // Step-3 state
  const [faceShape, setFaceShape] = useState("oval");

  const nextStep = () => {
    setError(null);
    if (step === 0 && !gender) {
      setError("Please select a gender to continue.");
      return;
    }
    if (step === 1 && !skinTone) {
      setError("Choose a skin tone before continuing.");
      return;
    }
    if (step < 2) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
  };

  const handlePortraitSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPortraitPreview(URL.createObjectURL(file));
    setAnalyzingPortrait(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await handleGenerateProfileFromImage({
        imageFormData: formData,
        profileData: {
          gender,
          height,
          weight,
          bodyType: build,
          skinTone: SKIN_TONE_CARDS.find((t) => t.key === skinTone)?.label ?? "Fair",
          skinToneHex: SHADE_OPTIONS.find((s) => s.key === skinTone)?.hex ?? "#EBDCcB",
          faceShape,
        },
        source: "Silhouette Portrait Upload",
      });
      if (result.success && result.data?.profileData) {
        const a = result.data.profileData;
        if (a.gender) setGender(a.gender);
        if (a.height) setHeight(a.height);
        if (a.weight) setWeight(a.weight);
        if (a.bodyType) setBuild(a.bodyType);
        if (a.faceShape) setFaceShape(a.faceShape);
      }
    } catch {
      // silently keep manual selections
    } finally {
      setAnalyzingPortrait(false);
    }
  };

  const submitProfile = async () => {
    if (!faceShape) {
      setError("Select a face shape or upload a portrait first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await handleSaveSilhouetteProfile({
        gender,
        height,
        weight,
        bodyType: build,
        skinTone: SKIN_TONE_CARDS.find((t) => t.key === skinTone)?.label ?? "Fair",
        skinToneHex: SHADE_OPTIONS.find((s) => s.key === skinTone)?.hex ?? "#EBDCcB",
        faceShape,
        portraitAnalyzed: !!portraitPreview,
      });
      router.push("/dashboard");
    } catch {
      setError("Unable to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const primaryLabel =
    step === 0 ? "CONTINUE" : step === 1 ? "CONFIRM SELECTION" : "ANALYSE MY STYLE";

  return (
    <div
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#FFF5F5", fontFamily: "'Inter', sans-serif" }}
    >
      {/* App Bar */}
      <header
        style={{
          background: "#FFF5F5",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F0DADA",
        }}
      >
        <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#820000" }}>
          FashioMe
        </span>
        <span style={{ fontSize: 20, color: "#A41515", cursor: "pointer" }} title="Help">?</span>
      </header>

      {/* Progress Header */}
      <div style={{ padding: "20px 24px 0", background: "#FFF5F5" }}>
        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: i <= step ? "#820000" : "#E7BCBC",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#3E2723",
            margin: "0 0 6px",
            whiteSpace: "pre-line",
            lineHeight: 1.2,
          }}
        >
          {STEP_HEADERS[step].title}
        </h1>
        <p style={{ fontSize: 13, color: "#735656", margin: 0, lineHeight: 1.5 }}>
          {STEP_HEADERS[step].subtitle}
        </p>
      </div>

      {/* Step Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px 0" }}>
        {step === 0 && (
          <StepOne
            gender={gender} setGender={setGender}
            height={height} setHeight={setHeight}
            weight={weight} setWeight={setWeight}
            build={build} setBuild={setBuild}
          />
        )}
        {step === 1 && (
          <StepTwo skinTone={skinTone} setSkinTone={setSkinTone} />
        )}
        {step === 2 && (
          <StepThree
            faceShape={faceShape} setFaceShape={setFaceShape}
            portraitPreview={portraitPreview}
            analyzingPortrait={analyzingPortrait}
            onUpload={() => fileInputRef.current?.click()}
            onRemove={() => { setPortraitPreview(null); }}
          />
        )}
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePortraitSelected}
      />

      {/* Bottom Action Bar */}
      <div
        style={{
          padding: "14px 24px 24px",
          background: "#FFECEC",
          borderTop: "1px solid #E7BCBC",
        }}
      >
        {error && (
          <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12, textAlign: "center" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={prevStep}
            disabled={step === 0}
            style={{
              flex: 1,
              padding: "15px 0",
              borderRadius: 14,
              border: "1px solid #D9A8A8",
              background: "transparent",
              color: step === 0 ? "#D9A8A8" : "#3E2723",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              cursor: step === 0 ? "default" : "pointer",
              transition: "background 0.2s",
            }}
          >
            BACK
          </button>
          <button
            onClick={step === 2 ? submitProfile : nextStep}
            disabled={loading}
            style={{
              flex: 2,
              padding: "15px 0",
              borderRadius: 14,
              border: "none",
              background: loading ? "#A8A8A8" : "#820000",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              cursor: loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.2s",
            }}
          >
            {loading ? (
              <span
                style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : primaryLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 999px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #820000; cursor: pointer; box-shadow: 0 1px 4px rgba(130,0,0,0.3); }
        input[type=range]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #820000; cursor: pointer; border: none; }
      `}</style>
    </div>
  );
}

// ─── Step 1: Body Profile ─────────────────────────────────────────────────────

function StepOne({
  gender, setGender,
  height, setHeight,
  weight, setWeight,
  build, setBuild,
}: {
  gender: string; setGender: (v: string) => void;
  height: number; setHeight: (v: number) => void;
  weight: number; setWeight: (v: number) => void;
  build: string; setBuild: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 24 }}>
      {/* Gender */}
      <div>
        <SectionLabel>SELECT GENDER</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              style={{
                flex: 1,
                padding: "18px 4px 14px",
                borderRadius: 16,
                border: "none",
                background: gender === g.key ? "#820000" : "#FFECEC",
                color: gender === g.key ? "#fff" : "#820000",
                cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                transition: "all 0.2s",
                boxShadow: gender === g.key ? "0 4px 12px rgba(130,0,0,0.25)" : "none",
              }}
            >
              <span style={{ fontSize: 24 }}>{g.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Height */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <SectionLabel>HEIGHT</SectionLabel>
          <span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#820000" }}>{height}</span>
            <span style={{ fontSize: 13, color: "#735656" }}> cm</span>
          </span>
        </div>
        <input
          type="range" min={140} max={210} value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          style={{ width: "100%", background: `linear-gradient(to right, #820000 ${((height - 140) / 70) * 100}%, #E7BCBC ${((height - 140) / 70) * 100}%)` }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "#B08080" }}>140cm</span>
          <span style={{ fontSize: 11, color: "#B08080" }}>210cm</span>
        </div>
      </div>

      {/* Weight card */}
      <div>
        <SectionLabel>BODY TYPE &amp; WEIGHT</SectionLabel>
        <div
          style={{
            marginTop: 12, padding: 18, borderRadius: 24,
            background: "#FFECEC",
            boxShadow: "0 2px 8px rgba(130,0,0,0.07)",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, color: "#735656", textTransform: "uppercase" }}>
            Current Weight
          </span>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#820000" }}>{weight}</span>
            <span style={{ fontSize: 14, color: "#735656", marginLeft: 4 }}>Kilograms</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <input
              type="range" min={40} max={120} value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              style={{ width: "100%", background: `linear-gradient(to right, #A41515 ${((weight - 40) / 80) * 100}%, #D9A8A8 ${((weight - 40) / 80) * 100}%)` }}
            />
          </div>
        </div>
      </div>

      {/* Body Build Pills */}
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
          {BUILD_PILLS.map((b) => (
            <button
              key={b.key}
              onClick={() => setBuild(b.key)}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: `1.5px solid ${build === b.key ? "#820000" : "#E7BCBC"}`,
                background: build === b.key ? "#820000" : "#FFECEC",
                color: build === b.key ? "#fff" : "#820000",
                cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                minWidth: 80,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8 }}>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style inspiration banner */}
      <div
        style={{
          borderRadius: 20, overflow: "hidden",
          background: "linear-gradient(135deg, #5F0000 0%, #820000 50%, #A41515 100%)",
          padding: "22px 20px",
          position: "relative",
          minHeight: 100,
        }}
      >
        <div
          style={{
            position: "absolute", right: 18, top: 12, bottom: 12, width: 80,
            borderRadius: 16, background: "rgba(255,255,255,0.15)",
          }}
        />
        <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, maxWidth: "70%", lineHeight: 1.4, margin: 0, position: "relative" }}>
          We curate based on your unique proportions.
        </p>
      </div>
    </div>
  );
}

// ─── Step 2: Skin Tone ────────────────────────────────────────────────────────

function StepTwo({ skinTone, setSkinTone }: { skinTone: string; setSkinTone: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 24 }}>
      {/* Large Tone Cards – horizontal scroll */}
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
        {SKIN_TONE_CARDS.map((tone) => {
          const selected = skinTone === tone.key;
          return (
            <button
              key={tone.key}
              onClick={() => setSkinTone(tone.key)}
              style={{
                minWidth: 160, height: 240, borderRadius: 24,
                border: `${selected ? 2 : 1}px solid ${selected ? "#820000" : "#E7BCBC"}`,
                background: `linear-gradient(to bottom, ${tone.from}, ${tone.to})`,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: selected ? "0 6px 20px rgba(130,0,0,0.25)" : "none",
                transition: "all 0.2s",
                flexShrink: 0,
                padding: "14px 14px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            >
              {selected && (
                <div
                  style={{
                    position: "absolute", top: 12, right: 12,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "#820000", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 13 }}>✓</span>
                </div>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.85)" }}>
                {tone.title}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>
                {tone.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* All Shades row */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionLabel>ALL SHADES</SectionLabel>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#A41515" }}>GUIDE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {SHADE_OPTIONS.map((shade) => {
            const isSelected = skinTone === shade.key;
            return (
              <button
                key={shade.key}
                onClick={() => setSkinTone(shade.key)}
                style={{
                  width: 48, height: 48,
                  borderRadius: "50%",
                  background: shade.hex,
                  border: `3px solid ${isSelected ? "#820000" : "transparent"}`,
                  outline: isSelected ? "3px solid rgba(130,0,0,0.2)" : "none",
                  outlineOffset: 2,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transform: isSelected ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Colour info card */}
      <div
        style={{
          padding: "16px 18px", borderRadius: 16,
          background: "#FFECEC", border: "1px solid #E7BCBC",
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "#735656", lineHeight: 1.5 }}>
          💡 <strong style={{ color: "#820000" }}>AI tip:</strong> Your skin tone helps our model suggest colour palettes, fabric finishes, and pattern contrasts that naturally complement you.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Face & Portrait ──────────────────────────────────────────────────

function StepThree({
  faceShape, setFaceShape,
  portraitPreview, analyzingPortrait,
  onUpload, onRemove,
}: {
  faceShape: string; setFaceShape: (v: string) => void;
  portraitPreview: string | null;
  analyzingPortrait: boolean;
  onUpload: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 24 }}>
      {/* Portrait Upload Card */}
      <div
        style={{
          borderRadius: 24, border: "1px solid #E7BCBC",
          background: "#FFECEC", padding: 20,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          textAlign: "center",
        }}
      >
        {portraitPreview ? (
          <>
            <div style={{ position: "relative", width: 96, height: 96 }}>
              <Image
                src={portraitPreview}
                alt="Portrait preview"
                width={96} height={96}
                unoptimized
                style={{ borderRadius: "50%", objectFit: "cover", width: 96, height: 96 }}
              />
              {analyzingPortrait && (
                <div
                  style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "rgba(130,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onUpload}
                style={{
                  padding: "8px 16px", borderRadius: 999,
                  border: "1px solid #D9A8A8", background: "transparent",
                  color: "#820000", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                Change
              </button>
              <button
                onClick={onRemove}
                style={{
                  padding: "8px 16px", borderRadius: 999,
                  border: "none", background: "#820000",
                  color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "#F5D0D0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
              }}
            >
              📷
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#3E2723", fontSize: 15 }}>
                Upload Your Portrait
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#735656", lineHeight: 1.5 }}>
                Helps AI analyse your features accurately
              </p>
            </div>
            <button
              onClick={onUpload}
              style={{
                padding: "10px 28px", borderRadius: 999,
                border: "1.5px solid #820000", background: "transparent",
                color: "#820000", fontSize: 13, fontWeight: 700, cursor: "pointer",
                letterSpacing: 0.5,
              }}
            >
              CHOOSE PHOTO
            </button>
          </>
        )}
      </div>

      {/* Face Shape Grid */}
      <div>
        <SectionLabel>SELECT FACE SHAPE</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14, marginTop: 12,
          }}
        >
          {FACE_SHAPES.map((shape) => {
            const selected = faceShape === shape.key;
            return (
              <button
                key={shape.key}
                onClick={() => setFaceShape(shape.key)}
                style={{
                  padding: "18px 10px 14px",
                  borderRadius: 20,
                  border: `${selected ? 2 : 1}px solid ${selected ? "#820000" : "#E7BCBC"}`,
                  background: selected ? "#820000" : "#FFECEC",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "all 0.2s",
                  boxShadow: selected ? "0 4px 12px rgba(130,0,0,0.25)" : "none",
                }}
              >
                <span style={{ fontSize: 30 }}>{shape.icon}</span>
                <span
                  style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    color: selected ? "#fff" : "#820000",
                  }}
                >
                  {shape.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
        color: "#A41515", textTransform: "uppercase", display: "block",
      }}
    >
      {children}
    </span>
  );
}
