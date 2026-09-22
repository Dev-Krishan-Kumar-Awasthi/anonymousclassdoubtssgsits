export interface OOPClass {
  id: string;
  subject: string;
  code: string;
  type: 'Lecture' | 'Laboratory';
  day: string;
  time: string;
  room: string;
  section: string;
  teacher: string;
}

export interface Reply {
  id: string;
  doubtId?: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Doubt {
  id: string;
  classId: string;
  author: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

export const OOP_CLASSES: OOPClass[] = [
  {
    id: 'oop-monday-11',
    subject: 'Object Oriented Programming',
    code: 'OOP',
    type: 'Lecture',
    day: 'Monday',
    time: '11:00 AM – 12:00 PM',
    room: 'ATC-301',
    section: 'Section B',
    teacher: 'US',
  },
  {
    id: 'oop-lab-monday-b3',
    subject: 'Object Oriented Programming Laboratory',
    code: 'OOP LAB',
    type: 'Laboratory',
    day: 'Monday',
    time: '2:00 PM – 4:00 PM',
    room: 'Lab 207',
    section: 'Batch B3',
    teacher: 'US / VM',
  },
  {
    id: 'oop-lab-wednesday-b1',
    subject: 'Object Oriented Programming Laboratory',
    code: 'OOP LAB',
    type: 'Laboratory',
    day: 'Wednesday',
    time: '10:00 AM – 12:00 PM',
    room: 'Lab 207',
    section: 'Batch B1',
    teacher: 'US / VM',
  },
  {
    id: 'oop-wednesday-4',
    subject: 'Object Oriented Programming',
    code: 'OOP',
    type: 'Lecture',
    day: 'Wednesday',
    time: '4:00 PM – 5:00 PM',
    room: 'LT-002',
    section: 'Section B',
    teacher: 'US',
  },
  {
    id: 'oop-thursday-11',
    subject: 'Object Oriented Programming',
    code: 'OOP',
    type: 'Lecture',
    day: 'Thursday',
    time: '11:00 AM – 12:00 PM',
    room: 'ATC-309',
    section: 'Section B',
    teacher: 'US',
  },
  {
    id: 'oop-lab-friday-b2',
    subject: 'Object Oriented Programming Laboratory',
    code: 'OOP LAB',
    type: 'Laboratory',
    day: 'Friday',
    time: '4:00 PM – 6:00 PM',
    room: 'Lab 207',
    section: 'Batch B2',
    teacher: 'US / VM',
  },
];

export const INITIAL_DOUBTS: Record<string, Doubt[]> = {
  'oop-monday-11': [
    {
      id: 'd-1',
      classId: 'oop-monday-11',
      author: 'Anonymous Student',
      content: 'What is the difference between method overloading and overriding in Java?',
      createdAt: '15 min ago',
      replies: [
        {
          id: 'r-1',
          doubtId: 'd-1',
          author: 'Anonymous Student',
          content: 'Overloading happens within the same class with different parameters (compile-time), while overriding redefines a method in a subclass (runtime).',
          createdAt: '13 min ago',
        },
        {
          id: 'r-2',
          doubtId: 'd-1',
          author: 'Anonymous Student',
          content: 'Overloading uses different method signatures. Overriding requires the exact same signature.',
          createdAt: '10 min ago',
        },
      ],
    },
    {
      id: 'd-2',
      classId: 'oop-monday-11',
      author: 'Anonymous Student',
      content: 'Why do we need constructors if default constructor is automatically created by the compiler?',
      createdAt: '12 min ago',
      replies: [
        {
          id: 'r-3',
          doubtId: 'd-2',
          author: 'Anonymous Student',
          content: 'Parameterized constructors allow initializing instance variables with specific values during instantiation.',
          createdAt: '11 min ago',
        },
      ],
    },
    {
      id: 'd-3',
      classId: 'oop-monday-11',
      author: 'Anonymous Student',
      content: 'Can someone explain polymorphism with a simple real-life example?',
      createdAt: '9 min ago',
      replies: [
        {
          id: 'r-4',
          doubtId: 'd-3',
          author: 'Anonymous Student',
          content: 'A person behaves as a student in college, a customer at a store, and a passenger on a bus. One entity taking multiple forms.',
          createdAt: '7 min ago',
        },
      ],
    },
    {
      id: 'd-4',
      classId: 'oop-monday-11',
      author: 'Anonymous Student',
      content: 'What is the difference between a class and an object?',
      createdAt: '6 min ago',
      replies: [
        {
          id: 'r-5',
          doubtId: 'd-4',
          author: 'Anonymous Student',
          content: 'A class is the blueprint in memory; an object is an actual instance created in the heap with "new".',
          createdAt: '4 min ago',
        },
      ],
    },
    {
      id: 'd-5',
      classId: 'oop-monday-11',
      author: 'Anonymous Student',
      content: 'Why is multiple inheritance through classes not supported in Java?',
      createdAt: '3 min ago',
      replies: [
        {
          id: 'r-6',
          doubtId: 'd-5',
          author: 'Anonymous Student',
          content: 'To avoid the Diamond Problem ambiguity. Java supports multiple inheritance through interfaces instead.',
          createdAt: '1 min ago',
        },
      ],
    },
  ],
  'oop-lab-monday-b3': [
    {
      id: 'd-6',
      classId: 'oop-lab-monday-b3',
      author: 'Anonymous Student',
      content: 'In today lab experiment 3, should we take input using Scanner or BufferedReader?',
      createdAt: '4 min ago',
      replies: [
        {
          id: 'r-7',
          doubtId: 'd-6',
          author: 'Anonymous Student',
          content: 'Sir said Scanner is completely fine for this assignment.',
          createdAt: '2 min ago',
        },
      ],
    },
    {
      id: 'd-7',
      classId: 'oop-lab-monday-b3',
      author: 'Anonymous Student',
      content: 'Getting NullPointerException when creating array of objects. Any idea why?',
      createdAt: '9 min ago',
      replies: [
        {
          id: 'r-8',
          doubtId: 'd-7',
          author: 'Anonymous Student',
          content: 'Creating the array only allocates reference slots. You also need to instantiate each element in a loop with "new Student()".',
          createdAt: '6 min ago',
        },
      ],
    },
  ],
  'oop-lab-wednesday-b1': [
    {
      id: 'd-w1',
      classId: 'oop-lab-wednesday-b1',
      author: 'Anonymous Student',
      content: 'Getting NullPointerException when creating array of objects like Student[] arr = new Student[5]; How to fix?',
      createdAt: '10 min ago',
      replies: [
        {
          id: 'r-w1',
          doubtId: 'd-w1',
          author: 'Anonymous Student',
          content: 'Creating the array only allocates 5 reference slots which initially hold null. You must instantiate each element in a loop: arr[i] = new Student();',
          createdAt: '7 min ago',
        },
      ],
    },
    {
      id: 'd-w2',
      classId: 'oop-lab-wednesday-b1',
      author: 'Anonymous Student',
      content: 'what is class',
      createdAt: '18 min ago',
      replies: [
        {
          id: 'r-w2',
          doubtId: 'd-w2',
          author: 'Instructor (US)',
          content: 'A class in OOP is a user-defined blueprint or prototype from which objects are created. It represents the set of properties or methods that are common to all objects of one type.',
          createdAt: '12 min ago',
        },
      ],
    },
  ],
  'oop-wednesday-4': [
    {
      id: 'd-w3',
      classId: 'oop-wednesday-4',
      author: 'Anonymous Student',
      content: 'Why does super() call must be the very first statement inside a derived class constructor in Java?',
      createdAt: '5 min ago',
      replies: [
        {
          id: 'r-w3',
          doubtId: 'd-w3',
          author: 'Anonymous Student',
          content: 'Because the parent class state must be fully initialized before the child class constructor executes. Otherwise child code might access uninitialized inherited members.',
          createdAt: '3 min ago',
        },
        {
          id: 'r-w4',
          doubtId: 'd-w3',
          author: 'Instructor (US)',
          content: 'Remember if you do not write super(), Java automatically inserts super() with no arguments implicitly.',
          createdAt: '1 min ago',
        },
      ],
    },
    {
      id: 'd-w4',
      classId: 'oop-wednesday-4',
      author: 'Anonymous Student',
      content: 'Can abstract classes have constructors in Java or C++ if we cannot instantiate them?',
      createdAt: '14 min ago',
      replies: [
        {
          id: 'r-w5',
          doubtId: 'd-w4',
          author: 'Instructor (US)',
          content: 'Yes! Abstract classes can have constructors. They are executed via super() when concrete subclasses are instantiated to initialize common base fields.',
          createdAt: '8 min ago',
        },
      ],
    },
    {
      id: 'd-w5',
      classId: 'oop-wednesday-4',
      author: 'Anonymous Student',
      content: 'Can we override a private or static method in Java?',
      createdAt: '22 min ago',
      replies: [
        {
          id: 'r-w6',
          doubtId: 'd-w5',
          author: 'Anonymous Student',
          content: 'No! Static methods are bound at compile-time (method hiding), and private methods are not inherited at all.',
          createdAt: '16 min ago',
        },
      ],
    },
  ],
  'oop-thursday-11': [
    {
      id: 'd-th1',
      classId: 'oop-thursday-11',
      author: 'Anonymous Student',
      content: 'What is the Diamond Problem in multiple inheritance and how does C++ solve it?',
      createdAt: '12 min ago',
      replies: [
        {
          id: 'r-th1',
          doubtId: 'd-th1',
          author: 'Anonymous Student',
          content: 'The Diamond problem occurs when two parent classes inherit from the same grandparent. C++ solves it using virtual base classes (virtual public Base).',
          createdAt: '6 min ago',
        },
      ],
    },
  ],
  'oop-lab-friday-b2': [
    {
      id: 'd-f1',
      classId: 'oop-lab-friday-b2',
      author: 'Anonymous Student',
      content: 'Why does Java require virtual function mechanism by default whereas C++ requires the virtual keyword explicitly?',
      createdAt: '19 min ago',
      replies: [
        {
          id: 'r-f1',
          doubtId: 'd-f1',
          author: 'Anonymous Student',
          content: 'In Java, all non-static, non-final methods are virtual by default to embrace object-oriented polymorphism seamlessly.',
          createdAt: '11 min ago',
        },
      ],
    },
  ],
};
