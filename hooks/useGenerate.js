import { useState, useRef, useCallback } from "react";
import { generateImage, QUALITY_SUFFIX } from "../utils/api";
import { addHistory } from "../store/appStore";

export function useGenerate() {
  const [loading,   setLoading]   = useState(false);
  const [imageUri,  setImageUri]  = useState(null);
  const [elapsed,   setElapsed]   = useState(null);
  const [error,     setError]     = useState(null);

  const timerRef  = useRef(null);
  const startRef  = useRef(null);
  const abortRef  = useRef(null);

  const generate = useCallback(async ({
    prompt, model, negPrompt, settings, aspectRatio, stylePreset,
  }) => {
    if (!prompt.trim()) return { error: "Please enter a prompt." };

    setLoading(true);
    setImageUri(null);
    setError(null);
    setElapsed(null);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(((Date.now() - startRef.current) / 1000).toFixed(1));
    }, 100);

    const prefix = stylePreset && stylePreset.prefix ? stylePreset.prefix + " " : "";
    const finalPrompt = prefix + prompt.trim() + QUALITY_SUFFIX;

    try {
      const uri = await generateImage({
        prompt:    finalPrompt,
        model,
        negPrompt,
        steps:     settings.steps,
        guidance:  settings.guidance,
        seed:      settings.seed || null,
        genWidth:  aspectRatio.w,
        genHeight: aspectRatio.h,
      });

      clearInterval(timerRef.current);
      const t = ((Date.now() - startRef.current) / 1000).toFixed(1);
      setElapsed(t);
      setImageUri(uri);

      addHistory({
        uri,
        prompt: finalPrompt,
        rawPrompt: prompt.trim(),
        model,
        elapsed: t,
        steps: settings.steps,
        aspectLabel: aspectRatio.label,
        aspectRatio,
        stylePreset: stylePreset?.label || "None",
      });

      return { uri, elapsed: t };
    } catch (e) {
      clearInterval(timerRef.current);
      setError(e.message || "Generation failed.");
      return { error: e.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setLoading(false);
    setImageUri(null);
    setElapsed(null);
    setError(null);
  }, []);

  return { loading, imageUri, elapsed, error, generate, reset };
}