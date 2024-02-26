import React, { FormEvent, useEffect, useRef, useState } from 'react';

const minutes_tokens = [0, 59, '*', '-', ',','/'];
//3-45 * 4-45/2 */2 1,2,3
const parseMinutes = (minutes: string): string[] => {
  const minutestext = [];
  let minutestemp = minutes;
  if (minutes.includes('/')) {
    const parts = minutes.split('/');
    if (parts.length == 2 && /\d{1,2}/.test(parts[1])) {
      const mindiv = Number(parts[1]);
      minutestext.push(mindiv);
      minutestemp=parts[0];
    }
  }
  if (minutestemp === '*') {
    minutestext.push('Every Minute');
  }  
  if (
    minutestemp.includes('-') &&
    !minutestemp.includes(',') &&
    !minutestemp.includes('*')
  ) {
    const parts = minutestemp.split('-');
    if (
      parts.length == 2 &&
      /\d{1,2}/.test(parts[0]) &&
      /\d{1,2}/.test(parts[1])
    ) {
      const minpart1 = Number(parts[0]);
      const minpart2 = Number(parts[1]);
      if (
        minpart1 < minpart2 &&
        minpart1 >= 0 &&
        minpart1 <= 59 &&
        minpart2 >= 0 &&
        minpart2 <= 59
      ) {
        minutestext.push(minpart1);
        minutestext.push(minpart2);
      }
    }
  }

  return minutestext;
};

export default function CronTabSearch() {
  const [cronText, setCronText] = useState<string>('');
  const [valid, setValid] = useState(true);
  const [minutesPart, setMinutesPart] = useState(['']);
  const cronTextRef = useRef<HTMLInputElement>(null);
  const cronTabFormRef = useRef<HTMLFormElement>(null);

  const validateCronText = () => {
    const parts: string[] = cronText.split(' ');
    console.log(parts.length);

    if (parts.length != 5) {
      cronTextRef.current.setCustomValidity('invalid cron text');
      setValid(false);
    } else {
      cronTextRef.current.setCustomValidity('');
      const [minutes, hours, day, month, week] = parts;
      const minutesPart = parseMinutes(minutes);
      console.log(minutesPart);
      setMinutesPart(minutesPart);
      setValid(true);
    }
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    validateCronText();
    if (cronTabFormRef.current.checkValidity()) {
      alert('is valid');
    }
  };
  return (
    <form
      name="crontabform"
      ref={cronTabFormRef}
      onSubmit={submitForm}
      noValidate
    >
      <>
        <div>
          <label htmlFor="crontext">Cron Text</label>
          <input
            name="crontext"
            ref={cronTextRef}
            type="text"
            value={cronText}
            onChange={(e) => setCronText(e.currentTarget.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
        {!valid && (
          <span>Errors: {cronTextRef.current?.validationMessage}</span>
        )}
        {valid && minutesPart.forEach((m) => <p>{m}</p>)}
      </>
    </form>
  );
}
