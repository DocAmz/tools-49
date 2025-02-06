import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Resume() {
  const skills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
    "MongoDB", "SQL", "HTML", "CSS", "Git", "AWS", "Docker", "GraphQL"
  ]

  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovators Inc.",
      period: "2020 - Present",
      description: "Lead development of complex web applications using React and Node.js.",
      achievements: [
        "Implemented microservices architecture, improving scalability by 40%",
        "Mentored junior developers, increasing team productivity by 25%",
        "Introduced automated testing, reducing bug reports by 60%"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "WebSolutions Co.",
      period: "2017 - 2020",
      description: "Developed and maintained various client projects using MERN stack.",
      achievements: [
        "Optimized database queries, improving application performance by 30%",
        "Implemented responsive design, increasing mobile user engagement by 50%",
        "Developed custom CMS, reducing content update time by 70%"
      ]
    },
    {
      title: "Junior Web Developer",
      company: "StartUp Ventures",
      period: "2015 - 2017",
      description: "Assisted in front-end development using HTML, CSS, and JavaScript.",
      achievements: [
        "Contributed to the launch of 5 successful web applications",
        "Improved website load times by 25% through code optimization",
        "Implemented A/B testing, leading to a 15% increase in user conversions"
      ]
    },
  ]

  return (
    <div className="min-w-full flex justify-center">
      <div className="max-w-4xl space-y-6 mx-auto">
      <h1 className="text-4xl font-bold text-left bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
        My Professional Journey
      </h1>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="border-b border-primary/20 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-xl font-semibold text-primary">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} | {exp.period}
                </p>
                <p className="mt-2">{exp.description}</p>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

