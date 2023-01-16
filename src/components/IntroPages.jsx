import React from "react";
import ConsentForm from "./ConsentForm";

const PAGESTITLE = [
  "WELCOME",
  "FIRST",
  "ARTICLE",
  "METROSTOP",
  "METROLINES",
  "FINAL",
];

const TOTAL_SLIDES = PAGESTITLE.length;

const PAGES = PAGESTITLE.reduce((acc, curr, i) => {
  acc[curr] = i + 1;
  return acc;
}, {});

export { TOTAL_SLIDES, PAGES };

export function ExplanatoryPage() {
  return (
    <>
      <div className="text-2xl text-yellow-400 font-bold">
        EXPLANATORY STATEMENT
      </div>
      <div className=" text-left">
        Project ID: 36056
        <br></br>
        Project Title: Visually Communicating Narratives
      </div>
      <br></br>
      <br></br>
      <strong>Department of Human Centred Computing, Monash University</strong>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <strong>Chief Investigator: Dr. Sarah Goodwin </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:sarah.goodwin@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            sarah.goodwin@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Dr. Ying Yang </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:ying.yang@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            ying.yang@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Songhai Fan </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:songhai.fan@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            songhai.fan@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Professor. Tim Dwyer </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:tim.dwyer@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            tim.dwyer@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Professor. Helen Purchase </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:helen.purchase@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            helen.purchase@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Nancy Van Nieuwenhove </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:nancy.van.nieuwenhove@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            nancy.van.nieuwenhove@monash.edu
          </a>{" "}
          <br></br>
        </div>
        <div className="col-span-1">
          <strong>Co-investigator: Satya Borgohain </strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:stay.borgohain@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            stay.borgohain@monash.edu
          </a>{" "}
          <br></br>
        </div>
      </div>
      <br></br>
      <strong>Department of Human Centred Computing, Monash University</strong>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <strong>Co-investigator: Associate Professor. Simon Angus</strong>
          <br></br>
          Email:{" "}
          <a
            href="mailto:simon.angus@monash.edu"
            target="_blank"
            className="url"
            rel="noreferrer"
          >
            simon.angus@monash.edu
          </a>{" "}
          <br></br>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="text-yellow-400">
        <strong>What does the research involve?</strong>
      </div>
      <div>
        This study aims to investigate narrative visualisations about text data.
        In particular, this research explores and analyses text data, and
        produces visualisations to communicate the narratives from the data.
        This research will assess how well these visualisations reveal the
        narratives, and users's understanding of the visualisations and their
        interpretation of the narratives from the visualisations.
      </div>
      <div>
        If you choose to participate in this research, you will be asked to
        complete a user study by using a computer. This user study will be
        conducted online.
      </div>
      <div className="mt-[3%]">You will go through the following steps:</div>
      <div>
        <li>
          be given a copy of the electronic Consent Form, and be asked to sign
          the form if you wish to proceed;
        </li>
        <li> be asked to provide a Prolific ID;</li>
        <li>be given instructions on narrative visualisations;</li>
        <li>
          be asked to use a series of visualisations and answer questions based
          on the visualisations;
        </li>
        <li>be asked to complete a survey on demographics.</li>
      </div>
      <br></br>
      <div>
        Throughout the session, the time you take to complete each task and your
        answers will be recorded with coded identification. No name or contact
        details will be recorded in any electronic data during the experiment.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Why were you chosen for this research?</strong>
      </div>
      <div>
        You have been invited to participate in this research, as we believe
        that your experience and opinions will be valuable to our research. This
        Explanatory Statement has been presented to you as you expressed your
        interests in participation and were redirected to this study via
        Prolific.co.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>
          Consenting to participate in the project and withdrawing from the
          research
        </strong>
      </div>
      <div>
        Should you wish to participate in the study, your consent will be
        required to proceed. Your consent is voluntary and can be given by
        signing and dating a Consent Form before the beginning of the study. You
        may choose not to participate in this study without any implication. If
        you do proceed, you may also choose to withdraw at any stage during the
        study without any implication.
      </div>
      <div>
        The Consent Form and this Explanatory Statement has been presented to
        you for your review before the study. Once you have read the documents,
        you will be asked to sign and date the Consent Form before proceeding.
        If you wish to withdraw, simply exit from the online website and any
        recorded information up until that time will be deleted.
      </div>
      <div>
        Once you have completed the study, the final step of your participation
        is completing a questionnaire with demographic questions. This
        questionnaire does not require any identifiable information and is
        submitted anonymously. Therefore, if you request to withdraw after this
        step, all information will be deleted except the questionnaire.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Possible benefits and risks to participants</strong>
      </div>
      <div>
        Should you choose to participate, you will gain exposure to state-of-art
        narrative visualisations and gain insights into these kinds of
        visualisations. Information collected from this research will lead to
        the development of useful tools for narrative visualisations.
      </div>
      <div>
        We do not foresee any risks to you should you choose to participate.
        However, should you experience discomfort you will be free to end your
        participation in the research at any time. Breaks may be taken at any
        between tasks.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Payment</strong>
      </div>
      <div>
        As an appreciation for your time, we provide a payment of $5 with a rate
        of $7.5/hour to you after the study is completed. The payment is made
        automatically to your Prolific.co paypal account. No user name or
        contact details are recorded for processing the payment.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Confidentiality</strong>
      </div>
      <div>
        The confidentiality of your data is a priority throughout the course of
        the project. Any personally identifiable information will not be shared
        with anyone not involved in this project. Access will be limited to the
        researchers as listed at the top of this Explanatory Statement.
      </div>
      <div>
        After analysis, the collected information will be discussed as part of a
        report to the funding body, Paul Ramsay Foundation, and publications. If
        any answers you have given as part of your questionnaire are to be
        quoted, you will be contacted directly for permission to use this within
        the publications. You will be kept anonymous in the final work and you
        will not be identifiable from any responses that you give.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Storage of data</strong>
      </div>
      <div>
        Data collected will be stored within a Monash University Google Drive
        account. No physical copies of the data will be made. Access is limited
        to the owner user account by default, but limited access (view only) may
        be given to the members of the research team. This data will be retained
        for five years after the completion of the study.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Results</strong>
      </div>
      <div>
        The analysis of this data will be published in a report to Paul Ramsay
        Foundation and a publication. If you would like to be notified when the
        results are available, please send a request to the Chief Investigator,
        using the contact details at the beginning of the document.
      </div>
      <div className="text-yellow-400 mt-[3%]">
        <strong>Complaints</strong>
      </div>
      <div>
        Should you have any concerns or complaints about the conduct of the
        project, you are welcome to contact the Executive Officer, Monash
        University Human Research Ethics (MUHREC):
      </div>
      <div>
        Executive Officer Monash University Human Research Ethics Committee
        (MUHREC) Room 111, Building 3e Research Office Monash University VIC
        3800
      </div>
      <div>Tel: +61 3 9905 2052 </div>
      <div>
        Email:{" "}
        <a
          href="mailto:muhrec@monash.edu"
          target="_blank"
          className="url"
          rel="noreferrer"
        >
          muhrec@monash.edu
        </a>{" "}
      </div>
      <div>Fax: +61 3 9905 3831</div>
    </>
  );
}

