const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'IMAGES', uid: 'images_count' },
  { name: 'STATUS', uid: 'status' },
  { name: 'ACTIONS', uid: 'actions' },
]

const users = [
  {
    id: 1,
    name: 'Overview',
    images_count: '3',
    status: 'active',
    age: '29',
    avatar: 'images/work/overview/slide-1.jpg',
    slug: 'overview',
  },
  {
    id: 2,
    name: 'L’Officiel',
    images_count: '3',
    status: 'inactive',
    age: '25',
    avatar: 'images/work/l-officiel/slide-1.jpg',
    slug: 'l-officiel',
  },
  {
    id: 3,
    name: 'The Ann Wagners',
    images_count: '3',
    status: 'active',
    age: '22',
    avatar: 'images/work/the-ann-wagners/slide-1.jpg',
    slug: 'the-ann-wagners',
  },
  {
    id: 4,
    name: 'KOSTÜME',
    images_count: '3',
    status: 'inactive',
    age: '28',
    avatar: 'images/work/kostume/slide-1.jpg',
    slug: 'kostume',
  },
  {
    id: 5,
    name: 'Ossira',
    images_count: '3',
    status: 'active',
    age: '24',
    avatar: 'images/work/ossira/slide-1.jpg',
    slug: 'ossira',
  },
]

export { columns, users }
