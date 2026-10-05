import { useEffect } from "react";

import {
  useNavigate
} from "react-router-dom";

import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

import {
  APP_WAKE_WORD,
  VOICE_ENABLED
} from "./wakeword";

import {
  processVoiceCommand
} from "../services/voiceService";

export default function VoiceAssistant() {

  const navigate =
    useNavigate();

  const {
    transcript,
    browserSupportsSpeechRecognition
  } =
    useSpeechRecognition();

  // Start Listening

  useEffect(() => {

    if (
      !VOICE_ENABLED
    ) {
      return;
    }

    SpeechRecognition.startListening(
      {
        continuous: true,
        language: "en-IN"
      }
    );

  }, []);

  // Auto Restart

  useEffect(() => {

    const interval =
      setInterval(() => {

        SpeechRecognition.startListening(
          {
            continuous: true,
            language: "en-IN"
          }
        );

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // Command Detection

  useEffect(() => {

    const text =
      transcript.toLowerCase();

    if (
      !text.includes(
        APP_WAKE_WORD
      )
    ) {
      return;
    }

    const command =
      text.replace(
        APP_WAKE_WORD,
        ""
      );

    processVoiceCommand(
      command,
      navigate
    );

  }, [
    transcript,
    navigate
  ]);

  if (
    !browserSupportsSpeechRecognition
  ) {

    return null;

  }

  return null;

}
