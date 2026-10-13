import otpGenerator from "otp-generator";

const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log("otp==", otp);
  return otp;
};

export default generateOTP;
