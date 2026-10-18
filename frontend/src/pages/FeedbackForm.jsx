import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { submitFeedback } from "../services/feedbackApi.js";

const LIKED = [
  "Design",
  "Quality",
  "Price",
  "Packaging",
  "Staff",
  "Stall look",
];
const REASONS = [
  "Price",
  "Wanted other designs",
  "Other colours/sizes",
  "Just browsing",
  "Will buy online",
];
const EMOJI = ["😞", "😕", "😐", "🙂", "😍"];

const chip = (on) =>
  "tw:px-4 tw:py-2 tw:rounded-full tw:border tw:text-sm " +
  (on
    ? "tw:bg-[#1F4E47] tw:text-white tw:border-[#1F4E47]"
    : "tw:bg-white tw:text-[#1C2B28] tw:border-[#E7E0CE]");

const inputCls =
  "tw:w-full tw:border tw:border-[#E7E0CE] tw:rounded-xl tw:p-3 tw:bg-white";

export default function FeedbackForm() {
  const [params] = useSearchParams();
  const event = params.get("event") || "general";

  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState([]);
  const [purchased, setPurchased] = useState("");
  const [reasons, setReasons] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const toggle = (list, setList, item, max = 99) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else if (list.length < max) setList([...list, item]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!rating || !purchased) {
      return setError("Please give a rating and tell us if you purchased.");
    }
    setError("");
    setLoading(true);
    try {
      await submitFeedback({
        event,
        rating,
        liked,
        purchased,
        reasons,
        suggestion,
        name,
        contact,
        optIn,
      });
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    navigate("/products");
    // return (
    //   <div className="tw:min-h-screen tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-6 tw:text-center tw:bg-[#FAF7EF]">
    //     <div className="tw:text-5xl tw:mb-4">💛</div>
    //     <h1 className="tw:text-2xl tw:font-semibold tw:mb-2 tw:text-[#1C2B28]">Thank you!</h1>
    //     {/* <p className="tw:text-[#5E6D67] tw:mb-4">Show this screen at our stall to get your gift.</p> */}
    //     {/* <div className="tw:border-2 tw:border-dashed tw:border-[#AD8A3F] tw:rounded-xl tw:px-6 tw:py-3 tw:text-xl tw:font-bold tw:text-[#AD8A3F]">
    //       THANKS10
    //     </div> */}
    //   </div>
    // );
  }

  return (
    <form
      onSubmit={submit}
      className="tw:max-w-md tw:mx-auto tw:p-5 tw:space-y-6 tw:bg-[#FAF7EF] tw:min-h-screen"
    >
      <div className="tw:text-center">
        <h1 className="tw:text-2xl tw:font-semibold tw:text-[#1C2B28]">
          How was your visit?
        </h1>
        <p className="tw:text-[#5E6D67] tw:text-sm">
          Takes less than 30 seconds 🙏
        </p>
      </div>

      {/* 1. Rating */}
      <div>
        <p className="tw:font-medium tw:mb-2">Overall experience *</p>
        <div className="tw:flex tw:justify-between">
          {EMOJI.map((e, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setRating(i + 1)}
              className={
                "tw:text-3xl tw:p-2 tw:rounded-xl " +
                (rating === i + 1 ? "tw:bg-[#E7E0CE]" : "tw:opacity-60")
              }
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Liked most */}
      <div>
        <p className="tw:font-medium tw:mb-2">
          What did you like most? (pick up to 2)
        </p>
        <div className="tw:flex tw:flex-wrap tw:gap-2">
          {LIKED.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => toggle(liked, setLiked, l, 2)}
              className={chip(liked.includes(l))}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Purchased */}
      <div>
        <p className="tw:font-medium tw:mb-2">Did you purchase today? *</p>
        <div className="tw:flex tw:gap-2">
          {[
            ["yes", "Yes"],
            ["no", "No"],
            ["thinking", "Thinking"],
          ].map(([v, label]) => (
            <button
              type="button"
              key={v}
              onClick={() => setPurchased(v)}
              className={chip(purchased === v)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Reasons (only if not purchased) */}
      {(purchased === "no" || purchased === "thinking") && (
        <div>
          <p className="tw:font-medium tw:mb-2">What stopped you?</p>
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {REASONS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => toggle(reasons, setReasons, r)}
                className={chip(reasons.includes(r))}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Suggestion */}
      <div>
        <p className="tw:font-medium tw:mb-2">
          Anything we should add or improve?
        </p>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="e.g. more silver pieces, custom orders..."
          className={inputCls}
        />
      </div>

      {/* 6. Contact */}
      <div className="tw:space-y-3">
        <p className="tw:font-medium">Stay in touch (optional)</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputCls}
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="WhatsApp number or Instagram"
          className={inputCls}
        />
        <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#5E6D67]">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
          />
          Send me new collection updates and offers
        </label>
      </div>

      {error && <p className="tw:text-[#9C4E3A] tw:text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="tw:w-full tw:bg-[#1F4E47] tw:text-white tw:py-3 tw:rounded-xl tw:text-lg tw:font-medium tw:disabled:opacity-60"
      >
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
