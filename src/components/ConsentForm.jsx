import React from "react";

const ConsentForm = ({ isConfirmed, setIsConfirmed }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsConfirmed(true);
    console.log("submitted");
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="consent"
        >
          I consent to the following:
        </label>
        <ul className="list-disc text-gray-700 text-sm">
          <li>Take part in a user study of approximately 40 minutes.</li>
          <li>Use visualizations to complete a series of tasks.</li>
          <li>Complete a survey on demographic questions.</li>
          <li>
            My responses to be used in any report and publication resulting from
            the research.
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isConfirmed ? "Consent confirmed" : "I consent"}
        </button>
      </div>
    </form>
  );
};

export default ConsentForm;
