import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useGoogleRecaptchaV3 = () => {
	const { executeRecaptcha } = useGoogleReCaptcha();

	const handleReCaptchaVerify = useCallback(() => {
		if (!executeRecaptcha) return;
		return executeRecaptcha("tdtAction");
	}, [executeRecaptcha]);

	return {
		handleReCaptchaVerify,
	};
};
