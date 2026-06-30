'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Image from 'next/image';
import { handleGenerateProfileFromImage } from '@/lib/actions/home-action';
import { handleSaveSilhouetteProfile } from '@/lib/actions/silhouette-action';

const buildShapes = ['Slim', 'Athletic', 'Curvy', 'Average', 'Plus Size'];
const skinTones = [
  { group: 'Fair', shades: ['#fce7da', '#f5d0b5', '#e9b897'] },
  { group: 'Medium', shades: ['#d19d7d', '#bd8565', '#a56c4d'] },
  { group: 'Dark', shades: ['#7c462b', '#572d1a', '#3b1c10'] },
];
const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'];

export default function SilhouettePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzingPortrait, setAnalyzingPortrait] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  // Form State
  const [gender, setGender] = useState('female');
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [build, setBuild] = useState('Average');
  const [skinTone, setSkinTone] = useState('#fce7da');
  const [faceShape, setFaceShape] = useState('Oval');

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const openPortraitPicker = () => {
    fileInputRef.current?.click();
  };

  const handlePortraitSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const previewUrl = URL.createObjectURL(file);
    setPortraitPreview(previewUrl);
    setAnalyzingPortrait(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await handleGenerateProfileFromImage({
        imageFormData: formData,
        profileData: {
          gender,
          height,
          weight,
          bodyType: build,
          skinTone: skinTones.find((group) => group.shades.includes(skinTone))?.group || 'Medium',
          skinToneHex: skinTone,
          faceShape,
        },
        source: 'Silhouette Portrait Upload',
      });

      if (result.success && result.data?.profileData) {
        const analyzed = result.data.profileData;
        if (analyzed.gender) setGender(analyzed.gender);
        if (analyzed.height) setHeight(analyzed.height);
        if (analyzed.weight) setWeight(analyzed.weight);
        if (analyzed.bodyType) setBuild(analyzed.bodyType);
        if (analyzed.faceShape) setFaceShape(analyzed.faceShape);
        if (analyzed.skinToneHex) setPortraitPreview(previewUrl);
        if (analyzed.skinToneHex) {
          const matchedGroup = skinTones.find((group) => group.shades.includes(analyzed.skinToneHex));
          if (matchedGroup) {
            setSkinTone(analyzed.skinToneHex);
          }
        }
      } else {
        setError(result.message || 'Could not analyze portrait right now.');
      }
    } catch (err) {
      console.error('Portrait upload failed', err);
      setError('Could not analyze portrait right now.');
    } finally {
      setAnalyzingPortrait(false);
      event.target.value = '';
    }
  };

  const submitProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedSkinToneGroup =
        skinTones.find((group) => group.shades.includes(skinTone))?.group || 'Medium';

      const result = await handleSaveSilhouetteProfile({
        gender,
        height,
        weight,
        bodyType: build,
        skinTone: selectedSkinToneGroup,
        skinToneHex: skinTone,
        faceShape,
      });

      if (!result.success) {
        setError(result.message || 'Failed to save profile');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save profile', error);
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden border border-neutral-700">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Style Profile
            </h1>
            <div className="text-sm font-medium text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full">
              Step {step} of 3
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-neutral-700 h-2 rounded-full mb-10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-semibold mb-6">Body Proportions</h2>
                  
                  {/* Gender Toggle */}
                  <div className="flex bg-neutral-900 rounded-xl p-1 gap-1">
                    {['female', 'male', 'other'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-3 rounded-lg text-sm font-medium capitalize transition-all ${
                          gender === g
                            ? 'bg-neutral-700 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  {/* Height Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-300">Height</span>
                      <span className="font-medium text-pink-400">{height} cm</span>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="220"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  {/* Weight Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-300">Weight</span>
                      <span className="font-medium text-violet-400">{weight} kg</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  {/* Build/Shape Pills */}
                  <div>
                    <span className="block text-neutral-300 mb-3">Body Build</span>
                    <div className="flex flex-wrap gap-3">
                      {buildShapes.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setBuild(shape)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            build === shape
                              ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                              : 'border-neutral-600 text-neutral-400 hover:border-neutral-500'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-semibold mb-6">Skin Tone</h2>
                  
                  <div className="space-y-6">
                    {skinTones.map((group) => (
                      <div key={group.group}>
                        <h3 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">
                          {group.group}
                        </h3>
                        <div className="flex gap-4">
                          {group.shades.map((shade) => (
                            <button
                              key={shade}
                              onClick={() => setSkinTone(shade)}
                              className={`w-16 h-16 rounded-full transition-transform ${
                                skinTone === shade
                                  ? 'ring-4 ring-offset-4 ring-offset-neutral-800 ring-pink-500 scale-110'
                                  : 'hover:scale-105 ring-1 ring-neutral-700'
                              }`}
                              style={{ backgroundColor: shade }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-semibold mb-6">Face & Photo</h2>
                  
                  {/* Photo Upload Area */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePortraitSelected}
                  />
                  <button
                    type="button"
                    onClick={openPortraitPicker}
                    className="w-full border-2 border-dashed border-neutral-600 rounded-2xl p-8 text-center hover:border-pink-500 hover:bg-pink-500/5 transition-colors cursor-pointer group"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-700 transition-colors group-hover:bg-pink-500/20">
                      {portraitPreview ? (
                        <Image
                          src={portraitPreview}
                          alt="Portrait preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-neutral-400 group-hover:text-pink-400" />
                      )}
                    </div>
                    <p className="font-medium text-neutral-200">
                      {analyzingPortrait ? 'Analyzing portrait...' : 'Upload a portrait'}
                    </p>
                    <p className="text-sm text-neutral-400 mt-2">
                      Helps AI analyze your features accurately
                    </p>
                  </button>

                  {/* Manual Face Shape */}
                  <div>
                    <span className="block text-neutral-300 mb-4">Or select face shape manually</span>
                    <div className="grid grid-cols-3 gap-3">
                      {faceShapes.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setFaceShape(shape)}
                          className={`p-4 rounded-xl text-center transition-all border ${
                            faceShape === shape
                              ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                              : 'bg-neutral-900 border-transparent text-neutral-400 hover:bg-neutral-700'
                          }`}
                        >
                          <User className={`w-6 h-6 mx-auto mb-2 ${
                            faceShape === shape ? 'text-violet-400' : 'text-neutral-500'
                          }`} />
                          <span className="text-sm font-medium">{shape}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-neutral-900 border-t border-neutral-700 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              step === 1
                ? 'text-neutral-600 cursor-not-allowed'
                : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={submitProfile}
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze My Style'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
