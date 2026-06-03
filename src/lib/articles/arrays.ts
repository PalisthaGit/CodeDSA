import type { Article } from '../articles'

export const arraysArticle: Article = {
  slug: 'arrays',
  title: 'Arrays — your first data structure',
  chapter: 'Data structures',
  chapterSlug: 'data-structures',
  tagline: 'Do not worry, this one is the easiest. Once you get arrays, everything else clicks faster.',
  readTime: '10 min',
  hasVisualizer: true,
  prevSlug: 'big-o-notation',
  prevTitle: 'Big O notation — how we measure speed',
  nextSlug: 'linked-lists',
  nextTitle: 'Linked lists — when arrays are not enough',
  sections: [
    { id: 'arrays-visualizer', type: 'visualizer' },

    { id: 'so-what-even-is-an-array', type: 'h2', content: 'So what even is an array?' },
    {
      id: 'a1-p1', type: 'p',
      content: 'Imagine you have 5 boxes lined up in a row. Each box has a number on it — 0, 1, 2, 3, 4. You can put anything inside each box. That is basically an array.',
    },
    {
      id: 'a1-p2', type: 'p',
      content: 'In code, an array is just a list of items stored in order. Each item has a position called an index, and the index always starts at 0 — not 1. That trips people up at first but you will get used to it fast.',
    },
    {
      id: 'a1-box', type: 'infobox', variant: 'yellow',
      content: 'Think of it like seats on a bus. The first seat is seat 0, not seat 1. Weird at first, totally normal after a while.',
    },

    { id: 'how-do-you-use-an-array', type: 'h2', content: 'How do you use an array?' },
    {
      id: 'a2-p1', type: 'p',
      content: 'You can store anything in an array — numbers, names, whatever. Here is what it looks like in code.',
    },
    {
      id: 'a2-code', type: 'code', language: 'javascript',
      content: `let fruits = ["apple", "banana", "mango"]

fruits[0]  // "apple"
fruits[1]  // "banana"
fruits[2]  // "mango"`,
    },
    {
      id: 'a2-p2', type: 'p',
      content: 'You access each item using its index inside square brackets. Want the first item? fruits[0]. Want the third? fruits[2]. Simple.',
    },
    {
      id: 'a2-box', type: 'infobox', variant: 'pink',
      content: 'Common mistake — trying fruits[3] when there are only 3 items. Indices go 0 to 2 not 1 to 3. This gives you undefined which causes bugs that are hard to track down.',
    },

    { id: 'adding-and-removing-items', type: 'h2', content: 'Adding and removing items' },
    {
      id: 'a3-p1', type: 'p',
      content: 'You can add items to the end of an array using push. You can remove the last item using pop. You can add to the beginning using unshift. These are the most common operations.',
    },
    {
      id: 'a3-code', type: 'code', language: 'javascript',
      content: `let fruits = ["apple", "banana"]

fruits.push("mango")     // ["apple", "banana", "mango"]
fruits.pop()             // ["apple", "banana"]
fruits.unshift("grape")  // ["grape", "apple", "banana"]`,
    },

    { id: 'when-should-you-use-an-array', type: 'h2', content: 'When should you use an array?' },
    {
      id: 'a4-p1', type: 'p',
      content: 'Arrays are great when you know roughly how many items you need and you want to access them by position super fast. Need the 5th item? Done instantly.',
    },
    {
      id: 'a4-p2', type: 'p',
      content: 'They are not great when you need to insert or delete items from the middle a lot. That requires shifting everything around which gets slow with large arrays.',
    },
    {
      id: 'a4-box', type: 'infobox', variant: 'blue',
      content: 'Accessing any item in an array by index is O(1) — instant, no matter how big the array is. That is one of arrays biggest strengths.',
    },
  ],
}