export function WelcomePage({
  setIsFormSubmitted,
  isConfirmed,
  setIsConfirmed,
}) {
  return (
    <>
      <div className="mt-[15%]"></div>
      <div className="text-[2.5rem] font-bold">
        A user study to explore the narrative map
      </div>
      <br></br>
      <div className="text-emerald-400 text-left">
        Project ID: 36056 <br></br>Project Title: Visually Communicating
        Narratives
      </div>
      <br></br>
      <br></br>
      <div className="text-left">
        You are invited to take part in this study.
        <br></br>
        Please read the{" "}
        <span className="text-2xl text-yellow-400 font-bold">
          explanatory statemant
        </span>{" "}
        left first in full before deciding whether or not to participate in this
        research. If you would like further information regarding any aspect of
        this project, you are encouraged to contact the researchers via the
        phone numbers or email addresses listed in the explanatory statement.
        <br></br>
        <br></br>
        If you decided to continue the user study, please tick the box below to
        confirm that you have read and understood the information provided
        above, and that you agree to participate in this study.
        <br></br>
        <br></br>
        <ConsentForm
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
        />
        <br></br>
        {/* <div className="text-center">
          <a
            href="https://forms.gle/3kSmPTe5fkN6aGgE9"
            className="text-2xl text-yellow-400 font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setIsFormSubmitted(true);
            }}
          >
            Consent Form
          </a>{" "}
        </div> */}
      </div>
    </>
  );
}

export function FirstPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        How is Disadvantage Experienced and Described in the Australian Context?
      </div>
      <div className="mt-[3%]">
        We've re-imagined a{" "}
        <span className="text-yellow-400">'communication network'</span> to
        highlight a broad picture of those disadvantaged groups and associated
        issues being discussed in the news recently, and which groups and issues
        are being ignored.{" "}
        <span className="text-yellow-400">'Discourse of the present'</span> is a{" "}
        <span className="text-yellow-400">'living'</span> platform; it shows
        what's being discussed in the news right now! Click below to progress
        through the quick start guide, or click on{" "}
        <span className="text-yellow-400">( i )</span> to come back to this
        page:
        <br></br>
        <br></br>
        <ol className="list-decimal list-inside">
          <li>
            <span className="text-yellow-400">Australian news articles</span>{" "}
            are key to out visualisation. Articles on similar topics & published
            around the same time, are grouped as a set of overlapping
            rectangles, called{" "}
            <span className="text-yellow-400">'stations'</span>.
          </li>
          <li>
            Over time, the groups of articles can be connected and form a
            <span className="text-yellow-400">
              {" "}
              'multi lenses story' on a particular topic
            </span>
            , represented by
            <span className="text-yellow-400"> connecting lines</span> between
            stations. The strenght of the relationship between two stations is
            illustrated by colour, with yellow being the strongest.
          </li>
          <li>
            <span className="text-yellow-400">Multiple topics</span> can be
            discussed over the same period; narratives can{" "}
            <span className="text-yellow-400">merge</span> in a particular
            collection of articles or can{" "}
            <span className="text-yellow-400">split </span>
            into new ones.
          </li>
          <li>
            Discover two of the eight 'communication networks' we organised for
            you. They focus on{" "}
            <span className="text-yellow-400">
              disadvantage issues that tend to co-occur
            </span>
            .
          </li>
        </ol>
      </div>
      <div className="mt-[3%] mb-[3%]"></div>
    </>
  );
}

