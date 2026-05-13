import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple characters are entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    // Call onComplete if all fields are filled
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').substring(0, length);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);

    if (data.length === length) {
      onComplete(data);
    } else {
      inputs.current[data.length].focus();
    }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          ref={(el) => (inputs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
