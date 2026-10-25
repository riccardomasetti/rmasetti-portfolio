/*
 * Add a new experience by copying one object below.
 * `startDate` is used to sort the timeline automatically (newest first).
 * `period` is the text displayed to visitors, so it can include exact dates.
 * `logo` and `logoAlt` are optional; replace the placeholder path with a real logo when ready.
 */
const experiencesData = [
  {
    company: "European Space Agency (ESA) · European Astronaut Centre",
    role: "Intern",
    location: "Cologne, Germany",
    startDate: "2026-07-01",
    period: "1 July 2026 — 31 December 2026",
    current: true,
    icon: "send",
    logo: "media/esa-logo.png",
    logoAlt: "European Space Agency logo",
    description: "Internship at the European Space Agency (ESA), based at the European Astronaut Centre in Cologne, developing a machine learning framework for real-time mineral recognition."
  },
  {
    company: "NECSTLab · Politecnico di Milano",
    role: "Student Researcher",
    location: "Milan, Italy",
    startDate: "2025-04-01",
    period: "April 2025 — Present",
    current: true,
    icon: "search",
    logo: "media/necst-logo.png",
    logoAlt: "NECSTLab logo",
    description: "Previous work focused on exploring machine learning techniques for pangenomic variant classification, leading to a research paper accepted at IEEE EMBC 2026 (not yet published).\n\nThen, the project has evolved in a new direction. I am now working on graph machine learning, investigating how the JEPA framework can be applied to self-supervised learning on graphs to generate high-quality embeddings."
  },
  {
    company: "eva",
    role: "Co-founder & Software Engineer",
    location: "Milan, Italy",
    startDate: "2025-01-01",
    period: "January 2025 — January 2026",
    icon: "activity",
    logo: "media/eva-logo.png",
    description: "I tried, together with my colleagues, to build a web platform to help STEM students prepare for university exams, including an AI-powered workflow for generating tailored practice tests and quizzes from their own materials. Unfortunately, due to operating costs and intense market competition, the project was discontinued, but it was a great learning experience that also lead to a published research paper on AI-assisted educational tools."
  },
  {
    company: "University of Modena and Reggio Emilia",
    role: "Software Engineer",
    location: "Modena, Italy",
    startDate: "2024-02-01",
    period: "February 2024 — September 2024",
    icon: "code",
    description: "For my master's thesis, I worked on Missioni Unimore, a Django web application used to manage university business trips and expense reimbursements."
  },
  {
    company: "MoRe Racing Combustion",
    role: "Software Engineer",
    location: "Modena, Italy",
    startDate: "2023-03-01",
    period: "March 2023 — October 2023",
    icon: "cpu",
    description: "Worked in the Electronics & IT team of the Formula Student project, developing real-time telemetry, structured sensor-data logging, and a multi-level remote-access infrastructure."
  }
];