export function ArticlePage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Australian News Articles are Key to Our Visualisation
      </div>
      <div className="mt-[3%]">
        News articles represent the fundamental unit of the discourse of
        opportunity and disadvantage in Australia. The articles collected are
        from new publications. Each article is titled, authored and dated.
        Tracking the content of news articles allows us{" "}
        <span className="text-yellow-400">
          to map out how various topics are being discussed.
        </span>
        <br></br>
        <br></br>
        Looking at the bigger picture, we can see how frequently certain topics
        are featured in the news. News articles on similar topics that are
        published around the same time are grouped together in our visualisation
        as{" "}
        <span className="text-yellow-400">a set of overlapping rectangles</span>
        , which we call a <span className="text-yellow-400">'station'</span>.
        The number of articles in a station is indicated by the size of the
        stack of rectangles and by the number encircled beneath the station.
        Each station is labelled by its most representative news headline and by
        its most prominent keyword.
        <br></br>
        <br></br>A single article can highlight various disadvantage issues, and
        some issues are more common than others.
      </div>
    </>
  );
}

export function MetroStopPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Groups of Articles can be Related to One Another
      </div>
      <div className="mt-[3%]">
        When connected together, they can form a{" "}
        <span className="text-yellow-400">'multi lenses story'</span> about a
        particular social issues.
        <br></br>
        <br></br>
        Over time, we end up with various collections of published news
        articles, or stations. Two stations sharing a similar topic{" "}
        <span className="text-yellow-400">
          can be linked by a connecting line
        </span>
        . These connections are labeled using the most common link or topic
        between the two stations.
        <br></br>
        <br></br>
        Depending on the frequency of the shared keywords or the number of
        unique shared keywords, we can start to make assumptions about the{" "}
        <span className="text-yellow-400">strength</span> of the relationship
        between two stations. The strength is illustrated by colour; purple on
        the weak end of the spectrum or yellow on the strong end.
        <br></br>
        <br></br>
        Stations don't just have one single connection, they can be{" "}
        <span className="text-yellow-400">
          connected to many other stations
        </span>
        . This means that interesting structures can emerge from these
        connections.
      </div>
    </>
  );
}

export function MetroLinesPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Multiple Topics are Discussed Over the Same Period of Time
      </div>
      <div className="mt-[3%]">
        The stations (and the articles they represent) don't all exist at the
        same time, and are each associated with a{" "}
        <span className="text-yellow-400">specific time period</span>. The
        connection lines are therefore drawn to indicate how a topic has been
        discussed over time in recent media. For example: on the top line, we
        can see that the topic has been less frequently discussed recently,
        since most of that line's articles are further back in time, on the left
        end of the line.
        <br></br>
        <br></br>
        Each entire line can be seen as a specific topic or event, and its
        discussion over time is summarised by keywords labelling each connection
        between stations. Multiple topic lines mean multiple stories. The{" "}
        <span className="text-yellow-400">
          topic lines running in parallel{" "}
        </span>
        represent narratives that exist over the same time period. But what
        happens when narratives intersect or branch to form new discussions?
        <br></br>
        <br></br>
        <ul className="list-disc list-inside">
          <li>
            When <span className="text-yellow-400">narratives merge</span> in a
            particular collection of articles, so do their topic lines.
          </li>
          <li>
            When <span className="text-yellow-400">narratives split</span>,
            their topic line splits to form two new topic lines with groups of
            articles that each discuss the newly separate narratives.
          </li>
        </ul>
        <br></br>
        The connection lines paint us a quite literal{" "}
        <span className="text-yellow-400">
          picture of what the discourse looks like.
        </span>
      </div>
    </>
  );
}

export function FinalPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">What to Focus on?</div>
      <div className="mt-[3%]">
        The discourse of equity, opportunity, and disadvantage is complex and
        multidimensional. It has many intersecting elements that can be viewed
        through a multitude of lenses.{" "}
        <span className="text-yellow-400">Some issues are more common</span>{" "}
        than others (e.g. violence, addiction), and{" "}
        <span className="text-yellow-400">some tend to co-occur</span>, like the
        eight groups listed below.
        <br></br>
        <br></br>
        <ol className="list-decimal list-inside">
          <li>Voice, Segregation, Prejudice & Discrimination, Human Rights</li>
          <li>Work, Finance, Family, Government Assistance</li>
          <li>Equity, Fairness</li>
          <li>Poverty, Shelter</li>
          <li>General Disadvantage, Education</li>
          <li>Criminal Justice, Addiction, Child Protection, Violence</li>
          <li>Vulnerable, Negative Emotions</li>
          <li>Health, Food & Nutrition</li>
        </ol>
      </div>
    </>
  );
}
