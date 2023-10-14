import { useCallback, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useGoogleRecaptchaV3 = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaIsLoading, setRecaptchaIsLoading] = useState<boolean>(false);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) return;
    try {
      setRecaptchaIsLoading(true);
      const recaptcha = await executeRecaptcha("tdtAction");
      return recaptcha;
    } catch (err) {
      return null;
    } finally {
      setRecaptchaIsLoading(false);
    }
  }, [executeRecaptcha]);

  return {
    handleReCaptchaVerify,
    recaptchaIsLoading,
  };
};
