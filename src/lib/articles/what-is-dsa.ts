import type { Article } from '../articles'

export const whatIsDsaArticle: Article = {
  slug: 'what-is-dsa',
  title: 'What is DSA and why does it matter?',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'Before you learn a single algorithm, let us talk about why any of this matters. This one will click fast.',
  readTime: '5 min',
  hasVisualizer: false,
  nextSlug: 'think-like-programmer',
  nextTitle: 'How to think like a programmer',
  sections: [
    { id: 'so-what-even-is-dsa', type: 'h2', content: 'So what even is DSA?' },
    {
      id: 's1-p1', type: 'p',
      content: 'DSA stands for Data Structures and Algorithms. That sounds fancy but it is really just two things — how you store data, and how you work with it.',
    },
    {
      id: 's1-p2', type: 'p',
      content: 'Think of it like a kitchen. A data structure is how you organize your kitchen — where the pots go, where the spices are, how the fridge is arranged. An algorithm is the recipe — the step by step process you follow to cook something.',
    },
    {
      id: 's1-p3', type: 'p',
      content: 'A well organized kitchen makes cooking fast and easy. A messy one makes everything harder. Same idea in code.',
    },
    {
      id: 's1-box', type: 'infobox', variant: 'yellow',
      content: 'Data structures are how you store and organize data. Algorithms are the steps you follow to do something with that data. Together they make your code fast, clean, and smart.',
    },

    { id: 'why-does-it-matter', type: 'h2', content: 'Why does it matter?' },
    {
      id: 's2-p1', type: 'p',
      content: 'Here is the honest answer — you can write code without knowing DSA. Lots of people do. But at some point you will hit a wall.',
    },
    {
      id: 's2-p2', type: 'p',
      content: 'Maybe your app slows down when it gets too many users. Maybe you cannot figure out how to solve a certain problem. Maybe you get stuck in a coding interview. That wall is usually a DSA wall.',
    },
    {
      id: 's2-p3', type: 'p',
      content: 'Once you understand DSA, problems that felt impossible start feeling obvious. You start seeing patterns everywhere. You write code that actually scales.',
    },
    {
      id: 's2-box', type: 'infobox', variant: 'pink',
      content: 'You do not need to memorize every algorithm. You need to understand the thinking behind them. That is what this site teaches.',
    },

    { id: 'what-will-you-learn-here', type: 'h2', content: 'What will you learn here?' },
    {
      id: 's3-p1', type: 'p',
      content: 'We start with the basics — what arrays are, how linked lists work, why stacks and queues exist. Then we move to sorting, searching, and eventually graphs and advanced algorithms.',
    },
    {
      id: 's3-p2', type: 'p',
      content: 'Every topic has a clear explanation written like a friend sitting next to you. And every algorithm has a visualizer so you can watch it happen, not just read about it.',
    },
    {
      id: 's3-p3', type: 'p',
      content: 'By the end you will not just know DSA — you will actually understand it.',
    },
    {
      id: 's3-box', type: 'infobox', variant: 'blue',
      content: 'Every article on this site ends with an oh I get it moment. That is the whole point. If you finish an article and you are still confused, that is on us — not you.',
    },

    { id: 'how-long-will-this-take', type: 'h2', content: 'How long will this take?' },
    {
      id: 's4-p1', type: 'p',
      content: 'Honest answer — it depends on how deep you go. The foundations take a few weeks if you go through one article a day. The advanced stuff takes longer.',
    },
    {
      id: 's4-p2', type: 'p',
      content: 'But here is what matters — you do not need to rush. Go at your own pace. Every article here is self contained. Read it, watch the visualizer, move on when you are ready.',
    },
    {
      id: 's4-p3', type: 'p',
      content: 'There is no deadline. No pressure. Just learning, one step at a time.',
    },
  ],
}
