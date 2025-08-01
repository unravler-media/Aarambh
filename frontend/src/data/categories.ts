
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export const categories: Category[] = [
  {
    id: "python",
    name: "Python",
    slug: "python",
    description: "Latest news, tutorials, and insights about Python programming language, libraries, and frameworks.",
    postCount: 12
  },
  {
    id: "golang",
    name: "Golang",
    slug: "golang",
    description: "Discover Go programming language tutorials, tips, best practices, and news about the ecosystem.",
    postCount: 8
  },
  {
    id: "malware",
    name: "Malware Development",
    slug: "malware-development",
    description: "Educational content about malware analysis, protection strategies, and security research.",
    postCount: 6
  },
  {
    id: "reverse",
    name: "Reverse Engineering",
    slug: "reverse-engineering",
    description: "Learn about reverse engineering techniques, tools, and methodologies for software analysis.",
    postCount: 7
  }
];
